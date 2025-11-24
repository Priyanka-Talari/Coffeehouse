import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Logo from "../assets/images/coffeebg.png";
import { FaCoffee, FaUserCircle } from "react-icons/fa";

const Navbar = ({ cart = [] }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    { id: 1, name: "Menu", link: "/" },
    { id: 2, name: "Chat", link: "/chat" },
    { id: 3, name: "Rewards", link: "/rewards" },
  ];

  return (
    <div className="bg-gradient-to-r from-secondary to-secondary/90 shadow-md text-white">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/")}
              className="font-bold text-2xl sm:text-3xl flex items-center gap-2 tracking-wider font-cursive"
            >
              <img src={Logo} alt="Logo" className="w-14" />
              CoffeeHouse
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ul className="flex items-center gap-4">
              {Menu.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => navigate(menu.link)}
                    className="text-xl py-2 px-4 text-white/70 hover:text-white bg-primary/70 rounded-lg hover:scale-105 duration-200"
                  >
                    {menu.name}
                  </button>
                </li>
              ))}

              {user && (
                <li>
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-xl py-2 px-4 bg-primary/70 text-white rounded-lg hover:scale-105 duration-200 flex items-center gap-2"
                  >
                    <FaUserCircle />
                    Profile
                  </button>
                </li>
              )}

              {user && user.email === "admin@example.com" && (
                <li>
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="text-xl py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-800 duration-200"
                  >
                    Admin Dashboard
                  </button>
                </li>
              )}

              <li>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="text-xl py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-800 duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="text-xl py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 duration-200"
                  >
                    Login
                  </button>
                )}
              </li>
            </ul>

            <button
              className="bg-primary/70 hover:scale-105 duration-200 text-white px-4 py-2 rounded-full flex items-center gap-3"
              onClick={() => navigate("/order")}
            >
              Order {cart.length > 0 && `(${cart.length})`}
              <FaCoffee className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;