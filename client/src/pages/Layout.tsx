import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import Login from "./Login";

const Layout = () => {
  const { user, loading } = useSelector((state: any) => state.auth);
  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;
