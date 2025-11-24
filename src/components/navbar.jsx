import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Logo from "../assets/images/coffeebg.png";
import { FaCoffee, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ cart = [] }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems = [
    { id: 1, name: "Menu", link: "/" },
    { id: 2, name: "Chat", link: "/chat" },
    { id: 3, name: "Rewards", link: "/rewards" },
  ];

  return (
    <div className="bg-gradient-to-r from-secondary to-secondary/90 shadow-md text-white fixed w-full z-50">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <button
            onClick={() => navigate("/")}
            className="font-bold text-2xl flex items-center gap-2 font-cursive"
          >
            <img src={Logo} alt="Logo" className="w-12 sm:w-14" />
            CoffeeHouse
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="sm:hidden text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden sm:flex items-center gap-4">
            <ul className="flex items-center gap-4">
              {menuItems.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => navigate(menu.link)}
                    className="text-lg py-2 px-4 text-white/80 hover:text-white bg-primary/70 rounded-lg hover:scale-105 duration-200"
                  >
                    {menu.name}
                  </button>
                </li>
              ))}

              {user && (
                <li>
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-lg py-2 px-4 bg-primary/70 text-white rounded-lg hover:scale-105 duration-200 flex items-center gap-2"
                  >
                    <FaUserCircle />
                    Profile
                  </button>
                </li>
              )}

              {user?.email === "admin@example.com" && (
                <li>
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="text-lg py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 duration-200"
                  >
                    Admin Dashboard
                  </button>
                </li>
              )}

              <li>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="text-lg py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="text-lg py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 duration-200"
                  >
                    Login
                  </button>
                )}
              </li>
            </ul>

            <button
              className="bg-primary/70 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 duration-200"
              onClick={() => navigate("/order")}
            >
              Order {cart.length > 0 && `(${cart.length})`}
              <FaCoffee className="text-xl" />
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div className="sm:hidden mt-3 space-y-3">
            {menuItems.map((menu) => (
              <button
                key={menu.id}
                onClick={() => {
                  navigate(menu.link);
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-lg bg-primary/70 px-4 py-2 rounded-lg"
              >
                {menu.name}
              </button>
            ))}

            {user && (
              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="block w-full text-left bg-primary/70 px-4 py-2 rounded-lg"
              >
                <FaUserCircle className="inline mr-2" />
                Profile
              </button>
            )}

            {user?.email === "admin@example.com" && (
              <button
                onClick={() => {
                  navigate("/admin-dashboard");
                  setMenuOpen(false);
                }}
                className="block w-full text-left bg-green-600 px-4 py-2 rounded-lg"
              >
                Admin Dashboard
              </button>
            )}

            <button
              onClick={() => {
                user ? handleLogout() : navigate("/login");
                setMenuOpen(false);
              }}
              className="block w-full text-left bg-red-600 px-4 py-2 rounded-lg"
            >
              {user ? "Logout" : "Login"}
            </button>

            <button
              onClick={() => {
                navigate("/order");
                setMenuOpen(false);
              }}
              className="block w-full text-left bg-primary/70 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              Order {cart.length > 0 && `(${cart.length})`} <FaCoffee />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
