import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import locationRouter from "./src/routes/locationRoutes.js";
import bookingRouter from "./src/routes/bookingRoutes.js";
import authenticate from "./src/middleware/authMiddleware.js";
import shuttleRouter from "./src/routes/shuttleRoutes.js";
import paymentRouter from "./src/routes/paymentRoutes.js";
import {
  createWeeklyShuttles,
  updateBookingStatus,
  updateShuttleAvailability,
} from "./src/utils/utils.js";
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
//




dotenv.config();

const prisma = new PrismaClient();

// Auto-run migrations on startup
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    await prisma.$executeRaw`SELECT 1`;
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

main();

const app = express();

const PORT = process.env.PORT || 3000;

//
(async () => {
  await updateBookingStatus();
  await updateShuttleAvailability();
})();

// // Handle preflight requests
// app.options(cors(corsOptions)); // Enable preflight for all routes
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // or whatever your frontend port is
    credentials: true, // allow cookies/credentials
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Add error handling middleware at the end
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Run every Friday at 20:00 (midnight)
cron.schedule("00 20 * * 5", async () => {
  try {
    console.log("Running cron task...");
    await createWeeklyShuttles();
  } catch (err) {
    console.error("Cron error:", err.message);
  }
});
// this to allow the parsing of JSON data in the request body

// app.get("/", (req, res) => {
//   res.send("<h1>Hello World!</h1>");
// });

// This make sure that all the enpoint of  authroute is under  auth
app.use("/auth", authRouter);
//
// This make sure that all the enpoint of  userroute is under  user
app.use("/user", userRouter);

// {/*Admin Endpoints*/}

// This make sure that all the enpoint of  userroute that are only for admin is under  admin
app.use("/admin/users", userRouter);

// This make sure that all the enpoint of  userroute that are only for admin is under  admin
app.use("/admin/shuttles", shuttleRouter);
// This make sure that all the enpoint of  locationrroute that are only for admin is under  admin
app.use("/admin/locations", locationRouter);
//
app.use("/admin/bookings", bookingRouter);

// This make sure that all the endpoint of bookingroute is under booking
app.use("/booking", authenticate, bookingRouter);

// This make sure that all the enpoint of  shuttleroute is under  shuttle
app.use("/shuttle", shuttleRouter);
// This make sure that all the enpoint of  shuttleroute that are only for admin is under  admin

// This is for the payment
app.use("/api/payments", paymentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

