function Footer() {
  return (
    <footer className="footer-container">
      <div className="contact-info container">
        <div className="contact-info-item">
          <h1>Contact Us</h1>
          <p>Email: info@shuttlesystem.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div className="contact-info-item">
          <h3>Follow Us</h3>
          <p>
            <a href="#">Twitter</a>
          </p>
          <p>
            <a href="#">Instagram</a>
          </p>
        </div>
        <div className="contact-info-item">
          <h3>Our Location</h3>
          <p>1 University Avenue</p>
          <p>Berekuso, Ghana</p>
        </div>
      </div>
      <p className="copyright">
        &copy; {new Date().getFullYear()} Shuttle System
      </p>
    </footer>
  );
}

export default Footer;
