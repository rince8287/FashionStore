import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";

// ======================================================
// CONSTANTS
// ======================================================

const GOOGLE_ISSUERS = [
  "https://accounts.google.com",
  "accounts.google.com",
];

const APPLE_ISSUER =
  "https://appleid.apple.com";

const APPLE_JWKS_URL =
  "https://appleid.apple.com/auth/keys";


// ======================================================
// GENERATE FASHIONSTORE JWT
// ======================================================

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};


// ======================================================
// SAFE USER RESPONSE
// ======================================================

const getSafeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    avatar: user.avatar || "",
    role: user.role,
    isVerified:
      user.isVerified === true,
    isActive:
      user.isActive !== false,
    authProvider:
      user.authProvider || "local",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};


// ======================================================
// NORMALIZE EMAIL
// ======================================================

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};


// ======================================================
// NORMALIZE PHONE
// ======================================================

const normalizePhone = (phone) => {
  if (!phone) {
    return "";
  }

  return String(phone)
    .trim()
    .replace(/\s+/g, "");
};


// ======================================================
// FETCH JSON
// ======================================================

const fetchJson = async (
  url,
  options = {}
) => {
  const response = await fetch(
    url,
    options
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error_description ||
        data?.error ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
};


// ======================================================
// DECODE JWT HEADER
// ======================================================

const decodeJwtHeader = (token) => {
  try {
    const parts =
      String(token).split(".");

    if (parts.length !== 3) {
      return null;
    }

    return JSON.parse(
      Buffer.from(
        parts[0],
        "base64url"
      ).toString("utf8")
    );
  } catch {
    return null;
  }
};


// ======================================================
// GET JWT PAYLOAD WITHOUT TRUSTING IT
// ======================================================

const decodeJwtPayload = (token) => {
  try {
    const parts =
      String(token).split(".");

    if (parts.length !== 3) {
      return null;
    }

    return JSON.parse(
      Buffer.from(
        parts[1],
        "base64url"
      ).toString("utf8")
    );
  } catch {
    return null;
  }
};


// ======================================================
// JWKS CACHE
// ======================================================

const jwksCache = new Map();


// ======================================================
// GET JWKS
// ======================================================

const getJwks = async (url) => {
  const cached =
    jwksCache.get(url);

  const now = Date.now();

  // ----------------------------------------------------
  // Cache for 1 hour
  // ----------------------------------------------------

  if (
    cached &&
    cached.expiresAt > now
  ) {
    return cached.keys;
  }

  const data =
    await fetchJson(url);

  if (
    !data ||
    !Array.isArray(data.keys)
  ) {
    throw new Error(
      "Invalid JWKS response."
    );
  }

  jwksCache.set(
    url,
    {
      keys: data.keys,
      expiresAt:
        now + 60 * 60 * 1000,
    }
  );

  return data.keys;
};


// ======================================================
// JWK → PUBLIC KEY
// ======================================================

const jwkToPublicKey = (jwk) => {
  return crypto
    .createPublicKey({
      key: jwk,
      format: "jwk",
    })
    .export({
      type: "spki",
      format: "pem",
    });
};


// ======================================================
// VERIFY JWT WITH JWKS
// ======================================================

const verifyJwtWithJwks = async ({
  token,
  jwksUrl,
  issuer,
  audience,
}) => {

  // ----------------------------------------------------
  // Basic token validation
  // ----------------------------------------------------

  if (!token) {
    throw new Error(
      "Identity token is required."
    );
  }

  const header =
    decodeJwtHeader(token);

  if (!header) {
    throw new Error(
      "Invalid identity token."
    );
  }

  // ----------------------------------------------------
  // Only RS256 accepted
  // ----------------------------------------------------

  if (header.alg !== "RS256") {
    throw new Error(
      "Unsupported identity token algorithm."
    );
  }

  if (!header.kid) {
    throw new Error(
      "Identity token key ID is missing."
    );
  }

  // ----------------------------------------------------
  // Get provider keys
  // ----------------------------------------------------

  const keys =
    await getJwks(jwksUrl);

  const jwk =
    keys.find(
      (key) =>
        key.kid === header.kid
    );

  if (!jwk) {
    // --------------------------------------------------
    // Key rotation can happen.
    // Refresh cache once.
    // --------------------------------------------------

    jwksCache.delete(jwksUrl);

    const refreshedKeys =
      await getJwks(jwksUrl);

    const refreshedJwk =
      refreshedKeys.find(
        (key) =>
          key.kid === header.kid
      );

    if (!refreshedJwk) {
      throw new Error(
        "Unable to find identity provider signing key."
      );
    }

    return verifyJwtWithPublicKey(
      token,
      refreshedJwk,
      issuer,
      audience
    );
  }

  return verifyJwtWithPublicKey(
    token,
    jwk,
    issuer,
    audience
  );
};


// ======================================================
// VERIFY JWT WITH PUBLIC KEY
// ======================================================

const verifyJwtWithPublicKey = (
  token,
  jwk,
  issuer,
  audience
) => {

  const publicKey =
    jwkToPublicKey(jwk);

  const payload =
    jwt.verify(
      token,
      publicKey,
      {
        algorithms: ["RS256"],
        issuer,
        audience,
      }
    );

  return payload;
};


// ======================================================
// VERIFY GOOGLE ID TOKEN
// ======================================================

const verifyGoogleToken = async (
  idToken
) => {

  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      "GOOGLE_CLIENT_ID is not configured."
    );
  }

  const payload =
    await verifyJwtWithJwks({
      token: idToken,

      jwksUrl:
        "https://www.googleapis.com/oauth2/v3/certs",

      issuer:
        GOOGLE_ISSUERS,

      audience: clientId,
    });

  // ----------------------------------------------------
  // Google identity validation
  // ----------------------------------------------------

  if (!payload.sub) {
    throw new Error(
      "Google account ID is missing."
    );
  }

  if (!payload.email) {
    throw new Error(
      "Google account email is missing."
    );
  }

  // ----------------------------------------------------
  // Google email must be verified
  // ----------------------------------------------------

  if (
    payload.email_verified !== true &&
    payload.email_verified !== "true"
  ) {
    throw new Error(
      "Google email is not verified."
    );
  }

  return {
    providerId:
      String(payload.sub),

    email:
      normalizeEmail(payload.email),

    name:
      String(
        payload.name ||
          payload.given_name ||
          "Google User"
      ).trim(),

    avatar:
      String(
        payload.picture || ""
      ).trim(),
  };
};


