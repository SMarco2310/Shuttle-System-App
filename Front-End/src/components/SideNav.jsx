import { Link } from "react-router-dom";

function SideNav({ show }) {
  return (
    <div className={`sidenav ${show ? "show" : ""}`}>
      <h2 className="sidenav-title">Admin Menu</h2>
      <nav className="sidenav-links">
        <Link to="/admin/" className="sidenav-link">
          👤 Dashboard
        </Link>
        <Link to="/admin/users" className="sidenav-link">
          👥 Manage Users
        </Link>
        <Link to="/admin/locations" className="sidenav-link">
          📍 Manage Locations
        </Link>
      </nav>
    </div>
  );
}

export default SideNav;
