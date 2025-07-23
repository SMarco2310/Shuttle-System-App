import BookingForm from "../components/BookingForm";
import { Link } from "react-router-dom";

function Booking() {
  return (
    <>
      <div className="navbar-container" role="banner">
        <div className="logo-container">
          <Link to="/" aria-label="Home">
            {/* Use import or public URL for images depending on setup */}
            <img src="/logo.png" alt="ShuttleApp Logo" width="50" height="50" />
          </Link>
          {/* <span>ShuttleApp</span> */}
        </div>
      </div>

      <div className="booking-form-wrapper px-4">
        <BookingForm />
      </div>

      <div className="booking-footer text-center text-sm text-gray-500 py-4">
        <p>© 2025 Shuttle System. All rights reserved.</p>
      </div>
    </>
  );
}

export default Booking;
