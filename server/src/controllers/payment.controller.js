import crypto from "crypto";

import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";

// ======================================================
// HELPERS
// ======================================================

const getErrorMessage = (error) => {
  return (
    error?.error?.description ||
    error?.message ||
    "Something went wrong."
  );
};

// ======================================================
// CONSUME COUPON
// IMPORTANT:
// Coupon usage successful payment ke baad hi consume hoga.
// ======================================================

const consumeCouponForPaidOrder = async (order) => {
  const couponCode = String(
    order?.coupon?.code || ""
  )
    .trim()
    .toUpperCase();

  if (!couponCode) {
    return true;
  }

  // Already consumed for this order
  if (
    order?.coupon?.usageConsumed === true
  ) {
    return true;
  }

  const coupon =
    await Coupon.findOne({
      code: couponCode,
      isActive: true,
    });

  if (!coupon) {
    throw new Error(
      `Coupon ${couponCode} no longer exists or is inactive.`
    );
  }

  // Check global usage limit
  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    Number(coupon.usageLimit) > 0 &&
    Number(coupon.usedCount || 0) >=
      Number(coupon.usageLimit)
  ) {
    throw new Error(
      `Coupon ${couponCode} usage limit has been reached.`
    );
  }

  coupon.usedCount =
    Number(coupon.usedCount || 0) + 1;

  await coupon.save();

  // This requires coupon.usageConsumed in Order schema.
  // If schema doesn't have it, Mongoose strict mode simply
  // ignores it. Main usedCount is still updated.
  if (order.coupon) {
    order.coupon.usageConsumed = true;
  }

  return true;
};

// ======================================================
// CREATE RAZORPAY ORDER
// POST /api/v1/payments/create-order
// ======================================================

export const createRazorpayOrder = async (
  req,
  res
) => {
  try {
    const {
      orderId,
    } = req.body;

    // --------------------------------------------------
    // VALIDATE ORDER ID
    // --------------------------------------------------

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID is required.",
      });
    }

    // --------------------------------------------------
    // FIND USER ORDER
    // --------------------------------------------------

    const order =
      await Order.findOne({
        _id: orderId,
        user: req.user._id,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    // --------------------------------------------------
    // CANCELLED
    // --------------------------------------------------

    if (
      order.status ===
      "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment cannot be created for a cancelled order.",
      });
    }

    // --------------------------------------------------
    // ALREADY PAID
    // --------------------------------------------------

    if (
      order.payment?.status ===
      "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order is already paid.",
      });
    }

    // --------------------------------------------------
    // ORDER TOTAL
    // IMPORTANT:
    // This is already the discounted total.
    // --------------------------------------------------

    const totalAmount = Number(
      order.priceDetails?.total
    );

    if (
      !Number.isFinite(
        totalAmount
      ) ||
      totalAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order amount.",
      });
    }

    // --------------------------------------------------
    // CONVERT TO PAISE
    // --------------------------------------------------

    const amountInPaise =
      Math.round(
        totalAmount * 100
      );

    // --------------------------------------------------
    // RECEIPT
    // --------------------------------------------------

    const receipt =
      `fs_${order._id
        .toString()
        .slice(-18)}`;

    // --------------------------------------------------
    // RAZORPAY OPTIONS
    // --------------------------------------------------

    const options = {
      amount:
        amountInPaise,

      currency:
        "INR",

      receipt,

      notes: {
        fashionStoreOrderId:
          order._id.toString(),

        userId:
          req.user._id.toString(),

        couponCode:
          order.coupon?.code ||
          "",
      },
    };

    // --------------------------------------------------
    // CREATE RAZORPAY ORDER
    // --------------------------------------------------

    const razorpayOrder =
      await razorpay.orders.create(
        options
      );

    if (!razorpayOrder?.id) {
      return res.status(500).json({
        success: false,
        message:
          "Razorpay order creation failed.",
      });
    }

    // --------------------------------------------------
    // SAVE RAZORPAY ORDER ID
    // --------------------------------------------------

    if (!order.payment) {
      order.payment = {};
    }

    order.payment.orderId =
      razorpayOrder.id;

    order.payment.status =
      "Pending";

    await order.save();

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Razorpay order created successfully.",

      razorpayOrder: {
        id:
          razorpayOrder.id,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        receipt:
          razorpayOrder.receipt,

        status:
          razorpayOrder.status,
      },

      fashionStoreOrder: {
        id:
          order._id,

        orderNumber:
          order.orderNumber,

        amount:
          totalAmount,

        couponCode:
          order.coupon?.code ||
          "",

        couponDiscount:
          Number(
            order.coupon
              ?.discountAmount || 0
          ),
      },

      key:
        process.env
          .RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "Create Razorpay Order Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create Razorpay order.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? getErrorMessage(error)
          : undefined,
    });
  }
};

