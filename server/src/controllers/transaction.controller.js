import Transaction from "../models/Transaction.js";
import Order from "../models/Order.js";

// ======================================================
// CREATE TRANSACTION
// POST /api/v1/transactions
// ======================================================

export const createTransaction = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      transactionId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod,
      amount,
      currency,
      status,
      notes,
    } = req.body;

    // ==================================================
    // REQUIRED VALIDATION
    // ==================================================

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required.",
      });
    }

    if (
      amount === undefined ||
      amount === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount is required.",
      });
    }

    // ==================================================
    // FIND ORDER
    // ==================================================

    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ==================================================
    // DUPLICATE CHECK
    // ==================================================

    const existingTransaction =
      await Transaction.findOne({
        transactionId,
      });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,
        message:
          "Transaction already exists.",
      });
    }

    // ==================================================
    // CREATE TRANSACTION
    // ==================================================

    const transaction =
      await Transaction.create({
        user: req.user._id,

        order: order._id,

        transactionId,

        razorpayOrderId:
          razorpayOrderId || "",

        razorpayPaymentId:
          razorpayPaymentId || "",

        razorpaySignature:
          razorpaySignature || "",

        paymentMethod:
          paymentMethod ||
          "Razorpay",

        amount,

        currency:
          currency || "INR",

        status:
          status || "Pending",

        notes: notes || "",
      });

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,

      message:
        "Transaction created successfully.",

      transaction,
    });

  } catch (error) {
    console.error(
      "Create Transaction Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create transaction.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};
// ======================================================
// GET ALL TRANSACTIONS
// GET /api/v1/transactions
// Admin Only
// ======================================================

export const getAllTransactions =
  async (req, res) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      const search =
        req.query.search || "";

      const status =
        req.query.status || "";

      const paymentMethod =
        req.query.paymentMethod || "";

      const sort =
        req.query.sort || "-createdAt";

      // ================================================
      // FILTER
      // ================================================

      const filter = {};

      if (status) {
        filter.status = status;
      }

      if (paymentMethod) {
        filter.paymentMethod =
          paymentMethod;
      }

      if (search) {
        filter.$or = [
          {
            transactionId: {
              $regex: search,
              $options: "i",
            },
          },
          {
            razorpayPaymentId: {
              $regex: search,
              $options: "i",
            },
          },
          {
            razorpayOrderId: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      // ================================================
      // GET TRANSACTIONS
      // ================================================

      const transactions =
        await Transaction.find(filter)
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "order",
            "orderNumber status"
          )
          .sort(sort)
          .skip(skip)
          .limit(limit);

      const total =
        await Transaction.countDocuments(
          filter
        );

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        totalTransactions:
          total,

        currentPage: page,

        totalPages:
          Math.ceil(
            total / limit
          ),

        transactions,
      });

    } catch (error) {
      console.error(
        "Get All Transactions Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch transactions.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// GET TRANSACTION BY ID
// GET /api/v1/transactions/:id
// Admin Only
// ======================================================

export const getTransactionById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const transaction =
        await Transaction.findById(id)
          .populate(
            "user",
            "name email phone"
          )
          .populate("order");

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message:
            "Transaction not found.",
        });
      }

      return res.status(200).json({
        success: true,
        transaction,
      });

    } catch (error) {
      console.error(
        "Get Transaction By ID Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch transaction.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// GET USER TRANSACTIONS
// GET /api/v1/transactions/my
// Logged In User
// ======================================================

export const getUserTransactions =
  async (req, res) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      const status =
        req.query.status || "";

      const sort =
        req.query.sort || "-createdAt";

      // ==================================================
      // FILTER
      // ==================================================

      const filter = {
        user: req.user._id,
      };

      if (status) {
        filter.status = status;
      }

      // ==================================================
      // GET USER TRANSACTIONS
      // ==================================================

      const transactions =
        await Transaction.find(filter)
          .populate(
            "order",
            "orderNumber status"
          )
          .sort(sort)
          .skip(skip)
          .limit(limit);

      const total =
        await Transaction.countDocuments(
          filter
        );

      // ==================================================
      // CALCULATE SUMMARY
      // ==================================================

      const summary =
        await Transaction.aggregate([
          {
            $match: {
              user: req.user._id,
            },
          },
          {
            $group: {
              _id: null,

              totalAmount: {
                $sum: "$amount",
              },

              totalTransactions: {
                $sum: 1,
              },

              successfulPayments: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Paid",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              failedPayments: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "Failed",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]);

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        currentPage: page,

        totalPages:
          Math.ceil(
            total / limit
          ),

        totalTransactions:
          total,

        summary:
          summary[0] || {
            totalAmount: 0,
            totalTransactions: 0,
            successfulPayments: 0,
            failedPayments: 0,
          },

        transactions,
      });

    } catch (error) {
      console.error(
        "Get User Transactions Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch user transactions.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// UPDATE TRANSACTION STATUS
// PATCH /api/v1/transactions/:id/status
// Admin Only
// ======================================================

export const updateTransactionStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { status } = req.body;

      // ==================================================
      // VALID STATUS
      // ==================================================

      const allowedStatus = [
        "Pending",
        "Authorized",
        "Paid",
        "Failed",
        "Cancelled",
        "Refunded",
        "Partially Refunded",
      ];

      if (
        !allowedStatus.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid transaction status.",
        });
      }

      // ==================================================
      // FIND TRANSACTION
      // ==================================================

      const transaction =
        await Transaction.findById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message:
            "Transaction not found.",
        });
      }

      // ==================================================
      // UPDATE TRANSACTION
      // ==================================================

      transaction.status = status;

      await transaction.save();

      // ==================================================
      // FIND RELATED ORDER
      // ==================================================

      const order =
        await Order.findById(
          transaction.order
        );

      if (order) {
        switch (status) {
          case "Paid":
            order.payment.status =
              "Paid";

            order.payment.paymentId =
              transaction.razorpayPaymentId;

            order.payment.orderId =
              transaction.razorpayOrderId;

            order.payment.transactionId =
              transaction.transactionId;

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

            break;

          case "Failed":
            order.payment.status =
              "Failed";
            break;

          case "Cancelled":
            order.payment.status =
              "Cancelled";
            break;

          case "Refunded":
            order.payment.status =
              "Refunded";

            order.payment.refundedAt =
              new Date();

            break;

          case "Partially Refunded":
            order.payment.status =
              "Partially Refunded";

            break;

          default:
            order.payment.status =
              status;
        }

        await order.save();
      }

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        message:
          "Transaction status updated successfully.",

        transaction,
      });

    } catch (error) {
      console.error(
        "Update Transaction Status Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to update transaction status.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// REFUND TRANSACTION
// POST /api/v1/transactions/:id/refund
// Admin Only
// ======================================================

export const refundTransaction =
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        refundAmount,
        refundReason,
        refundId,
      } = req.body;

      // ==================================================
      // FIND TRANSACTION
      // ==================================================

      const transaction =
        await Transaction.findById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message:
            "Transaction not found.",
        });
      }

      // ==================================================
      // ONLY PAID TRANSACTIONS
      // ==================================================

      if (
        transaction.status !==
        "Paid"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only paid transactions can be refunded.",
        });
      }

      // ==================================================
      // VALIDATE REFUND AMOUNT
      // ==================================================

      const amount =
        Number(refundAmount);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid refund amount.",
        });
      }

      if (
        amount >
        transaction.amount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Refund amount cannot exceed transaction amount.",
        });
      }

      // ==================================================
      // FULL OR PARTIAL REFUND
      // ==================================================

      const isFullRefund =
        amount ===
        transaction.amount;

      transaction.status =
        isFullRefund
          ? "Refunded"
          : "Partially Refunded";

      // ==================================================
      // SAVE REFUND DETAILS
      // ==================================================

      transaction.refund.refundId =
        refundId || "";

      transaction.refund.refundAmount =
        amount;

      transaction.refund.refundReason =
        refundReason || "";

      transaction.refund.refundedAt =
        new Date();

      await transaction.save();

      // ==================================================
      // UPDATE ORDER
      // ==================================================

      const order =
        await Order.findById(
          transaction.order
        );

      if (order) {
        order.payment.status =
          transaction.status;

        order.payment.refundId =
          refundId || "";

        order.payment.refundAmount =
          amount;

        order.payment.refundedAt =
          new Date();

        await order.save();
      }

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        message: isFullRefund
          ? "Full refund completed successfully."
          : "Partial refund completed successfully.",

        refund: {
          refundId:
            transaction.refund
              .refundId,

          refundAmount:
            transaction.refund
              .refundAmount,

          refundReason:
            transaction.refund
              .refundReason,

          refundedAt:
            transaction.refund
              .refundedAt,
        },

        transaction,
      });

    } catch (error) {
      console.error(
        "Refund Transaction Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to refund transaction.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// DELETE TRANSACTION
// DELETE /api/v1/transactions/:id
// Admin Only
// ======================================================

export const deleteTransaction =
  async (req, res) => {
    try {
      const { id } = req.params;

      // ==================================================
      // FIND TRANSACTION
      // ==================================================

      const transaction =
        await Transaction.findById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message:
            "Transaction not found.",
        });
      }

      // ==================================================
      // PROTECTED STATUS
      //
      // Paid / Refunded transactions should
      // never be deleted.
      // ==================================================

      const protectedStatus = [
        "Paid",
        "Refunded",
        "Partially Refunded",
      ];

      if (
        protectedStatus.includes(
          transaction.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Paid or refunded transactions cannot be deleted.",
        });
      }

      // ==================================================
      // DELETE TRANSACTION
      // ==================================================

      await Transaction.findByIdAndDelete(
        id
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        message:
          "Transaction deleted successfully.",
      });

    } catch (error) {
      console.error(
        "Delete Transaction Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to delete transaction.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// GET TRANSACTION STATISTICS
// GET /api/v1/transactions/statistics
// Admin Only
// ======================================================

export const getTransactionStatistics =
  async (req, res) => {
    try {

      // ==================================================
      // STATUS COUNTS
      // ==================================================

      const [
        totalTransactions,
        paidTransactions,
        pendingTransactions,
        failedTransactions,
        refundedTransactions,
        partialRefundTransactions,
        cancelledTransactions,
      ] = await Promise.all([
        Transaction.countDocuments(),

        Transaction.countDocuments({
          status: "Paid",
        }),

        Transaction.countDocuments({
          status: "Pending",
        }),

        Transaction.countDocuments({
          status: "Failed",
        }),

        Transaction.countDocuments({
          status: "Refunded",
        }),

        Transaction.countDocuments({
          status:
            "Partially Refunded",
        }),

        Transaction.countDocuments({
          status: "Cancelled",
        }),
      ]);

      // ==================================================
      // TOTAL REVENUE
      // ==================================================

      const revenueResult =
        await Transaction.aggregate([
          {
            $match: {
              status: "Paid",
            },
          },

          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum: "$amount",
              },
            },
          },
        ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0]
              .totalRevenue
          : 0;

      // ==================================================
      // TOTAL REFUND
      // ==================================================

      const refundResult =
        await Transaction.aggregate([
          {
            $group: {
              _id: null,

              totalRefund: {
                $sum:
                  "$refund.refundAmount",
              },
            },
          },
        ]);

      const totalRefund =
        refundResult.length > 0
          ? refundResult[0]
              .totalRefund
          : 0;

      // ==================================================
      // MONTHLY REPORT
      // ==================================================

      const monthlyReport =
        await Transaction.aggregate([
          {
            $group: {
              _id: {
                year: {
                  $year:
                    "$createdAt",
                },

                month: {
                  $month:
                    "$createdAt",
                },
              },

              totalTransactions: {
                $sum: 1,
              },

              totalRevenue: {
                $sum: "$amount",
              },
            },
          },

          {
            $sort: {
              "_id.year": -1,
              "_id.month": -1,
            },
          },
        ]);

      // ==================================================
      // RECENT TRANSACTIONS
      // ==================================================

      const recentTransactions =
        await Transaction.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "order",
            "orderNumber"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        statistics: {
          totalTransactions,

          paidTransactions,

          pendingTransactions,

          failedTransactions,

          refundedTransactions,

          partialRefundTransactions,

          cancelledTransactions,

          totalRevenue,

          totalRefund,
        },

        monthlyReport,

        recentTransactions,
      });

    } catch (error) {
      console.error(
        "Transaction Statistics Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch transaction statistics.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };