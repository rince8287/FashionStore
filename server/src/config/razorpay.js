import Razorpay from "razorpay";

// ======================================================
// CHECK ENV VARIABLES
// ======================================================

if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error(
    "RAZORPAY_KEY_ID is missing in environment variables."
  );
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "RAZORPAY_KEY_SECRET is missing in environment variables."
  );
}

// ======================================================
// RAZORPAY INSTANCE
// ======================================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ======================================================
// EXPORT
// ======================================================

export default razorpay;