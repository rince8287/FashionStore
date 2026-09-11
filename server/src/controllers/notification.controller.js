import Notification from "../models/Notification.js";

// ======================================================
// CREATE NOTIFICATION
// POST /api/v1/notifications
// Admin / System
// ======================================================

export const createNotification =
  async (req, res) => {
    try {
      const {
        user,
        title,
        message,
        type,
        priority,
        actionUrl,
        order,
        product,
        transaction,
        coupon,
        review,
        icon,
        metadata,
      } = req.body;

      // ================================================
      // VALIDATION
      // ================================================

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User is required.",
        });
      }

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required.",
        });
      }

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required.",
        });
      }

      // ================================================
      // CREATE
      // ================================================

      const notification =
        await Notification.create({
          user,

          title,

          message,

          type:
            type || "System",

          priority:
            priority ||
            "Medium",

          actionUrl:
            actionUrl || "",

          order:
            order || null,

          product:
            product || null,

          transaction:
            transaction ||
            null,

          coupon:
            coupon || null,

          review:
            review || null,

          icon:
            icon || "bell",

          metadata:
            metadata || {},
        });

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(201).json({
        success: true,

        message:
          "Notification created successfully.",

        notification,
      });

    } catch (error) {
      console.error(
        "Create Notification Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to create notification.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// GET MY NOTIFICATIONS
// GET /api/v1/notifications/my
// Logged In User
// ======================================================

export const getMyNotifications =
  async (req, res) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      const isRead =
        req.query.isRead;

      const sort =
        req.query.sort || "-createdAt";

      // ================================================
      // FILTER
      // ================================================

      const filter = {
        user: req.user._id,
        isActive: true,
      };

      if (
        isRead !== undefined
      ) {
        filter.isRead =
          isRead === "true";
      }

      // ================================================
      // FIND NOTIFICATIONS
      // ================================================

      const notifications =
        await Notification.find(filter)
          .populate(
            "order",
            "orderNumber status"
          )
          .populate(
            "product",
            "name"
          )
          .populate(
            "transaction",
            "transactionId amount"
          )
          .populate(
            "coupon",
            "code title"
          )
          .populate(
            "review",
            "rating"
          )
          .sort(sort)
          .skip(skip)
          .limit(limit);

      const total =
        await Notification.countDocuments(
          filter
        );

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        totalNotifications:
          total,

        currentPage: page,

        totalPages:
          Math.ceil(
            total / limit
          ),

        notifications,
      });

    } catch (error) {
      console.error(
        "Get My Notifications Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch notifications.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// GET NOTIFICATION BY ID
// GET /api/v1/notifications/:id
// Logged In User
// ======================================================

export const getNotificationById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const notification =
        await Notification.findOne({
          _id: id,
          user: req.user._id,
        })
          .populate("order")
          .populate("product")
          .populate("transaction")
          .populate("coupon")
          .populate("review");

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      return res.status(200).json({
        success: true,

        notification,
      });

    } catch (error) {
      console.error(
        "Get Notification By ID Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch notification.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// MARK NOTIFICATION AS READ
// PATCH /api/v1/notifications/:id/read
// Logged In User
// ======================================================

export const markAsRead =
  async (req, res) => {
    try {
      const { id } = req.params;

      // ================================================
      // FIND NOTIFICATION
      // ================================================

      const notification =
        await Notification.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      // ================================================
      // ALREADY READ
      // ================================================

      if (notification.isRead) {
        return res.status(200).json({
          success: true,
          message:
            "Notification already marked as read.",
          notification,
        });
      }

      // ================================================
      // UPDATE
      // ================================================

      notification.isRead = true;

      notification.readAt =
        new Date();

      await notification.save();

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        message:
          "Notification marked as read.",

        notification,
      });

    } catch (error) {
      console.error(
        "Mark As Read Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to mark notification as read.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/v1/notifications/read-all
// Logged In User
// ======================================================

export const markAllAsRead =
  async (req, res) => {
    try {

      // ================================================
      // UPDATE ALL UNREAD NOTIFICATIONS
      // ================================================

      const result =
        await Notification.updateMany(
          {
            user: req.user._id,
            isRead: false,
            isActive: true,
          },
          {
            $set: {
              isRead: true,
              readAt: new Date(),
            },
          }
        );

      // ================================================
      // FETCH UPDATED NOTIFICATIONS
      // ================================================

      const notifications =
        await Notification.find({
          user: req.user._id,
          isActive: true,
        })
          .sort({
            createdAt: -1,
          })
          .limit(20);

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        message:
          "All notifications marked as read.",

        modifiedCount:
          result.modifiedCount,

        notifications,
      });

    } catch (error) {
      console.error(
        "Mark All As Read Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to mark all notifications as read.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// DELETE SINGLE NOTIFICATION
// DELETE /api/v1/notifications/:id
// Logged In User
// ======================================================

export const deleteNotification =
  async (req, res) => {
    try {
      const { id } = req.params;

      // ================================================
      // FIND NOTIFICATION
      // ================================================

      const notification =
        await Notification.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      // ================================================
      // DELETE
      // ================================================

      await notification.deleteOne();

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        message:
          "Notification deleted successfully.",
      });

    } catch (error) {
      console.error(
        "Delete Notification Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to delete notification.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/v1/notifications
// Logged In User
// ======================================================

export const deleteAllNotifications =
  async (req, res) => {
    try {

      // ================================================
      // DELETE USER NOTIFICATIONS
      // ================================================

      const result =
        await Notification.deleteMany({
          user: req.user._id,
        });

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        message:
          "All notifications deleted successfully.",

        deletedCount:
          result.deletedCount,
      });

    } catch (error) {
      console.error(
        "Delete All Notifications Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to delete notifications.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/v1/notifications/unread-count
// Logged In User
// ======================================================

export const getUnreadCount =
  async (req, res) => {
    try {

      // ================================================
      // COUNT UNREAD NOTIFICATIONS
      // ================================================

      const unreadCount =
        await Notification.countDocuments({
          user: req.user._id,
          isRead: false,
          isActive: true,
        });

      // ================================================
      // COUNT TOTAL NOTIFICATIONS
      // ================================================

      const totalNotifications =
        await Notification.countDocuments({
          user: req.user._id,
          isActive: true,
        });

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        unreadCount,

        totalNotifications,
      });

    } catch (error) {
      console.error(
        "Get Unread Count Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch unread notification count.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// GET NOTIFICATION STATISTICS
// GET /api/v1/notifications/statistics
// Admin Only
// ======================================================

export const getNotificationStatistics =
  async (req, res) => {
    try {

      // ================================================
      // TOTAL COUNTS
      // ================================================

      const [
        totalNotifications,
        readNotifications,
        unreadNotifications,
      ] = await Promise.all([

        Notification.countDocuments(),

        Notification.countDocuments({
          isRead: true,
        }),

        Notification.countDocuments({
          isRead: false,
        }),

      ]);

      // ================================================
      // TYPE WISE STATS
      // ================================================

      const typeStatistics =
        await Notification.aggregate([
          {
            $group: {
              _id: "$type",

              total: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              total: -1,
            },
          },
        ]);

      // ================================================
      // PRIORITY STATS
      // ================================================

      const priorityStatistics =
        await Notification.aggregate([
          {
            $group: {
              _id: "$priority",

              total: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              total: -1,
            },
          },
        ]);

      // ================================================
      // RECENT NOTIFICATIONS
      // ================================================

      const recentNotifications =
        await Notification.find()
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        statistics: {

          totalNotifications,

          readNotifications,

          unreadNotifications,

        },

        typeStatistics,

        priorityStatistics,

        recentNotifications,

      });

    } catch (error) {

      console.error(
        "Notification Statistics Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch notification statistics.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,

      });
    }
  };