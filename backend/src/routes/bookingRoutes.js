import { Router } from "express";
import prisma from "../config/prismaClient.js";
import { calculatePrice } from "../utils/utils.js";

const bookingRouter = Router();

// Get all bookings
bookingRouter.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a booking by id
bookingRouter.get("/:id", async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new booking (email removed, payment handled separately)
bookingRouter.post("/", async (req, res) => {
  const { userId, pickupLocation_Id, dropoffLocation_Id, shuttleId } = req.body;

  try {
    const price = (
      await calculatePrice(dropoffLocation_Id, pickupLocation_Id)
    ).valueOf();
    if (price < 0) return res.status(400).json({ error: "Invalid price" });

    const booking = await prisma.booking.create({
      data: {
        price,
        userId,
        pickupLocation_Id,
        dropoffLocation_Id,
        shuttleId,
        bookingTime: new Date(),
        status: "PENDING", // booking not yet paid
      },
    });

    // Update shuttle seats
    const currentShuttle = await prisma.shuttle.findUnique({
      where: { id: shuttleId },
    });
    if (currentShuttle.booked_seats >= currentShuttle.capacity) {
      await prisma.shuttle.update({
        where: { id: shuttleId },
        data: { status: { set: "FULL" } },
      });
      return res.status(400).json({ error: "Shuttle is full" });
    } else {
      await prisma.shuttle.update({
        where: { id: shuttleId },
        data: { booked_seats: { increment: 1 } },
      });
    }

    // Respond immediately with booking info
    res.json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a booking
bookingRouter.put("/:id", async (req, res) => {
  const { userId, pickupLocation, dropoffLocation } = req.body;
  try {
    const price = await calculatePrice(dropoffLocation, pickupLocation);
    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: {
        userId,
        pickupLocation,
        dropoffLocation,
        bookingTime: new Date(),
        price,
      },
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a booking
bookingRouter.delete("/:id", async (req, res) => {
  try {
    const booking = await prisma.booking.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all bookings of one user
bookingRouter.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: { pickupLocation: true, dropoffLocation: true },
    });
    const bookingsWithLocations = bookings.map((b) => ({
      id: b.id,
      userId: b.userId,
      pickupLocation: b.pickupLocation?.location_name || "Unknown",
      dropoffLocation: b.dropoffLocation?.location_name || "Unknown",
      bookingTime: b.bookingTime,
      status: b.status,
      price: b.price,
    }));
    res.json(bookingsWithLocations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default bookingRouter;