// ======================================================
// VERIFY APPLE ID TOKEN
// ======================================================

const verifyAppleToken = async (
  idToken
) => {

  const clientId =
    process.env.APPLE_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      "APPLE_CLIENT_ID is not configured."
    );
  }

  const payload =
    await verifyJwtWithJwks({
      token: idToken,

      jwksUrl:
        APPLE_JWKS_URL,

      issuer:
        APPLE_ISSUER,

      audience:
        clientId,
    });

  // ----------------------------------------------------
  // Apple subject
  // ----------------------------------------------------

  if (!payload.sub) {
    throw new Error(
      "Apple account ID is missing."
    );
  }

  // ----------------------------------------------------
  // Apple email
  // ----------------------------------------------------

  if (!payload.email) {
    throw new Error(
      "Apple account email is missing."
    );
  }

  // ----------------------------------------------------
  // Apple email verification
  // ----------------------------------------------------

  if (
    payload.email_verified === false ||
    payload.email_verified === "false"
  ) {
    throw new Error(
      "Apple email is not verified."
    );
  }

  return {
    providerId:
      String(payload.sub),

    email:
      normalizeEmail(payload.email),
  };
};


// ======================================================
// REGISTER
// ======================================================

export const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // --------------------------------------------------
    // Required fields
    // --------------------------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone and password are required.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const normalizedPhone =
      normalizePhone(phone);

    // --------------------------------------------------
    // Password length
    // --------------------------------------------------

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    // --------------------------------------------------
    // Existing user
    // --------------------------------------------------

    const existingUser =
      await User.findOne({
        $or: [
          {
            email:
              normalizedEmail,
          },
          {
            phone:
              normalizedPhone,
          },
        ],
      });

    if (existingUser) {

      if (
        existingUser.email ===
        normalizedEmail
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email already exists.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          "Phone number already exists.",
      });
    }

    // --------------------------------------------------
    // Create local user
    // --------------------------------------------------

    const user =
      await User.create({
        name:
          String(name).trim(),

        email:
          normalizedEmail,

        phone:
          normalizedPhone,

        password,

        authProvider:
          "local",

        role:
          "user",

        isVerified:
          false,

        isActive:
          true,
      });

    // --------------------------------------------------
    // Generate JWT
    // --------------------------------------------------

    const token =
      generateToken(user._id);

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully.",
      token,
      user:
        getSafeUser(user),
    });

  } catch (error) {

    console.error(
      "Register Error:",
      error
    );

    // --------------------------------------------------
    // Duplicate key
    // --------------------------------------------------

    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number already exists.",
      });
    }

    // --------------------------------------------------
    // Mongoose validation
    // --------------------------------------------------

    if (
      error?.name ===
      "ValidationError"
    ) {
      const message =
        Object.values(
          error.errors || {}
        )
          .map(
            (item) =>
              item.message
          )
          .join(", ");

      return res.status(400).json({
        success: false,
        message:
          message ||
          "Invalid user data.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};


// ======================================================
// LOGIN
// ======================================================

export const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // --------------------------------------------------
    // Required
    // --------------------------------------------------

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and Password are required.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user =
      await User.findOne({
        email:
          normalizedEmail,
      }).select(
        "+password"
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // --------------------------------------------------
    // Account disabled
    // --------------------------------------------------

    if (
      user.isActive === false
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been blocked. Please contact support.",
      });
    }

    // --------------------------------------------------
    // Social account
    // --------------------------------------------------

    if (
      user.authProvider !==
      "local"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `This account uses ${user.authProvider} login. Please continue with ${user.authProvider}.`,
      });
    }

    // --------------------------------------------------
    // Compare password
    // --------------------------------------------------

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // --------------------------------------------------
    // Generate JWT
    // --------------------------------------------------

    const token =
      generateToken(user._id);

    return res.status(200).json({
      success: true,
      message:
        "Login successful.",
      token,
      user:
        getSafeUser(user),
    });

  } catch (error) {

    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};