// ======================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/v1/payments/verify
// ======================================================

export const verifyRazorpayPayment =
  async (req, res) => {
    try {
      const {
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      // ------------------------------------------------
      // VALIDATION
      // ------------------------------------------------

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "FashionStore order ID is required.",
        });
      }

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay payment details are incomplete.",
        });
      }

      // ------------------------------------------------
      // FIND ORDER
      // ------------------------------------------------

      const order =
        await Order.findOne({
          _id: orderId,
          user: req.user._id,
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      // ------------------------------------------------
      // CANCELLED
      // ------------------------------------------------

      if (
        order.status ===
        "Cancelled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cancelled order cannot be paid.",
        });
      }

      // ------------------------------------------------
      // ALREADY PAID
      // ------------------------------------------------

      if (
        order.payment?.status ===
        "Paid"
      ) {
        return res.status(200).json({
          success: true,
          message:
            "Payment is already verified.",
          order,
        });
      }

      // ------------------------------------------------
      // SERVER STORED RAZORPAY ORDER ID
      // ------------------------------------------------

      const storedRazorpayOrderId =
        order.payment?.orderId;

      if (!storedRazorpayOrderId) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay order ID is missing from this order.",
        });
      }

      // ------------------------------------------------
      // ORDER ID MATCH
      // ------------------------------------------------

      if (
        storedRazorpayOrderId !==
        razorpay_order_id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay order ID does not match.",
        });
      }

      // ------------------------------------------------
      // SIGNATURE
      // ------------------------------------------------

      const signatureBody =
        `${storedRazorpayOrderId}|${razorpay_payment_id}`;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(
            signatureBody
          )
          .digest("hex");

      let signatureValid =
        false;

      try {
        const expectedBuffer =
          Buffer.from(
            expectedSignature,
            "utf8"
          );

        const receivedBuffer =
          Buffer.from(
            razorpay_signature,
            "utf8"
          );

        if (
          expectedBuffer.length ===
          receivedBuffer.length
        ) {
          signatureValid =
            crypto.timingSafeEqual(
              expectedBuffer,
              receivedBuffer
            );
        }
      } catch {
        signatureValid =
          false;
      }

      if (!signatureValid) {
        order.payment.status =
          "Failed";

        await order.save();

        return res.status(400).json({
          success: false,
          message:
            "Payment verification failed. Invalid signature.",
        });
      }

      // ------------------------------------------------
      // FETCH PAYMENT FROM RAZORPAY
      // ------------------------------------------------

      const razorpayPayment =
        await razorpay.payments.fetch(
          razorpay_payment_id
        );

      if (!razorpayPayment) {
        return res.status(400).json({
          success: false,
          message:
            "Unable to fetch payment details from Razorpay.",
        });
      }

      // ------------------------------------------------
      // VERIFY PAYMENT ORDER
      // ------------------------------------------------

      if (
        razorpayPayment.order_id !==
        storedRazorpayOrderId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment does not belong to this Razorpay order.",
        });
      }

      // ------------------------------------------------
      // VERIFY AMOUNT
      // ------------------------------------------------

      const expectedAmount =
        Math.round(
          Number(
            order.priceDetails?.total
          ) * 100
        );

      if (
        Number(
          razorpayPayment.amount
        ) !== expectedAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment amount does not match the order amount.",
        });
      }

      // ------------------------------------------------
      // VERIFY CURRENCY
      // ------------------------------------------------

      if (
        razorpayPayment.currency !==
        "INR"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment currency.",
        });
      }

      // ------------------------------------------------
      // VERIFY PAYMENT STATUS
      // ------------------------------------------------

      const successfulStatuses = [
        "authorized",
        "captured",
      ];

      if (
        !successfulStatuses.includes(
          razorpayPayment.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Payment is not successful. Current status: ${razorpayPayment.status}`,
        });
      }

      // ------------------------------------------------
      // PAYMENT SUCCESS
      // ------------------------------------------------

      order.payment.status =
        "Paid";

      order.payment.paymentId =
        razorpay_payment_id;

      order.payment.transactionId =
        razorpay_payment_id;

      order.payment.signature =
        razorpay_signature;

      order.payment.method =
        "Razorpay";

      if (
        !order.payment.paidAt
      ) {
        order.payment.paidAt =
          new Date();
      }

      // ------------------------------------------------
      // ORDER STATUS
      // ------------------------------------------------

      if (
        order.status ===
        "Pending"
      ) {
        order.status =
          "Confirmed";
      }

      // ------------------------------------------------
      // COUPON USAGE
      // ONLY AFTER SUCCESSFUL PAYMENT
      // ------------------------------------------------

      if (
        order.coupon?.code &&
        order.coupon
          ?.usageConsumed !== true
      ) {
        await consumeCouponForPaidOrder(
          order
        );
      }

      // ------------------------------------------------
      // SAVE
      // ------------------------------------------------

      await order.save();

      // ------------------------------------------------
      // RESPONSE
      // ------------------------------------------------

      return res.status(200).json({
        success: true,

        message:
          "Payment verified successfully.",

        payment: {
          status:
            order.payment.status,

          paymentId:
            razorpay_payment_id,

          razorpayOrderId:
            storedRazorpayOrderId,

          method:
            razorpayPayment.method,

          amount:
            Number(
              razorpayPayment.amount
            ) / 100,

          currency:
            razorpayPayment.currency,

          paidAt:
            order.payment.paidAt,
        },

        order: {
          id:
            order._id,

          orderNumber:
            order.orderNumber,

          status:
            order.status,

          total:
            order.priceDetails
              ?.total,

          couponCode:
            order.coupon?.code ||
            "",

          couponDiscount:
            Number(
              order.coupon
                ?.discountAmount || 0
            ),
        },
      });
    } catch (error) {
      console.error(
        "Verify Razorpay Payment Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to verify payment.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  };

// ======================================================
// GET PAYMENT STATUS
// GET /api/v1/payments/:orderId/status
// ======================================================

export const getPaymentStatus =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "Order ID is required.",
        });
      }

      const order =
        await Order.findOne({
          _id: orderId,
          user: req.user._id,
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      const paymentId =
        order.payment?.paymentId;

      if (!paymentId) {
        return res.status(200).json({
          success: true,

          payment: {
            status:
              order.payment
                ?.status ||
              "Pending",

            paymentId:
              null,

            razorpayOrderId:
              order.payment
                ?.orderId ||
              null,

            amount:
              Number(
                order.priceDetails
                  ?.total || 0
              ),

            orderStatus:
              order.status,
          },
        });
      }

      const razorpayPayment =
        await razorpay.payments.fetch(
          paymentId
        );

      if (!razorpayPayment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found on Razorpay.",
        });
      }

      // Security
      if (
        razorpayPayment.order_id !==
        order.payment?.orderId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment does not belong to this order.",
        });
      }

      let localStatus =
        order.payment?.status ||
        "Pending";

      if (
        razorpayPayment.status ===
        "captured"
      ) {
        localStatus = "Paid";
      } else if (
        razorpayPayment.status ===
        "failed"
      ) {
        localStatus = "Failed";
      }

      const wasAlreadyPaid =
        order.payment?.status ===
        "Paid";

      if (
        order.payment.status !==
        localStatus
      ) {
        order.payment.status =
          localStatus;

        if (
          localStatus === "Paid" &&
          !order.payment.paidAt
        ) {
          order.payment.paidAt =
            new Date();
        }

        if (
          localStatus === "Paid" &&
          order.status === "Pending"
        ) {
          order.status =
            "Confirmed";
        }

        if (
          localStatus === "Paid" &&
          !wasAlreadyPaid &&
          order.coupon?.code
        ) {
          await consumeCouponForPaidOrder(
            order
          );
        }

        await order.save();
      }

      return res.status(200).json({
        success: true,

        payment: {
          status:
            localStatus,

          razorpayStatus:
            razorpayPayment.status,

          paymentId:
            razorpayPayment.id,

          razorpayOrderId:
            razorpayPayment.order_id,

          amount:
            Number(
              razorpayPayment.amount
            ) / 100,

          currency:
            razorpayPayment.currency,

          method:
            razorpayPayment.method ||
            null,

          captured:
            razorpayPayment.captured,

          paidAt:
            order.payment?.paidAt ||
            null,

          orderStatus:
            order.status,
        },
      });
    } catch (error) {
      console.error(
        "Get Payment Status Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch payment status.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  };

// ======================================================
// MARK PAYMENT FAILED
// POST /api/v1/payments/failure
// ======================================================

export const markPaymentFailed =
  async (req, res) => {
    try {
      const {
        orderId,
        razorpay_order_id,
        razorpay_payment_id = "",
        errorCode = "",
        errorDescription = "",
        errorSource = "",
        errorStep = "",
        errorReason = "",
      } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "FashionStore order ID is required.",
        });
      }

      const order =
        await Order.findOne({
          _id: orderId,
          user: req.user._id,
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      // Never downgrade Paid order
      if (
        order.payment?.status ===
        "Paid"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Paid payment cannot be marked as failed.",
        });
      }

      // Verify Razorpay order ID
      if (
        razorpay_order_id &&
        order.payment?.orderId &&
        razorpay_order_id !==
          order.payment.orderId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay order ID does not match.",
        });
      }

      // If payment ID exists, verify from Razorpay
      if (
        razorpay_payment_id
      ) {
        try {
          const payment =
            await razorpay.payments.fetch(
              razorpay_payment_id
            );

          if (
            payment?.status ===
            "captured"
          ) {
            return res.status(409).json({
              success: false,
              message:
                "Razorpay shows this payment as captured.",
            });
          }

          if (
            payment?.order_id &&
            order.payment?.orderId &&
            payment.order_id !==
              order.payment.orderId
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Payment does not belong to this order.",
            });
          }
        } catch (razorpayError) {
          console.error(
            "Razorpay failure check:",
            razorpayError.message
          );
        }
      }

      order.payment.status =
        "Failed";

      if (
        razorpay_payment_id
      ) {
        order.payment.paymentId =
          razorpay_payment_id;

        order.payment.transactionId =
          razorpay_payment_id;
      }

      // Only set if schema supports it.
      order.payment.failureDetails =
        {
          code:
            errorCode,

          description:
            errorDescription,

          source:
            errorSource,

          step:
            errorStep,

          reason:
            errorReason,

          failedAt:
            new Date(),
        };

      await order.save();

      return res.status(200).json({
        success: true,

        message:
          "Payment failure recorded successfully.",

        payment: {
          status:
            order.payment.status,

          razorpayOrderId:
            order.payment.orderId,

          paymentId:
            order.payment
              .paymentId ||
            null,
        },
      });
    } catch (error) {
      console.error(
        "Mark Payment Failed Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to record payment failure.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  };

// ======================================================
// CREATE REFUND
// POST /api/v1/payments/:orderId/refund
// ADMIN ONLY
// ======================================================

export const createRefund =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      const {
        amount,
        reason =
          "Order refund",
      } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "Order ID is required.",
        });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      if (
        order.payment?.status !==
        "Paid"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only paid orders can be refunded.",
        });
      }

      const paymentId =
        order.payment?.paymentId;

      if (!paymentId) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay payment ID is missing.",
        });
      }

      const payment =
        await razorpay.payments.fetch(
          paymentId
        );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found on Razorpay.",
        });
      }

      if (
        payment.status !==
        "captured"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only captured payments can be refunded.",
        });
      }

      if (
        payment.order_id !==
        order.payment.orderId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment does not belong to this order.",
        });
      }

      const capturedAmount =
        Number(
          payment.amount
        ) || 0;

      const alreadyRefunded =
        Number(
          payment.amount_refunded
        ) || 0;

      const remainingRefundable =
        capturedAmount -
        alreadyRefunded;

      if (
        remainingRefundable <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment has already been fully refunded.",
        });
      }

      let refundAmount;

      if (
        amount === undefined ||
        amount === null ||
        amount === ""
      ) {
        refundAmount =
          remainingRefundable;
      } else {
        const rupees =
          Number(amount);

        if (
          !Number.isFinite(
            rupees
          ) ||
          rupees <= 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Refund amount must be greater than 0.",
          });
        }

        refundAmount =
          Math.round(
            rupees * 100
          );
      }

      if (
        refundAmount >
        remainingRefundable
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Refund amount exceeds remaining refundable amount.",

          remainingRefundable:
            remainingRefundable /
            100,
        });
      }

      const refund =
        await razorpay.payments.refund(
          paymentId,
          {
            amount:
              refundAmount,

            notes: {
              fashionStoreOrderId:
                order._id.toString(),

              orderNumber:
                order.orderNumber,

              reason:
                String(
                  reason
                ).slice(
                  0,
                  200
                ),
            },
          }
        );

      if (!refund?.id) {
        return res.status(500).json({
          success: false,
          message:
            "Invalid refund response from Razorpay.",
        });
      }

      order.payment.refundId =
        refund.id;

      order.payment.refundAmount =
        Number(
          refund.amount || 0
        ) / 100;

      order.payment.refundReason =
        reason;

      if (
        refund.status ===
        "processed"
      ) {
        order.payment.refundStatus =
          "Processed";

        order.payment.refundedAt =
          new Date();
      } else if (
        refund.status ===
        "failed"
      ) {
        order.payment.refundStatus =
          "Failed";
      } else {
        order.payment.refundStatus =
          "Pending";
      }

      const totalRefunded =
        alreadyRefunded +
        Number(
          refund.amount || 0
        );

      if (
        totalRefunded >=
        capturedAmount
      ) {
        order.payment.status =
          "Refunded";
      }

      await order.save();

      return res.status(200).json({
        success: true,

        message:
          "Refund initiated successfully.",

        refund: {
          refundId:
            refund.id,

          paymentId:
            refund.payment_id,

          amount:
            Number(
              refund.amount || 0
            ) / 100,

          currency:
            refund.currency,

          status:
            refund.status,

          createdAt:
            refund.created_at,
        },

        order: {
          id:
            order._id,

          orderNumber:
            order.orderNumber,

          paymentStatus:
            order.payment.status,

          refundStatus:
            order.payment
              .refundStatus,

          refundAmount:
            order.payment
              .refundAmount,
        },
      });
    } catch (error) {
      console.error(
        "Create Refund Error:",
        error
      );

      return res.status(
        error?.statusCode ||
          500
      ).json({
        success: false,

        message:
          getErrorMessage(error),

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// GET REFUND STATUS
// GET /api/v1/payments/:orderId/refund-status
// ADMIN ONLY
// ======================================================

export const getRefundStatus =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "Order ID is required.",
        });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      const refundId =
        order.payment?.refundId;

      if (!refundId) {
        return res.status(404).json({
          success: false,
          message:
            "No refund exists for this order.",
        });
      }

      const refund =
        await razorpay.refunds.fetch(
          refundId
        );

      if (!refund) {
        return res.status(404).json({
          success: false,
          message:
            "Refund not found on Razorpay.",
        });
      }

      if (
        order.payment?.paymentId &&
        refund.payment_id !==
          order.payment.paymentId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Refund does not belong to this payment.",
        });
      }

      let localRefundStatus =
        "Pending";

      if (
        refund.status ===
        "processed"
      ) {
        localRefundStatus =
          "Processed";
      } else if (
        refund.status ===
        "failed"
      ) {
        localRefundStatus =
          "Failed";
      }

      order.payment.refundStatus =
        localRefundStatus;

      order.payment.refundAmount =
        Number(
          refund.amount || 0
        ) / 100;

      if (
        refund.status ===
        "processed" &&
        !order.payment
          .refundedAt
      ) {
        order.payment.refundedAt =
          new Date();
      }

      // Check full refund
      if (
        refund.status ===
        "processed" &&
        order.payment?.paymentId
      ) {
        try {
          const payment =
            await razorpay.payments.fetch(
              order.payment
                .paymentId
            );

          const paidAmount =
            Number(
              payment?.amount
            ) || 0;

          const refundedAmount =
            Number(
              payment
                ?.amount_refunded
            ) || 0;

          if (
            paidAmount > 0 &&
            refundedAmount >=
              paidAmount
          ) {
            order.payment.status =
              "Refunded";
          }
        } catch (error) {
          console.error(
            "Refund payment check error:",
            error.message
          );
        }
      }

      await order.save();

      return res.status(200).json({
        success: true,

        refund: {
          refundId:
            refund.id,

          paymentId:
            refund.payment_id,

          amount:
            Number(
              refund.amount || 0
            ) / 100,

          currency:
            refund.currency,

          razorpayStatus:
            refund.status,

          localStatus:
            localRefundStatus,

          createdAt:
            refund.created_at,
        },

        order: {
          id:
            order._id,

          orderNumber:
            order.orderNumber,

          paymentStatus:
            order.payment.status,

          refundStatus:
            order.payment
              .refundStatus,

          refundAmount:
            order.payment
              .refundAmount,

          refundedAt:
            order.payment
              .refundedAt ||
            null,
        },
      });
    } catch (error) {
      console.error(
        "Get Refund Status Error:",
        error
      );

      return res.status(
        error?.statusCode ||
          500
      ).json({
        success: false,

        message:
          getErrorMessage(error),

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// RAZORPAY WEBHOOK
// POST /api/v1/payments/webhook
// ======================================================

export const razorpayWebhook =
  async (req, res) => {
    try {
      const signature =
        req.headers[
          "x-razorpay-signature"
        ];

      if (!signature) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay webhook signature is missing.",
        });
      }

      const webhookSecret =
        process.env
          .RAZORPAY_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error(
          "RAZORPAY_WEBHOOK_SECRET is missing."
        );

        return res.status(500).json({
          success: false,
          message:
            "Webhook configuration error.",
        });
      }

      // ------------------------------------------------
      // RAW BODY REQUIRED
      // ------------------------------------------------

      if (
        !Buffer.isBuffer(
          req.body
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Raw webhook body is required.",
        });
      }

      // ------------------------------------------------
      // VERIFY SIGNATURE
      // ------------------------------------------------

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            webhookSecret
          )
          .update(req.body)
          .digest("hex");

      let signatureValid =
        false;

      try {
        const expectedBuffer =
          Buffer.from(
            expectedSignature,
            "utf8"
          );

        const receivedBuffer =
          Buffer.from(
            signature,
            "utf8"
          );

        if (
          expectedBuffer.length ===
          receivedBuffer.length
        ) {
          signatureValid =
            crypto.timingSafeEqual(
              expectedBuffer,
              receivedBuffer
            );
        }
      } catch {
        signatureValid =
          false;
      }

      if (!signatureValid) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid webhook signature.",
        });
      }

      // ------------------------------------------------
      // PARSE BODY
      // ------------------------------------------------

      let event;

      try {
        event = JSON.parse(
          req.body.toString(
            "utf8"
          )
        );
      } catch {
        return res.status(400).json({
          success: false,
          message:
            "Invalid webhook JSON.",
        });
      }

      const eventType =
        event?.event;

      console.log(
        "Razorpay Webhook:",
        eventType
      );

      // =================================================
      // PAYMENT CAPTURED
      // =================================================

      if (
        eventType ===
        "payment.captured"
      ) {
        const payment =
          event?.payload?.payment
            ?.entity;

        if (payment) {
          const order =
            await Order.findOne({
              "payment.orderId":
                payment.order_id,
            });

          if (order) {
            const expectedAmount =
              Math.round(
                Number(
                  order.priceDetails
                    ?.total
                ) * 100
              );

            const receivedAmount =
              Number(
                payment.amount
              );

            // Security
            if (
              receivedAmount !==
                expectedAmount ||
              payment.currency !==
                "INR"
            ) {
              console.error(
                "Webhook amount mismatch:",
                order._id
              );

              return res.status(
                400
              ).json({
                success: false,
                message:
                  "Webhook payment amount mismatch.",
              });
            }

            const wasAlreadyPaid =
              order.payment
                ?.status ===
              "Paid";

            order.payment.status =
              "Paid";

            order.payment.paymentId =
              payment.id;

            order.payment.transactionId =
              payment.id;

            order.payment.method =
              "Razorpay";

            if (
              !order.payment.paidAt
            ) {
              order.payment.paidAt =
                new Date();
            }

            if (
              order.status ===
              "Pending"
            ) {
              order.status =
                "Confirmed";
            }

            // Consume coupon only once
            if (
              !wasAlreadyPaid &&
              order.coupon?.code &&
              order.coupon
                ?.usageConsumed !==
                true
            ) {
              await consumeCouponForPaidOrder(
                order
              );
            }

            await order.save();
          }
        }
      }

      // =================================================
      // PAYMENT FAILED
      // =================================================

      else if (
        eventType ===
        "payment.failed"
      ) {
        const payment =
          event?.payload?.payment
            ?.entity;

        if (payment) {
          const order =
            await Order.findOne({
              "payment.orderId":
                payment.order_id,
            });

          if (
            order &&
            order.payment.status !==
              "Paid"
          ) {
            order.payment.status =
              "Failed";

            order.payment.paymentId =
              payment.id || "";

            order.payment.transactionId =
              payment.id || "";

            order.payment.failureDetails =
              {
                code:
                  payment.error_code ||
                  "",

                description:
                  payment.error_description ||
                  "",

                source:
                  payment.error_source ||
                  "",

                step:
                  payment.error_step ||
                  "",

                reason:
                  payment.error_reason ||
                  "",

                failedAt:
                  new Date(),
              };

            await order.save();
          }
        }
      }

      // =================================================
      // REFUND PROCESSED
      // =================================================

      else if (
        eventType ===
        "refund.processed"
      ) {
        const refund =
          event?.payload?.refund
            ?.entity;

        if (refund) {
          const order =
            await Order.findOne({
              "payment.paymentId":
                refund.payment_id,
            });

          if (order) {
            order.payment.refundId =
              refund.id;

            order.payment.refundStatus =
              "Processed";

            order.payment.refundAmount =
              Number(
                refund.amount || 0
              ) / 100;

            order.payment.refundedAt =
              new Date();

            try {
              const payment =
                await razorpay.payments.fetch(
                  refund.payment_id
                );

              const paidAmount =
                Number(
                  payment?.amount
                ) || 0;

              const refundedAmount =
                Number(
                  payment
                    ?.amount_refunded
                ) || 0;

              if (
                paidAmount > 0 &&
                refundedAmount >=
                  paidAmount
              ) {
                order.payment.status =
                  "Refunded";
              }
            } catch (
              refundError
            ) {
              console.error(
                "Webhook refund check:",
                refundError.message
              );
            }

            await order.save();
          }
        }
      }

      // =================================================
      // REFUND FAILED
      // =================================================

      else if (
        eventType ===
        "refund.failed"
      ) {
        const refund =
          event?.payload?.refund
            ?.entity;

        if (refund) {
          const order =
            await Order.findOne({
              "payment.paymentId":
                refund.payment_id,
            });

          if (order) {
            order.payment.refundId =
              refund.id;

            order.payment.refundStatus =
              "Failed";

            await order.save();
          }
        }
      }

      // =================================================
      // ACK
      // =================================================

      return res.status(200).json({
        success: true,
        message:
          "Webhook processed successfully.",
      });
    } catch (error) {
      console.error(
        "Razorpay Webhook Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Webhook processing failed.",
      });
    }
  };