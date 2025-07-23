import prisma from "../config/prismaClient.js";

import cron from "node-cron";

// this method is used to calculate the price of a shuttle ride
export const calculatePrice = async (dropOff, pickup) => {
  const loc1 = await prisma.location.findUnique({
    where: { id: dropOff },
  });
  const loc2 = await prisma.location.findUnique({
    where: { id: pickup },
  });

  const price = loc1.price - loc2.price;
  return price;
};

export const nextFriday = () => {
  const today = new Date();
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));
  return nextFriday;
};

export const updateShuttleAvailability = async () => {
  await prisma.shuttle.updateMany({
    where: {
      departure_time: {
        lt: new Date(), // past date
      },
      is_available: true,
    },
    data: {
      status: "COMPLETED",
      is_available: false,
    },
  });
};

export const updateBookingStatus = async () => {
  await prisma.booking.updateMany({
    where: {
      shuttle: {
        departure_time: {
          lt: new Date(),
        },
      },
      status: "PENDING",
    },
    data: {
      status: "COMPLETED",
    },
  });
};

function generateThreeDigitCode() {
  const digit1 = Math.floor(Math.random() * 10); // 0–9
  const digit2 = Math.floor(Math.random() * 10);
  const digit3 = Math.floor(Math.random() * 10);
  const digit4 = Math.floor(Math.random() * 10);

  return `${digit1}${digit2}${digit3}${digit4}`;
}

export const createWeeklyShuttles = async () => {
  await prisma.shuttle.createMany({
    data: [
      {
        name: "Shuttle#" + generateThreeDigitCode(),
        departure_time: nextFriday(),
        is_available: true,
        capacity: 20,
        booked_seats: 0,
        // Add other required fields
      },
      {
        name: "Shuttle#" + generateThreeDigitCode(),
        departure_time: nextFriday(),
        is_available: true,
        capacity: 20,
        booked_seats: 0,
        // Add other required fields
      },
    ],
  });

  console.log("✅ Two new shuttles created for the week.");
};
