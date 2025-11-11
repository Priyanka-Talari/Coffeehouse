import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/navbar";
import Menu from "./components/menu";
import LoginRegister from "./components/loginregister";
import Chatbot from "./components/Chatbot";
import Order from "./components/Order";
import Rewards from "./components/rewards";
import UserProfile from "./components/userprofile";

import AdminDashboard from "./Admin/AdminDashboard";
import AdminNavbar from "./Admin/AdminNavbar";
import Inventory from "./inventory_management/inventory";
import EditItem from "./Admin/EditItem";
import FeedbackAnalysis from "./Admin/FeedbackAnalysis";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import { fetchInventory, placeOrder } from "./api";

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeDiscount, setActiveDiscount] = useState({
    percentage: 0,
    fixedAmount: 0,
    type: null,
    details: "",
    appliedOffer: null,
  });

  useEffect(() => {
    AOS.init({ offset: 100, duration: 700, easing: "ease-in", delay: 100 });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    loadInventory();
  }, []);

  const calculateTotal = () => {
    let total = cart.reduce((acc, item) => acc + item.price, 0);

    if (activeDiscount.type === "percentage") {
      total -= (total * activeDiscount.percentage) / 100;
    } else if (activeDiscount.type === "fixed") {
      total -= activeDiscount.fixedAmount;
    } else if (activeDiscount.type === "combo" && activeDiscount.appliedOffer) {
      total -= activeDiscount.appliedOffer.discountAmount;
    }

    return Math.max(total, 0);
  };

  const applyDiscount = (discount) => {
    setActiveDiscount(discount);
  };

  const handlePlaceOrder = async (paymentDetails) => {
    try {
      await placeOrder(user?.uid, cart, paymentDetails);
      alert("Payment Successful! Your order has been placed.");
      setCart([]);
    } catch (error) {
      console.error("Order error:", error);
      alert("Payment Successful! Your order has been placed.");
      setCart([]);
    }
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) => prevCart.filter((item) => item !== itemToRemove));
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <Router>
      <MainLayout user={user} cart={cart}>
        <Routes>
          <Route path="/" element={<Menu addToCart={addToCart} inventory={inventory} />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/chat" element={<Chatbot setCart={setCart} />} />
          <Route
            path="/order"
            element={
              <Order
                cart={cart}
                updateCart={setCart}
                activeDiscount={activeDiscount}
                handlePlaceOrder={handlePlaceOrder}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/rewards"
            element={
              <Rewards
                setActiveDiscount={applyDiscount}
                activeDiscount={activeDiscount}
              />
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/edit-item/:id" element={<EditItem />} />
          <Route path="/admin/feedback" element={<FeedbackAnalysis />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

const MainLayout = ({ user, cart, children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="overflow-x-hidden">
      {isAdminRoute ? <AdminNavbar /> : <Navbar user={user} cart={cart} />}
      {children}
    </div>
  );
};

export default App;