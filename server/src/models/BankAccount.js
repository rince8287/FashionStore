import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    accountHolder: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
      maxlength: 100,
    },

    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
      maxlength: 100,
    },

    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      trim: true,
    },

    ifsc: {
      type: String,
      required: [true, "IFSC code is required"],
      trim: true,
      uppercase: true,
    },

    branch: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const BankAccount = mongoose.model(
  "BankAccount",
  bankAccountSchema
);

export default BankAccount;