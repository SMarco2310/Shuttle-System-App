// import SideNav from "../components/SideNav";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi"; // icon

function Admin() {
  const [users, setUsers] = useState([]);
  const [shuttles, setShuttles] = useState([]);
  const [bookings, setBookings] = useState([]);
  // const [showSidebar, setShowSidebar] = useState(false); // sidebar toggle

  const totalUsers = users.length;
  const totalActiveShuttles = shuttles.filter(
    (shuttle) => shuttle.status === "AVAILABLE",
  ).length;

  const totalPendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;

  function formatBookingTime(bookingTime) {
    const date = new Date(bookingTime);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function getShuttleName(shuttleId) {
    const shuttle = shuttles.find((shuttle) => shuttle.id === shuttleId);
    return shuttle ? shuttle.name : shuttleId;
  }

  function getUserName(userId) {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : userId;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3000/admin/users/");
      const data = await response.json();
      setUsers(data);
    };

    const fetchShuttles = async () => {
      const response = await fetch("http://localhost:3000/admin/shuttles");
      const data = await response.json();
      setShuttles(data);
    };

    const fetchBookings = async () => {
      const response = await fetch("http://localhost:3000/admin/bookings");
      const data = await response.json();
      setBookings(data);
    };

    fetchUsers();
    fetchShuttles();
    fetchBookings();
  }, []);

  return (
    <div className="admin-container">
      <main className="admin-main">
        <div className="dashboard-cards">
          <div className="card">
            <h2>Total Users</h2>
            <p className="card-number blue">{totalUsers}</p>
          </div>
          <div className="card">
            <h2>Shuttles Active</h2>
            <p className="card-number green">{totalActiveShuttles}</p>
          </div>
          <div className="card">
            <h2>Pending Bookings</h2>
            <p className="card-number yellow">{totalPendingBookings}</p>
          </div>
        </div>

        <div className="activity-table">
          <h2 className="table-title">Recent Bookings</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Shuttle</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{getUserName(booking.userId)}</td>
                    <td>{getShuttleName(booking.shuttleId)}</td>
                    <td>{formatBookingTime(booking.bookingTime)}</td>
                    <td
                      className={`status ${
                        booking.status === "COMPLETED"
                          ? "complete"
                          : booking.status.toLowerCase()
                      }`}
                    >
                      {booking.status.toLowerCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
