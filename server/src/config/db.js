import mongoose from "mongoose";

// ======================================================
// MONGODB CONNECTION CONFIG
// ======================================================

const connectDB = async () => {
  try {
    // --------------------------------------------------
    // ENV CHECK
    // --------------------------------------------------

    const mongoURI =
      process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGODB_URI is missing in .env file."
      );
    }

    // --------------------------------------------------
    // MONGOOSE SETTINGS
    // --------------------------------------------------

    mongoose.set(
      "strictQuery",
      true
    );

    // --------------------------------------------------
    // CONNECT TO MONGODB
    // --------------------------------------------------

    const conn =
      await mongoose.connect(
        mongoURI,
        {
          // MongoDB server selection timeout
          serverSelectionTimeoutMS: 10000,

          // Initial connection timeout
          connectTimeoutMS: 10000,

          // Socket inactivity timeout
          socketTimeoutMS: 30000,

          // Connection pool
          maxPoolSize: 10,
          minPoolSize: 2,

          // MongoDB retry support
          retryWrites: true,
          retryReads: true,

          // Keep connections healthy
          heartbeatFrequencyMS: 10000,
        }
      );

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    console.log(
      `📦 Database: ${conn.connection.name}`
    );

    console.log(
      `🔌 MongoDB State: ${conn.connection.readyState === 1 ? "Connected" : "Disconnected"}`
    );

    // --------------------------------------------------
    // CONNECTION EVENTS
    // --------------------------------------------------

    mongoose.connection.on(
      "error",
      (error) => {
        console.error(
          "❌ MongoDB Runtime Error:",
          error.message
        );
      }
    );

    mongoose.connection.on(
      "disconnected",
      () => {
        console.warn(
          "⚠️ MongoDB Disconnected."
        );
      }
    );

    mongoose.connection.on(
      "reconnected",
      () => {
        console.log(
          "🔄 MongoDB Reconnected."
        );
      }
    );

    mongoose.connection.on(
      "connecting",
      () => {
        console.log(
          "🔄 Connecting to MongoDB..."
        );
      }
    );

    mongoose.connection.on(
      "connected",
      () => {
        console.log(
          "🟢 MongoDB Connection Established."
        );
      }
    );

    return conn;
  } catch (error) {
    // --------------------------------------------------
    // CONNECTION FAILURE
    // --------------------------------------------------

    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );

    if (
      error?.reason
    ) {
      console.error(
        "MongoDB Connection Reason:",
        error.reason
      );
    }

    process.exit(1);
  }
};

// ======================================================
// EXPORT
// ======================================================

export default connectDB;