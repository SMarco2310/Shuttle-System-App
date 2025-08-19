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

//
import cors from "cors";
//
dotenv.config();

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
    origin: "http://localhost:5173", // or whatever your frontend port is
    credentials: true, // allow cookies/credentials
  }),
);
// this is for the scheduling of the shuttle
//

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

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

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
