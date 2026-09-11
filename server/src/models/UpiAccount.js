import mongoose from "mongoose";

const upiAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    upiId: {
      type: String,
      required: [true, "UPI ID is required"],
      trim: true,
      lowercase: true,
      maxlength: 100,
    },

    provider: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UpiAccount = mongoose.model(
  "UpiAccount",
  upiAccountSchema
);

export default UpiAccount;