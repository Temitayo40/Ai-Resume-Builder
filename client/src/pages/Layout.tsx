import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