// ======================================================
// GOOGLE LOGIN
// ======================================================
//
// POST /api/v1/auth/google
//
// Expected body:
//
// {
//   "credential": "GOOGLE_ID_TOKEN"
// }
//
// ======================================================

export const googleLogin = async (
  req,
  res
) => {

  try {

    const {
      credential,
      idToken,
    } = req.body;

    const googleToken =
      credential ||
      idToken;

    // --------------------------------------------------
    // Token required
    // --------------------------------------------------

    if (!googleToken) {
      return res.status(400).json({
        success: false,
        message:
          "Google credential is required.",
      });
    }

    // --------------------------------------------------
    // Verify Google
    // --------------------------------------------------

    const googleUser =
      await verifyGoogleToken(
        googleToken
      );

    const {
      providerId,
      email,
      name,
      avatar,
    } = googleUser;

    // --------------------------------------------------
    // First search by Google ID
    // --------------------------------------------------

    let user =
      await User.findOne({
        googleId:
          providerId,
      });

    // --------------------------------------------------
    // If Google ID doesn't exist,
    // search by verified email.
    // --------------------------------------------------

    if (!user) {
      user =
        await User.findOne({
          email,
        });
    }

    // ==================================================
    // EXISTING USER
    // ==================================================

    if (user) {

      // ------------------------------------------------
      // Blocked account
      // ------------------------------------------------

      if (
        user.isActive === false
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been blocked. Please contact support.",
        });
      }

      // ------------------------------------------------
      // Link Google account to existing account
      //
      // This is safe because Google's email has already
      // been verified above.
      // ------------------------------------------------

      let changed = false;

      if (
        !user.googleId
      ) {
        user.googleId =
          providerId;

        changed = true;
      }

      // ------------------------------------------------
      // If account was local, keep authProvider local
      // unless Google is being linked.
      //
      // For future login we want Google to work.
      // ------------------------------------------------

      if (
        !user.authProvider ||
        user.authProvider ===
          "local"
      ) {
        user.authProvider =
          "google";

        changed = true;
      }

      // ------------------------------------------------
      // Update avatar only if empty
      // ------------------------------------------------

      if (
        !user.avatar &&
        avatar
      ) {
        user.avatar =
          avatar;

        changed = true;
      }

      // ------------------------------------------------
      // Google has verified email
      // ------------------------------------------------

      if (
        user.isVerified !==
        true
      ) {
        user.isVerified =
          true;

        changed = true;
      }

      if (changed) {
        await user.save();
      }

    }

    // ==================================================
    // NEW USER
    // ==================================================

    else {

      user =
        await User.create({
          name:
            name || "Google User",

          email,

          // Phone intentionally omitted.
          // User can add it later from profile.

          avatar:
            avatar || "",

          authProvider:
            "google",

          googleId:
            providerId,

          role:
            "user",

          isVerified:
            true,

          isActive:
            true,
        });
    }

    // --------------------------------------------------
    // FashionStore JWT
    // --------------------------------------------------

    const token =
      generateToken(user._id);

    return res.status(200).json({
      success: true,
      message:
        "Google login successful.",
      token,
      user:
        getSafeUser(user),
    });

  } catch (error) {

    console.error(
      "Google Login Error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        error?.message ||
        "Google authentication failed.",
    });
  }
};


