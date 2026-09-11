// Name Validation
export const validateName = (name) => {
  if (!name || name.trim() === "") {
    return "Full name is required.";
  }

  if (name.trim().length < 3) {
    return "Full name must be at least 3 characters.";
  }

  return "";
};

// Email Validation
export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return "Email address is required.";
  }

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  return "";
};

// Phone Validation
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === "") {
    return "Phone number is required.";
  }

  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phone)) {
    return "Enter a valid 10-digit mobile number.";
  }

  return "";
};

// Date of Birth Validation
export const validateDateOfBirth = (date) => {
  if (!date) {
    return "Date of birth is required.";
  }

  const dob = new Date(date);
  const today = new Date();

  if (dob >= today) {
    return "Date of birth must be in the past.";
  }

  return "";
};

// Address Validation
export const validateAddress = (address) => {
  if (!address.houseNo?.trim()) {
    return "House number is required.";
  }

  if (!address.area?.trim()) {
    return "Area is required.";
  }

  if (!address.city?.trim()) {
    return "City is required.";
  }

  if (!address.state?.trim()) {
    return "State is required.";
  }

  if (!address.country?.trim()) {
    return "Country is required.";
  }

  return "";
};

// Pincode Validation
export const validatePincode = (pincode) => {
  const regex = /^[1-9][0-9]{5}$/;

  if (!regex.test(pincode)) {
    return "Enter a valid 6-digit pincode.";
  }

  return "";
};

// UPI Validation
export const validateUpiId = (upiId) => {
  const regex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

  if (!regex.test(upiId)) {
    return "Enter a valid UPI ID.";
  }

  return "";
};

// Bank Account Validation
export const validateAccountNumber = (accountNumber) => {
  const regex = /^[0-9]{9,18}$/;

  if (!regex.test(accountNumber)) {
    return "Invalid account number.";
  }

  return "";
};

// IFSC Validation
export const validateIFSC = (ifsc) => {
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  if (!regex.test(ifsc)) {
    return "Invalid IFSC code.";
  }

  return "";
};

// Complete Profile Validation
export const validateProfile = (profile) => {
  const errors = {};

  const nameError = validateName(profile.fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(profile.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(profile.phone);
  if (phoneError) errors.phone = phoneError;

  const dobError = validateDateOfBirth(profile.dateOfBirth);
  if (dobError) errors.dateOfBirth = dobError;

  const addressError = validateAddress(profile.address);
  if (addressError) errors.address = addressError;

  const pincodeError = validatePincode(profile.address.pincode);
  if (pincodeError) errors.pincode = pincodeError;

  return errors;
};

// Check if Validation Passed
export const isProfileValid = (profile) => {
  return Object.keys(validateProfile(profile)).length === 0;
};

const profileValidation = {
  validateName,
  validateEmail,
  validatePhone,
  validateDateOfBirth,
  validateAddress,
  validatePincode,
  validateUpiId,
  validateAccountNumber,
  validateIFSC,
  validateProfile,
  isProfileValid,
};

export default profileValidation;