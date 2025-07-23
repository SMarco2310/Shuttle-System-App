import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../components/Footer";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <main className="home-container">
      <section id="home" className="hero-section">
        <h1>Welcome to Shuttle System</h1>
        <p>
          Get to your destination faster with reliable shuttles, easy booking,
          and secure mobile payments—all in one place.
        </p>
        <Link to="/booking" className="booking-button">
          Book Now
        </Link>
      </section>

      <section id="services" className="services-section">
        <h1>Why Choose Us?</h1>
        <div className="service-cards">
          <div className="service-card">
            <h3>
              <i className="fa-solid fa-calendar"></i> Easy Booking Process
            </h3>
            <p>
              Shuttle System removes the stress of finding a ride. With a few
              simple clicks, users can view available shuttles, reserve a seat,
              and receive instant confirmation—all from their phone or computer.
            </p>
          </div>

          <div className="service-card">
            <h3>
              <i className="fa-solid fa-money-bill"></i> Simplified Payment
            </h3>
            <p>
              Our integrated payment system supports secure mobile money
              transactions, allowing users to pay for their rides instantly
              without cash or complicated steps.
            </p>
          </div>

          <div className="service-card">
            <h3>
              <i className="fa-solid fa-house"></i> Powerful Admin Dashboard
            </h3>
            <p>
              Institutions and transport managers get access to a dedicated
              admin dashboard to manage routes, monitor bookings, and view
              real-time analytics—all in one place.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <h1>About Shuttle System</h1>
        <p>
          Shuttle System was created to simplify campus and commuter
          transportation. It eliminates the hassle of long waits, confusing
          bookings, and cash-only payments. With just a few taps, users can view
          available shuttles, reserve seats, and pay instantly using mobile
          money. Designed for both riders and drivers, the system makes daily
          travel faster, easier, and more reliable.
        </p>
      </section>

      <section id="contact" className="contact-section">
        <Footer />
      </section>
    </main>
  );
}

export default Home;