// ======================================================
// APPLE LOGIN
// ======================================================
//
// POST /api/v1/auth/apple
//
// Expected body:
//
// {
//   "identityToken": "...",
//   "name": "Optional first-login name"
// }
//
// ======================================================

export const appleLogin = async (
  req,
  res
) => {

  try {

    const {
      identityToken,
      idToken,
      name,
    } = req.body;

    const appleToken =
      identityToken ||
      idToken;

    // --------------------------------------------------
    // Token required
    // --------------------------------------------------

    if (!appleToken) {
      return res.status(400).json({
        success: false,
        message:
          "Apple identity token is required.",
      });
    }

    // --------------------------------------------------
    // Verify Apple token
    // --------------------------------------------------

    const appleUser =
      await verifyAppleToken(
        appleToken
      );

    const {
      providerId,
      email,
    } = appleUser;

    // --------------------------------------------------
    // Search Apple ID first
    // --------------------------------------------------

    let user =
      await User.findOne({
        appleId:
          providerId,
      });

    // --------------------------------------------------
    // If Apple ID not found,
    // search verified email.
    // --------------------------------------------------

    if (!user) {
      user =
        await User.findOne({
          email,
        });
    }

    // ==================================================
    // EXISTING USER
    // ==================================================

    if (user) {

      // ------------------------------------------------
      // Blocked
      // ------------------------------------------------

      if (
        user.isActive === false
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been blocked. Please contact support.",
        });
      }

      let changed = false;

      // ------------------------------------------------
      // Link Apple ID
      // ------------------------------------------------

      if (
        !user.appleId
      ) {
        user.appleId =
          providerId;

        changed = true;
      }

      // ------------------------------------------------
      // Set provider
      // ------------------------------------------------

      if (
        !user.authProvider ||
        user.authProvider ===
          "local"
      ) {
        user.authProvider =
          "apple";

        changed = true;
      }

      // ------------------------------------------------
      // Apple verified email
      // ------------------------------------------------

      if (
        user.isVerified !==
        true
      ) {
        user.isVerified =
          true;

        changed = true;
      }

      // ------------------------------------------------
      // Apple name is available only during
      // first authorization in many flows.
      //
      // Do not overwrite an existing name.
      // ------------------------------------------------

      if (
        (!user.name ||
          user.name ===
            "Apple User") &&
        name
      ) {
        user.name =
          String(name).trim();

        changed = true;
      }

      if (changed) {
        await user.save();
      }

    }

    // ==================================================
    // NEW USER
    // ==================================================

    else {

      user =
        await User.create({
          name:
            String(
              name ||
                "Apple User"
            ).trim(),

          email,

          avatar:
            "",

          authProvider:
            "apple",

          appleId:
            providerId,

          role:
            "user",

          isVerified:
            true,

          isActive:
            true,
        });
    }

    // --------------------------------------------------
    // Generate FashionStore JWT
    // --------------------------------------------------

    const token =
      generateToken(user._id);

    return res.status(200).json({
      success: true,
      message:
        "Apple login successful.",
      token,
      user:
        getSafeUser(user),
    });

  } catch (error) {

    console.error(
      "Apple Login Error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        error?.message ||
        "Apple authentication failed.",
    });
  }
};


