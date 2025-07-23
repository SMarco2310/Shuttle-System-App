import { useState, useEffect } from "react";
import BookingDetails from "./BookingDetails";

function BookingHistory({ userId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/booking/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Error ${response.status}`);
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Fetching error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      <h2
        className="booking-history"
        style={{ margin: "20px 15px 15px 15px", right: "15px" }}
      >
        My Bookings
      </h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking, bookingIndex) => (
          <BookingDetails
            key={booking.id || bookingIndex}
            booking={booking}
            bookingIndex={bookingIndex}
          />
        ))
      )}
    </>
  );
}

export default BookingHistory;
