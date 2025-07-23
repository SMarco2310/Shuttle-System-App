import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
// import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <>
      <div>
        <NavBar />
        <Outlet /> {/* This renders child pages */}
      </div>
    </>
  );
}
