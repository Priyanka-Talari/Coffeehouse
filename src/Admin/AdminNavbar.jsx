import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/Admin_logo.jpg"; // Ensure the path is correct

const AdminNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-secondary to-secondary/90 shadow-md text-white z-50">
      <div className="container max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Logo & Title */}
        <Link
          to="/admin-dashboard"
          className="font-bold text-2xl sm:text-3xl flex items-center gap-3 tracking-wider font-cursive"
        >
          <img src={Logo} alt="CoffeeHouse Logo" className="w-12 rounded-full" />
          CoffeeHouse Admin
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-5">
          <li>
            <Link
              to="/admin/inventory"
              className="text-lg py-2 px-4 text-white/80 hover:text-white duration-200 bg-primary/80 rounded-lg hover:bg-primary/90 hover:scale-105"
            >
              Inventory
            </Link>
          </li>
          <li>
            <Link
              to="/admin/feedback"
              className="text-lg py-2 px-4 text-white/80 hover:text-white duration-200 bg-primary/80 rounded-lg hover:bg-primary/90 hover:scale-105"
            >
              Feedback
            </Link>
          </li>
          <li>
            <Link
              to="/admin/menu"
              className="text-lg py-2 px-4 text-white/80 hover:text-white duration-200 bg-primary/80 rounded-lg hover:bg-primary/90 hover:scale-105"
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-lg py-2 px-4 text-white/80 hover:text-white duration-200 bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105"
            >
              Login/Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
