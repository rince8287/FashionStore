import mongoose from "mongoose";

// ======================================================
// ORDER ITEM SCHEMA
// ======================================================

const orderItemSchema = new mongoose.Schema(
  {
    // ==================================================
    // PRODUCT
    // ==================================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ==================================================
    // PRODUCT INFORMATION SNAPSHOT
    // ==================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    sku: {
      type: String,
      default: "",
    },

    // ==================================================
    // VARIANTS
    // ==================================================

    size: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    // ==================================================
    // QUANTITY
    // ==================================================

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // ==================================================
    // PRICE SNAPSHOT
    // ==================================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==================================================
    // TOTAL PRICE
    // ==================================================

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// SHIPPING ADDRESS SNAPSHOT
// ======================================================

const shippingAddressSchema =
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      alternatePhone: {
        type: String,
        default: "",
      },

      label: {
        type: String,
        default: "Home",
      },

      houseNumber: {
        type: String,
        required: true,
      },

      area: {
        type: String,
        required: true,
      },

      landmark: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        default: "India",
      },

      postalCode: {
        type: String,
        required: true,
      },

      addressType: {
        type: String,
        default: "Home",
      },

      deliveryInstructions: {
        type: String,
        default: "",
      },

      location: {
        latitude: {
          type: Number,
          default: null,
        },

        longitude: {
          type: Number,
          default: null,
        },
      },
    },
    {
      _id: false,
    }
  );

// ======================================================
// PAYMENT SCHEMA
// ======================================================

const paymentSchema =
  new mongoose.Schema(
    {
      // ==================================================
      // PAYMENT METHOD
      // ==================================================

      method: {
        type: String,

        enum: [
          "COD",
          "Razorpay",
          "UPI",
          "Card",
          "NetBanking",
          "Wallet",
        ],

        default: "COD",
      },

      // ==================================================
      // PAYMENT STATUS
      // ==================================================

      status: {
        type: String,

        enum: [
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
        ],

        default: "Pending",
      },

      // ==================================================
      // PAYMENT IDS
      // ==================================================

      transactionId: {
        type: String,
        default: "",
      },

      paymentId: {
        type: String,
        default: "",
      },

      orderId: {
        type: String,
        default: "",
      },

      signature: {
        type: String,
        default: "",
      },

      // ==================================================
      // PAID TIME
      // ==================================================

      paidAt: {
        type: Date,
        default: null,
      },

      // ==================================================
      // REFUND
      // ==================================================

      refundId: {
        type: String,
        default: "",
      },

      refundedAt: {
        type: Date,
        default: null,
      },
    },
    {
      _id: false,
    }
  );

// ======================================================
// SHIPPING SCHEMA
// ======================================================

const shippingSchema =
  new mongoose.Schema(
    {
      status: {
        type: String,

        enum: [
          "Pending",
          "Confirmed",
          "Packed",
          "Shipped",
          "Out For Delivery",
          "Delivered",
          "Cancelled",
          "Returned",
        ],

        default: "Pending",
      },

      courierName: {
        type: String,
        default: "",
      },

      trackingNumber: {
        type: String,
        default: "",
      },

      trackingUrl: {
        type: String,
        default: "",
      },

      estimatedDelivery: {
        type: Date,
        default: null,
      },

      shippedAt: {
        type: Date,
        default: null,
      },

      deliveredAt: {
        type: Date,
        default: null,
      },

      cancelledAt: {
        type: Date,
        default: null,
      },

      returnedAt: {
        type: Date,
        default: null,
      },
    },
    {
      _id: false,
    }
  );

// ======================================================
// COUPON SCHEMA
// ======================================================

