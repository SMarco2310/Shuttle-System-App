import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";

// process.env.LIVE_KEY = "";

function BookingForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [shuttle, setShuttle] = useState(""); // Stores shuttle ID
  const [locations, setLocations] = useState([]);
  const [shuttles, setShuttles] = useState([]);
  const [user, setUser] = useState(null);

  const cached = localStorage.getItem("locations");
  const user_id = JSON.parse(localStorage.getItem("user")).userId;
  const token = localStorage.getItem("token");

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/locations");
      const data = await response.json();
      localStorage.setItem("locations", JSON.stringify(data));
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    const fetchShuttles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/shuttle");
        const data = await response.json();
        setShuttles(data);
      } catch (error) {
        console.error("Error fetching shuttles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cached) {
      setLocations(JSON.parse(cached));
    } else {
      fetchLocations();
    }

    fetchShuttles();
  }, [cached]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/user/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user_id]);

  async function handleBooking() {
    try {
      setLoading(true);

      // Parse user once at the beginning
      const userData = typeof user === "string" ? JSON.parse(user) : user;

      // Step 1: Create booking
      const bookingRes = await fetch("http://localhost:3000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user_id,
          pickupLocation_Id: parseInt(pickupLocation),
          dropoffLocation_Id: parseInt(dropoffLocation),
          shuttleId: parseInt(shuttle),
        }),
      });

      // Check if response is ok before parsing
      if (!bookingRes) {
        const errorText = await bookingRes.error();
        console.error("Booking response error:", errorText);
        throw new Error("Booking failed");
      }

      const booking = await bookingRes.json();
      console.log("Booking created:", booking);

      // Step 2: Initialize payment via backend
      const paymentRes = await fetch(
        "http://localhost:3000/api/payments/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            amount: booking.price,
            bookingId: booking.id,
          }),
        },
      );

      if (!paymentRes.ok) {
        const errorText = await paymentRes.error();
        console.error("Payment init response error:", errorText);
        throw new Error("Payment initialization failed");
      }

      const paymentData = await paymentRes.json();
      const { reference } = paymentData;

      // Step 3: Launch Paystack popup
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: "pk_live_1fca924812ade85695ff45462a0911484aa6685e",
        email: userData.email, // Use the already parsed user data
        amount: booking.price * 100, // in pesewas
        reference: reference,
        onSuccess: async (transaction) => {
          console.log("Payment success:", transaction);

          // Step 4: Verify with backend - fix the endpoint
          const verifyRes = await fetch(
            `http://localhost:3000/api/payments/verify/${transaction.reference}`, // Changed to URL param
            {
              method: "GET", // Changed to GET since you're using URL params
              headers: { "Content-Type": "application/json" },
            },
          );

          if (!verifyRes) {
            console.error("Verify response error:", await verifyRes.error());
            navigate("/payment-failed");
            return;
          }

          const verifyData = await verifyRes.json();
          if (verifyData.status === "success") {
            navigate("/payment-success");
          } else {
            navigate("/payment-failed");
          }
        },
        onCancel: () => {
          navigate("/payment-failed");
          alert("Payment cancelled");

        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      navigate("/payment-failed");
    } finally {
      setLoading(false);
    }
  }

  let date = "";
  let time = "";
  const shuttleObj = shuttles.find((s) => s.id === parseInt(shuttle));

  if (shuttleObj) {
    [date, time] = shuttleObj.departure_time.split("T");
    time = "17:00";
  }
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="booking-form-container max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleBooking();
        }}
        className="space-y-4"
      >
        <div className="form-group">
          <label htmlFor="pickup">Pickup Location:</label>
          <select
            id="pickup"
            name="pickup"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
          >
            <option value="">-- Select Pickup --</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                Location: {toTitleCase(location.location_name) + "  |  "}
                price: {location.price}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination:</label>
          <select
            id="destination"
            name="destination"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            required
          >
            <option value="">-- Select Destination --</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                Location: {toTitleCase(location.location_name) + "  |  "}
                price: {location.price}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="shuttle">Shuttle:</label>
          <select
            id="shuttle"
            name="shuttle"
            value={shuttle}
            onChange={(e) => setShuttle(e.target.value)}
            required
          >
            <option value="">-- Select Shuttle --</option>
            {shuttles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.booked_seats}/{s.capacity})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Departure Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            readOnly
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={time}
            readOnly
            required
          />
        </div>

        <div className="form-actions pt-4">
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Book Now"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
