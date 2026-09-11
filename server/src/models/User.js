import mongoose from "mongoose";
import bcrypt from "bcrypt";

// ======================================================
// USER SCHEMA
// ======================================================

const userSchema = new mongoose.Schema(
  {
    // ==================================================
    // NAME
    // ==================================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    // ==================================================
    // EMAIL
    // ==================================================

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
      index: true,
    },

    // ==================================================
    // PHONE
    // ==================================================
    //
    // Local registration mein phone required hai.
    // Google / Apple login mein initially phone nahi hota.
    //
    // Isliye yahan optional rakha gaya hai.
    // ==================================================

    phone: {
      type: String,
      trim: true,
      default: undefined,
      unique: true,
      sparse: true,
    },

    // ==================================================
    // PASSWORD
    // ==================================================
    //
    // Local account ke liye required.
    // Google / Apple account ke liye required nahi.
    // ==================================================

    password: {
      type: String,
      minlength: 6,
      select: false,

      required: function () {
        return this.authProvider === "local";
      },
    },

    // ==================================================
    // AUTH PROVIDER
    // ==================================================

    authProvider: {
      type: String,

      enum: ["local", "google", "apple"],

      default: "local",

      index: true,
    },

    // ==================================================
    // GOOGLE ID
    // ==================================================

    googleId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
      index: true,
    },

    // ==================================================
    // APPLE ID
    // ==================================================

    appleId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
      index: true,
    },

    // ==================================================
    // AVATAR
    // ==================================================

    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    // ==================================================
    // ROLE
    // ==================================================
    //
    // IMPORTANT:
    //
    // Google login existing admin ka role change nahi karega.
    //
    // Existing:
    // role = "admin"
    //
    // rahega admin.
    //
    // New normal/social account:
    // role = "user"
    // ==================================================

    role: {
      type: String,

      enum: ["user", "admin"],

      default: "user",

      index: true,
    },

    // ==================================================
    // EMAIL / ACCOUNT VERIFICATION
    // ==================================================

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ==================================================
    // ACCOUNT STATUS
    // ==================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==================================================
    // DEFAULT ADDRESS
    // ==================================================

    address: {
      houseNo: {
        type: String,
        default: "",
        trim: true,
      },

      area: {
        type: String,
        default: "",
        trim: true,
      },

      landmark: {
        type: String,
        default: "",
        trim: true,
      },

      pincode: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
      },
    },

    // ==================================================
    // BANK DETAILS
    // ==================================================

    bankDetails: {
      accountHolder: {
        type: String,
        default: "",
        trim: true,
      },

      bankName: {
        type: String,
        default: "",
        trim: true,
      },

      accountNumber: {
        type: String,
        default: "",
        trim: true,
      },

      ifsc: {
        type: String,
        default: "",
        uppercase: true,
        trim: true,
      },

      branch: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // ==================================================
    // UPI DETAILS
    // ==================================================

    upiDetails: {
      upiId: {
        type: String,
        default: "",
        lowercase: true,
        trim: true,
      },

      provider: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },

  // ====================================================
  // SCHEMA OPTIONS
  // ====================================================

  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

userSchema.index({
  role: 1,
  isActive: 1,
});

userSchema.index({
  role: 1,
  createdAt: -1,
});

userSchema.index({
  role: 1,
  isVerified: 1,
});

userSchema.index({
  authProvider: 1,
  createdAt: -1,
});

// ======================================================
// HASH PASSWORD BEFORE SAVE
// ======================================================

userSchema.pre("save", async function () {
  // Password modified nahi hua
  if (!this.isModified("password")) {
    return;
  }

  // Google / Apple account
  // password ke bina create ho sakta hai.
  if (!this.password) {
    return;
  }

  // Password already hash hai to dobara hash nahi hoga.
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// ======================================================
// COMPARE PASSWORD
// ======================================================

userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  // Social account ke liye
  // normal password login allowed nahi.
  if (this.authProvider !== "local") {
    return false;
  }

  if (!this.password) {
    return false;
  }

  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

// ======================================================
// JSON TRANSFORM
// ======================================================

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    // Never expose password
    delete ret.password;

    // Never expose mongoose version
    delete ret.__v;

    // Mask bank account number
    if (ret.bankDetails?.accountNumber) {
      const accountNumber = String(
        ret.bankDetails.accountNumber
      );

      if (accountNumber.length > 4) {
        ret.bankDetails.accountNumber =
          `****${accountNumber.slice(-4)}`;
      }
    }

    return ret;
  },
});

// ======================================================
// TO OBJECT TRANSFORM
// ======================================================

userSchema.set("toObject", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;

    return ret;
  },
});

// ======================================================
// MODEL
// ======================================================

const User = mongoose.model(
  "User",
  userSchema
);

// ======================================================
// EXPORT
// ======================================================

export default User;