const couponSchema =
  new mongoose.Schema(
    {
      code: {
        type: String,
        default: "",
      },

      discountType: {
        type: String,

        enum: [
          "Percentage",
          "Flat",
        ],

        default: "Flat",
      },

      discountValue: {
        type: Number,
        default: 0,
        min: 0,
      },

      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

// ======================================================
// PRICE DETAILS SCHEMA
// ======================================================

const priceDetailsSchema =
  new mongoose.Schema(
    {
      subtotal: {
        type: Number,
        required: true,
        default: 0,
      },

      productDiscount: {
        type: Number,
        default: 0,
      },

      couponDiscount: {
        type: Number,
        default: 0,
      },

      shippingCharge: {
        type: Number,
        default: 0,
      },

      tax: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    {
      _id: false,
    }
  );

// ======================================================
// ORDER SCHEMA
// ======================================================

const orderSchema =
  new mongoose.Schema(
    {
      // ==================================================
      // ORDER NUMBER
      // ==================================================

      orderNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
      },

      // ==================================================
      // USER
      // ==================================================

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // ==================================================
      // ORDER ITEMS
      // ==================================================

      items: {
        type: [orderItemSchema],

        required: true,

        validate: {
          validator: function (items) {
            return (
              Array.isArray(items) &&
              items.length > 0
            );
          },

          message:
            "Order must contain at least one item.",
        },
      },

      // ==================================================
      // SHIPPING ADDRESS
      // ==================================================

      shippingAddress: {
        type: shippingAddressSchema,
        required: true,
      },

      // ==================================================
      // PAYMENT
      // ==================================================

      payment: {
        type: paymentSchema,
        default: () => ({}),
      },

      // ==================================================
      // SHIPPING
      // ==================================================

      shipping: {
        type: shippingSchema,
        default: () => ({}),
      },

      // ==================================================
      // COUPON
      // ==================================================

      coupon: {
        type: couponSchema,
        default: () => ({}),
      },

      // ==================================================
      // PRICE DETAILS
      // ==================================================

      priceDetails: {
        type: priceDetailsSchema,
        required: true,
      },

      // ==================================================
      // ORDER STATUS
      // ==================================================

      status: {
        type: String,

        enum: [
          "Pending",
          "Confirmed",
          "Packed",
          "Shipped",
          "Out For Delivery",
          "Delivered",
          "Cancelled",
          "Returned",
        ],

        default: "Pending",

        index: true,
      },

      // ==================================================
      // CUSTOMER NOTES
      // ==================================================

      customerNote: {
        type: String,
        default: "",
        maxlength: 500,
        trim: true,
      },

      // ==================================================
      // ADMIN NOTES
      // ==================================================

      adminNote: {
        type: String,
        default: "",
        maxlength: 500,
        trim: true,
      },

      // ==================================================
      // CANCELLATION
      // ==================================================

      cancelReason: {
        type: String,
        default: "",
      },

      cancelledBy: {
        type: String,

        enum: [
          "",
          "Customer",
          "Admin",
        ],

        default: "",
      },

      // ==================================================
      // RETURN
      // ==================================================

      returnReason: {
        type: String,
        default: "",
      },

      returnStatus: {
        type: String,

        enum: [
          "",
          "Requested",
          "Approved",
          "Rejected",
          "Completed",
        ],

        default: "",
      },

      // ==================================================
      // DELIVERY
      // ==================================================

      deliveredAt: {
        type: Date,
        default: null,
      },

      // ==================================================
      // INVOICE
      // ==================================================

      invoiceNumber: {
        type: String,
        default: "",
      },

      invoiceUrl: {
        type: String,
        default: "",
      },

      // ==================================================
      // ACTIVE
      // ==================================================

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

// ======================================================
// VIRTUALS
// ======================================================

// Total Products
orderSchema.virtual(
  "totalItems"
).get(function () {
  return this.items.length;
});


// Total Quantity
orderSchema.virtual(
  "totalQuantity"
).get(function () {
  return this.items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
});

// ======================================================
// METHODS
// ======================================================

// Check if Order Delivered
orderSchema.methods.isDelivered =
  function () {
    return (
      this.status ===
      "Delivered"
    );
  };


// Check if Order Cancelled
orderSchema.methods.isCancelled =
  function () {
    return (
      this.status ===
      "Cancelled"
    );
  };


// Check if Order Returned
orderSchema.methods.isReturned =
  function () {
    return (
      this.status ===
      "Returned"
    );
  };


// Check if Payment Completed
orderSchema.methods.isPaid =
  function () {
    return (
      this.payment.status ===
      "Paid"
    );
  };

// ======================================================
// PRE SAVE
// ======================================================
//
// IMPORTANT:
// Do NOT use `next` here.
//
// Current Mongoose middleware execution is
// causing `next is not a function` in this project.
//
// This middleware is synchronous, so simply
// returning is enough.
// ======================================================

orderSchema.pre(
  "save",
  function () {

    // ==============================================
    // DELIVERED TIME
    // ==============================================

    if (
      this.status ===
        "Delivered" &&
      !this.deliveredAt
    ) {
      this.deliveredAt =
        new Date();
    }


    // ==============================================
    // PAYMENT TIME
    // ==============================================

    if (
      this.payment &&
      this.payment.status ===
        "Paid" &&
      !this.payment.paidAt
    ) {
      this.payment.paidAt =
        new Date();
    }

    // No next()
    return;
  }
);

// ======================================================
// INDEXES
// ======================================================

orderSchema.index({
  orderNumber: 1,
});

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  status: 1,
});

orderSchema.index({
  "payment.status": 1,
});

orderSchema.index({
  "shipping.status": 1,
});

// ======================================================
// JSON SETTINGS
// ======================================================

orderSchema.set(
  "toJSON",
  {
    virtuals: true,

    transform(
      doc,
      ret
    ) {
      delete ret.__v;

      return ret;
    },
  }
);


// ======================================================
// OBJECT SETTINGS
// ======================================================

orderSchema.set(
  "toObject",
  {
    virtuals: true,
  }
);

// ======================================================
// MODEL
// ======================================================

const Order =
  mongoose.model(
    "Order",
    orderSchema
  );

export default Order;