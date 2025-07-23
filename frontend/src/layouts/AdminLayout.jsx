import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import { useState, useEffect } from "react";

function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        setShowSidebar(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>

        <button className="hamburger-btn" onClick={toggleSidebar}>
          {showSidebar ? (
            // "X" Icon for Close
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <>
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* SideNav */}
      <SideNav show={showSidebar} />
    </div>
  );
}

export default AdminLayout;