// ======================================================
// GET CURRENT USER
// ======================================================

export const getMe = async (
  req,
  res
) => {

  try {

    return res.status(200).json({
      success: true,
      user:
        req.user,
    });

  } catch (error) {

    console.error(
      "GetMe Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};


// ======================================================
// UPDATE PROFILE
// ======================================================

export const updateProfile = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      phone,
      avatar,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // --------------------------------------------------
    // Email
    // --------------------------------------------------

    if (
      email &&
      normalizeEmail(email) !==
        user.email
    ) {

      const normalizedEmail =
        normalizeEmail(email);

      const emailExists =
        await User.findOne({
          email:
            normalizedEmail,
          _id: {
            $ne:
              user._id,
          },
        });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message:
            "Email already exists.",
        });
      }

      user.email =
        normalizedEmail;

      // Email changed, so local verification
      // should normally be required again.
      user.isVerified =
        false;
    }

    // --------------------------------------------------
    // Phone
    // --------------------------------------------------

    if (phone) {

      const normalizedPhone =
        normalizePhone(phone);

      if (
        normalizedPhone !==
        (user.phone || "")
      ) {

        const phoneExists =
          await User.findOne({
            phone:
              normalizedPhone,
            _id: {
              $ne:
                user._id,
            },
          });

        if (phoneExists) {
          return res.status(400).json({
            success: false,
            message:
              "Phone number already exists.",
          });
        }

        user.phone =
          normalizedPhone;
      }
    }

    // --------------------------------------------------
    // Name
    // --------------------------------------------------

    if (name) {
      user.name =
        String(name).trim();
    }

    // --------------------------------------------------
    // Avatar
    // --------------------------------------------------

    if (
      avatar !== undefined
    ) {
      user.avatar =
        String(avatar || "").trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",
      user:
        getSafeUser(user),
    });

  } catch (error) {

    console.error(
      "Update Profile Error:",
      error
    );

    if (
      error?.code === 11000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};


// ======================================================
// CHANGE PASSWORD
// ======================================================

export const changePassword = async (
  req,
  res
) => {

  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required.",
      });
    }

    if (
      String(newPassword).length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      ).select(
        "+password"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // --------------------------------------------------
    // Social account
    // --------------------------------------------------

    if (
      user.authProvider !==
      "local"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password cannot be changed for a social login account.",
      });
    }

    const isMatch =
      await user.comparePassword(
        currentPassword
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect.",
      });
    }

    user.password =
      newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully.",
    });

  } catch (error) {

    console.error(
      "Change Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};


// ======================================================
// LOGOUT
// ======================================================

export const logoutUser = async (
  req,
  res
) => {

  return res.status(200).json({
    success: true,
    message:
      "Logout successful.",
  });
};


// ======================================================
// GET BANK DETAILS
// ======================================================

export const getBankDetails = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).select(
        "bankDetails"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      bankDetails:
        user.bankDetails || {
          accountHolder: "",
          bankName: "",
          accountNumber: "",
          ifsc: "",
          branch: "",
        },
    });

  } catch (error) {

    console.error(
      "Get Bank Details Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch bank details.",
    });
  }
};


// ======================================================
// GET UPI DETAILS
// ======================================================

export const getUpiDetails = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).select(
        "upiDetails"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      upiDetails:
        user.upiDetails || {
          upiId: "",
          provider: "",
        },
    });

  } catch (error) {

    console.error(
      "Get UPI Details Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch UPI details.",
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

export default {
  registerUser,
  loginUser,
  googleLogin,
  appleLogin,
  getMe,
  updateProfile,
  changePassword,
  logoutUser,
  getBankDetails,
  getUpiDetails,
};