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

  const Menu = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Chat", link: "/chat" },
    { id: 3, name: "Rewards", link: "/rewards" },
    

  ];

  return (
    <>
      {/* FIXED: No border, no white line, content won't go under navbar */}
      <nav className="bg-gradient-to-r from-secondary to-secondary/90 text-white fixed top-0 left-0 right-0 w-full z-50 border-0 shadow-lg">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                }}
                className="font-bold text-xl sm:text-2xl flex items-center gap-2 font-cursive"
              >
                <img src={Logo} alt="Logo" className="w-10 sm:w-12" />
                <span className="hidden sm:inline">CoffeeHouse</span>
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-4">
              <ul className="flex items-center gap-3">
                {Menu.map((menu) => (
                  <li key={menu.id}>
                    <button
                      onClick={() => navigate(menu.link)}
                      className="text-base py-2 px-3 text-white/80 hover:text-white 
                      bg-primary/70 rounded-lg hover:scale-105 duration-200"
                    >
                      {menu.name}
                    </button>
                  </li>
                ))}

                {user && (
                  <li>
                    <button
                      onClick={() => navigate("/profile")}
                      className="text-base py-2 px-3 bg-primary/70 text-white 
                      rounded-lg hover:scale-105 duration-200 flex items-center gap-2"
                    >
                      <FaUserCircle />
                      <span className="hidden lg:inline">Profile</span>
                    </button>
                  </li>
                )}

                {user?.email === "admin@example.com" && (
                  <li>
                    <button
                      onClick={() => navigate("/admin-dashboard")}
                      className="text-base py-2 px-3 bg-green-600 text-white 
                      rounded-lg hover:bg-green-700 duration-200"
                    >
                      Admin Dashboard
                    </button>
                  </li>
                )}

                <li>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="text-base py-2 px-3 bg-red-600 text-white 
                      rounded-lg hover:bg-red-700 duration-200"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="text-base py-2 px-3 bg-blue-600 text-white 
                      rounded-lg hover:bg-blue-700 duration-200"
                    >
                      Login
                    </button>
                  )}
                </li>
              </ul>

              {/* Order Button */}
              <button
                className="bg-primary/70 text-white px-3 py-2 rounded-full 
                flex items-center gap-2 hover:scale-105 duration-200"
                onClick={() => navigate("/order")}
              >
                <span className="text-sm md:text-base">Order</span>
                {cart.length > 0 && (
                  <span className="ml-1 text-sm">({cart.length})</span>
                )}
                <FaCoffee className="text-lg" />
              </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="text-2xl p-2"
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="sm:hidden bg-secondary/95 px-4 pb-4 border-t-0">
            <div className="space-y-3">
              {Menu.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => {
                    navigate(menu.link);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-base bg-primary/70 px-4 py-2 rounded-lg"
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
                  className="block w-full text-left bg-primary/70 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaUserCircle />
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
                  if (user) handleLogout();
                  else navigate("/login");
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
                Order {cart.length > 0 && `(${cart.length})`}
                <FaCoffee />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;