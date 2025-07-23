import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
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
      <div className="auth-container">
        <Outlet /> {/* No nav, just render login/signup */}
      </div>
    </>
  );
}
