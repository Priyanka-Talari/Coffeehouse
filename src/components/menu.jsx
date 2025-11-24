import React, { useState } from "react";
import coffee2 from "../assets/images/Coffee2.png";

// Imports…
import espressoImage from "../assets/images/espresso.jpg";
import americanoImage from "../assets/images/americano.jpg";
import caramelMacchiatoImage from "../assets/images/caramel Macchiato.jpg";
import cortadoImage from "../assets/images/cortado.jpg";
import flatWhiteImage from "../assets/images/flat white.jpg";
import cappuccinoImage from "../assets/images/cappuccino.jpg";
import latteImage from "../assets/images/latte.jpg";
import mochaImage from "../assets/images/cafe mocha.jpg";

import dripCoffeeImage from "../assets/images/Drip Coffee.jpg";

import icedAmericanoImage from "../assets/images/icedAmericano.jpg";
import icedLatteImage from "../assets/images/icedLatte.jpg";
import icedMochaImage from "../assets/images/icedMocha.jpg";
import nitroColdBrewImage from "../assets/images/nitroColdBrew.jpg";

import caramelLatteImage from "../assets/images/caramelLatte.jpg";
import vanillaLatteImage from "../assets/images/vanillaLatte.jpg";
import hazelnutMochaImage from "../assets/images/hazelnutMocha.jpg";
import pumpkinSpiceLatteImage from "../assets/images/pumpkinSpiceLatte.jpg";
import honeyAlmondLatteImage from "../assets/images/honeyAlmondLatte.jpg";
import coconutMochaImage from "../assets/images/coconutMocha.jpg";

import croissantAlmondImage from "../assets/images/almond crossiant.jpg";
import croissantChocolateImage from "../assets/images/chocolate crossiant.jpg";
import croissantStrawberryImage from "../assets/images/strawberry crossiant.jpg";
import donutVanillaImage from "../assets/images/vanilla donut.jpg";
import donutChocolateSprinkleImage from "../assets/images/chocolate sprinkles donut.jpg";
import donutMMCandiesImage from "../assets/images/M&M candies donut.jpg";
import cheesecakeStrawberryImage from "../assets/images/strawberry cheesecake.jpg";
import cheesecakeBiscoffImage from "../assets/images/biscoff cheesecake.jpg";
import cheesecakeBlueberryImage from "../assets/images/blueberry cheesecake.jpg";
import cookieMilkChocolateImage from "../assets/images/milk chocolate cookies.jpg";
import cookiePeanutButterImage from "../assets/images/peanut butter cookies.jpg";
import cookieDoubleChocolateImage from "../assets/images/double chocolate cookies.jpg";
import muffinChocolateImage from "../assets/images/chocolate muffin.jpg";
import muffinVanillaImage from "../assets/images/vanilla muffin.jpg";
import muffinBlueberryImage from "../assets/images/blueberry muffin.jpg";

import aamPannaImage from "../assets/images/Aam Panna Cold Brew.jpg";
import mangoMalaiImage from "../assets/images/Mango Malai Frappe.jpg";
import lemonMintImage from "../assets/images/Lemon Mint Espresso Cooler.jpg";
import masalaCoffeeImage from "../assets/images/Masala Coffee Latte.jpg";
import jaggeryCappuccinoImage from "../assets/images/Jaggery Cappuccino.jpg";
import filterKappiImage from "../assets/images/Filter Kappi.jpg";
import saffronMilkImage from "../assets/images/Dry Fruit Saffron Milk.jpg";
import dateCinnamonImage from "../assets/images/Date and Cinnamon Latte.jpg";
import jaggeryAlmondImage from "../assets/images/Jaggery Almond Hot Chocolate.jpg";
import almondBrownieImage from "../assets/images/Almond Flour Brownies.jpg";
import riceWaffleImage from "../assets/images/Rice Flour Waffle.jpg";
import chiaPuddingImage from "../assets/images/Chia Seed Pudding.jpg";
import avocadoToastImage from "../assets/images/Avocado Toast.jpg";
import quinoaSaladImage from "../assets/images/Quinoa & Chickpea Salad.jpg";
import blissBallsImage from "../assets/images/Energy Bliss Balls.jpg";

const menuCategories = [
  // your existing categories…
];

const milkOptions = ["Whole Milk", "Almond Milk", "Soy Milk", "Oat Milk"];

const drinkCategories = [
  "Espresso-Based Drinks",
  "Brewed Coffee",
  "Cold Coffee",
  "Cold Brew",
  "Flavored & Specialty Coffees",
  "Summer Specials",
  "Monsoon Favorites",
  "Winter Warmers",
];

const Menu = ({ addToCart }) => {
  const [selectedMilk, setSelectedMilk] = useState({});

  const handleAddToCart = (product) => {
    const milkType = selectedMilk[product.id] || "Whole Milk";
    addToCart({ ...product, milkType });
    alert(`${product.name} with ${milkType} added to cart`);
  };

  return (
    <div className="bg-brandDark text-white w-full overflow-x-hidden">

      {/* HERO SECTION */}
      <div className="min-h-[450px] sm:min-h-[550px] lg:min-h-[650px] flex items-center px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* LEFT TEXT */}
          <div className="flex flex-col justify-center gap-6 text-center sm:text-left order-2 sm:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              We serve the Best{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/90 font-cursive">
                Coffee
              </span>{" "}
              in the city
            </h1>

            <button className="bg-gradient-to-r from-primary to-secondary border-2 border-primary hover:scale-105 duration-200 text-white py-2 px-5 rounded-full mx-auto sm:mx-0">
              Coffee And Code
            </button>
          </div>

          {/* HERO IMAGE */}
          <div className="flex justify-center items-center relative order-1 sm:order-2">
            <img
              src={coffee2}
              alt="Coffee"
              className="w-56 sm:w-80 lg:w-[420px] object-contain select-none"
            />

            <div className="bg-gradient-to-r from-primary to-secondary px-3 py-2 rounded-xl absolute top-5 left-5 sm:top-10 sm:left-10">
              <p>Welcome,</p>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary px-3 py-2 rounded-xl absolute bottom-5 right-5 sm:bottom-10 sm:right-10">
              <p>To Coffeehouse!!</p>
            </div>
          </div>
        </div>
      </div>

      {/* MENU SECTION */}
      <div className="py-10 px-4">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl sm:text-4xl text-center font-bold mb-10">
            Our Menu
          </h2>

          {menuCategories.map((category, index) => (
            <div key={index} className="mb-10">
              <h3 className="text-2xl font-bold mb-5">{category.category}</h3>

              {/* GRID FIXED RESPONSIVE */}
              <div className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                gap-6 sm:gap-8">

                {category.items.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-[1.02] transition-transform"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md mb-3"
                    />

                    <h3 className="text-lg sm:text-xl font-bold mb-1">
                      {product.name}
                    </h3>

                    <p className="text-lg font-semibold mb-3">
                      ₹{product.price}
                    </p>

                    {/* MILK DROPDOWN */}
                    {drinkCategories.includes(category.category) && (
                      <select
                        value={selectedMilk[product.id] || "Whole Milk"}
                        onChange={(e) =>
                          setSelectedMilk({ ...selectedMilk, [product.id]: e.target.value })
                        }
                        className="p-2 rounded-lg text-black w-full mb-3"
                      >
                        {milkOptions.map((milk) => (
                          <option key={milk} value={milk}>
                            {milk}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary py-2 px-4 rounded-full text-white font-semibold w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}

              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Menu;
