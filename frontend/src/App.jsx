import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import SecondaryLayout from "./layouts/SecondaryLayout.jsx";
import Admin from "./pages/Admin.jsx";
import Booking from "./pages/Booking.jsx";
import Locations from "./pages/Locations.jsx";
import Users from "./pages/Users.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Public/Main Pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Protected/User Pages */}
        <Route path="/user/profile/" element={<SecondaryLayout />}>
          <Route path=":id" element={<UserProfile />} />
        </Route>

        <Route>
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/locations" element={<Locations />} />
          <Route path="/admin/users" element={<Users />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<h1>403 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
