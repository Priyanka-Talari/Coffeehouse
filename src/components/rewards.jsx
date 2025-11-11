import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const offers = [
  { category: "Summer Specials", details: "₹40 Off on any Summer Special drink", type: "fixed", amount: 40 },
  { category: "Gluten-Free Pastries", details: "₹30 Off on Almond Flour Brownies with any Coffee", type: "fixed", amount: 30 },
  { category: "Morning Special", details: "Flat ₹50 Off on Mocha & Flat White (7-10 AM)", type: "fixed", amount: 50 },
  { category: "Cold Coffee", details: "₹30 Off on Iced Coffee (2-5 PM)", type: "fixed", amount: 30 },
  { category: "Try a New Flavor", details: "₹20 Off on Vanilla, Hazelnut, and Coconut Mocha", type: "fixed", amount: 20 },
  { category: "Pastry Combo", details: "Buy 1 Coffee + 1 Pastry, get ₹30 Off", type: "fixed", amount: 30 },
  { category: "Cheesecake Deal", details: "Buy any 2 Cheesecakes, get ₹50 Off", type: "fixed", amount: 50 },
];

const Rewards = ({ setActiveDiscount, activeDiscount, cart, setCart }) => {
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  const spinOptions = ["5% OFF", "10% OFF", "15% OFF", "20% OFF", "Better Luck Next Time"];
  const spinValues = [5, 10, 15, 20, null];

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * spinOptions.length);
    const selectedPrize = spinOptions[randomIndex];
    const baseRotation = 360 * 3;
    const stopRotation = baseRotation + randomIndex * (360 / spinOptions.length);

    const wheel = document.getElementById("wheel");
    if (wheel) {
      wheel.style.transition = "transform 3s ease-out";
      wheel.style.transform = `rotate(${stopRotation}deg)`;
    }

    setTimeout(() => {
      if (selectedPrize === "Better Luck Next Time") {
        setActiveDiscount({
          percentage: 0,
          fixedAmount: 0,
          type: "none",
          details: "Better Luck Next Time! 😊",
          appliedOffer: null,
        });
      } else {
        setActiveDiscount({
          percentage: spinValues[randomIndex],
          fixedAmount: 0,
          type: "percentage",
          details: `Wheel Spin Discount: ${selectedPrize}`,
          appliedOffer: null,
        });
      }
      setSpinning(false);
    }, 3000);
  };

  const handleRedeemOffer = (offer) => {
    // Handle fixed discounts
    setActiveDiscount({
      percentage: offer.type === "fixed" ? 0 : null,
      fixedAmount: offer.type === "fixed" ? offer.amount : 0,
      type: offer.type,
      details: offer.details,
      appliedOffer: offer,
    });

    // Navigate to the order page
    navigate("/order");
  };

  return (
    <div className="min-h-screen bg-[#2b1105] text-white py-10 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">🎯 Spin & Win Rewards!</h1>

      {/* Spin Wheel */}
      <div 
        id="wheel"
        className="w-48 h-48 flex items-center justify-center border-4 border-yellow-500 rounded-full shadow-lg text-2xl font-bold bg-yellow-400 text-gray-900"
      >
        {activeDiscount.details ? activeDiscount.details : "🎡 Spin Me!"}
      </div>

      <button 
        className="mt-6 bg-yellow-500 px-6 py-3 rounded-lg hover:scale-105 duration-200 text-gray-900 text-xl font-bold"
        onClick={spinWheel}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      {/* Display Result */}
      {activeDiscount.details && !spinning && (
        <p className={`mt-4 text-xl font-semibold ${activeDiscount.type === "none" ? "text-red-400" : "text-green-400"}`}>
          🎉 {activeDiscount.details}
        </p>
      )}

      <h1 className="text-3xl font-bold mt-10 text-yellow-400">🔥 Coffee Shop Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mt-6">
        {offers.map((offer, index) => (
          <div key={index} className="bg-[#4a1c09] p-6 rounded-lg shadow-lg border border-yellow-500 text-center">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">{offer.category}</h2>
            <p className="text-lg mb-4">{offer.details}</p>
            <button 
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
              onClick={() => handleRedeemOffer(offer)}
            >
              Redeem Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;