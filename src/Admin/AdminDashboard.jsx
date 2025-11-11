import React from "react";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import adminImage from "../assets/images/admin_homepage.jpg";

const AdminDashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <AdminNavbar />

      {/* Background Section */}
      <div className="flex-1 relative pt-20">
        {/* Background Image with Zoom Animation */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${adminImage})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Text Content with Animation */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            COFFEEHOUSE ADMIN PANEL
          </h1>
          <p className="text-xl md:text-2xl font-light drop-shadow-md">
          Track. Manage. Grow.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
