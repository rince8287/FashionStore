import dotenv from "dotenv";

// ================= LOAD ENV VARIABLES FIRST =================
dotenv.config();

// ================= START SERVER =================
const startServer = async () => {
  try {
    // Dynamic imports:
    // .env load hone ke BAAD app.js aur db.js load honge
    const { default: app } = await import("./app.js");
    const { default: connectDB } = await import("./config/db.js");

    // ================= PORT =================
    const PORT = process.env.PORT || 5000;

    // ================= CHECK REQUIRED ENV =================
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env file");
    }

    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is missing in .env file");
    }

    // ================= CONNECT DATABASE =================
    await connectDB();

    // ================= START EXPRESS SERVER =================
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );

      console.log(
        `🌐 Client URL: ${process.env.CLIENT_URL}`
      );

      console.log(
        `⚙️ Environment: ${process.env.NODE_ENV || "development"}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Server Startup Error:",
      error.message
    );

    process.exit(1);
  }
};

// ================= RUN SERVER =================
startServer();