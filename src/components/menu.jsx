import React, { useState } from "react";
import coffee2 from "../assets/images/Coffee2.png";
// Espresso-Based Drinks
import espressoImage from "../assets/images/espresso.jpg";
import americanoImage from "../assets/images/americano.jpg";
import caramelMacchiatoImage from "../assets/images/caramel Macchiato.jpg";
import cortadoImage from "../assets/images/cortado.jpg";
import flatWhiteImage from "../assets/images/flat white.jpg";
import cappuccinoImage from "../assets/images/cappuccino.jpg";
import latteImage from "../assets/images/latte.jpg";
import mochaImage from "../assets/images/cafe mocha.jpg";

// Brewed Coffee
import dripCoffeeImage from "../assets/images/Drip Coffee.jpg";

// Cold Coffee
import icedAmericanoImage from "../assets/images/icedAmericano.jpg";
import icedLatteImage from "../assets/images/icedLatte.jpg";
import icedMochaImage from "../assets/images/icedMocha.jpg";
import nitroColdBrewImage from "../assets/images/nitroColdBrew.jpg";

// Flavored & Specialty
import caramelLatteImage from "../assets/images/caramelLatte.jpg";
import vanillaLatteImage from "../assets/images/vanillaLatte.jpg";
import hazelnutMochaImage from "../assets/images/hazelnutMocha.jpg";
import pumpkinSpiceLatteImage from "../assets/images/pumpkinSpiceLatte.jpg";
import honeyAlmondLatteImage from "../assets/images/honeyAlmondLatte.jpg";
import coconutMochaImage from "../assets/images/coconutMocha.jpg";

// Pastries & Desserts
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

// New Seasonal & Special Items
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
  {
    category: "Espresso-Based Drinks",
    items: [
      { id: 1, name: "Espresso", image: espressoImage, price: 350 },
      { id: 2, name: "Americano", image: americanoImage, price: 300 },
      { id: 3, name: "Caramel Macchiato", image: caramelMacchiatoImage, price: 320 },
      { id: 4, name: "Cortado", image: cortadoImage, price: 340 },
      { id: 5, name: "Flat White", image: flatWhiteImage, price: 360 },
      { id: 6, name: "Cappuccino", image: cappuccinoImage, price: 250 },
      { id: 7, name: "Latte", image: latteImage, price: 450 },
      { id: 8, name: "Mocha", image: mochaImage, price: 400 },
    ],
  },
  {
    category: "Brewed Coffee",
    items: [{ id: 9, name: "Drip Coffee", image: dripCoffeeImage, price: 200 }],
  },
  {
    category: "Cold Coffee",
    items: [
      { id: 10, name: "Iced Americano", image: icedAmericanoImage, price: 280 },
      { id: 11, name: "Iced Latte", image: icedLatteImage, price: 330 },
      { id: 12, name: "Iced Mocha", image: icedMochaImage, price: 370 },
    ],
  },
  {
    category: "Cold Brew",
    items: [{ id: 13, name: "Nitro Cold Brew", image: nitroColdBrewImage, price: 420 }],
  },
  {
    category: "Flavored & Specialty Coffees",
    items: [
      { id: 14, name: "Caramel Latte", image: caramelLatteImage, price: 390 },
      { id: 15, name: "Vanilla Latte", image: vanillaLatteImage, price: 380 },
      { id: 16, name: "Hazelnut Mocha", image: hazelnutMochaImage, price: 410 },
      { id: 17, name: "Pumpkin Spice Latte (Seasonal)", image: pumpkinSpiceLatteImage, price: 430 },
      { id: 18, name: "Honey Almond Latte", image: honeyAlmondLatteImage, price: 400 },
      { id: 19, name: "Coconut Mocha", image: coconutMochaImage, price: 420 },
    ],
  },
  {
    category: "Pastries & Desserts",
    items: [
      { id: 20, name: "Almond Croissant", image: croissantAlmondImage, price: 250 },
      { id: 21, name: "Chocolate Croissant", image: croissantChocolateImage, price: 270 },
      { id: 22, name: "Strawberry Croissant", image: croissantStrawberryImage, price: 260 },
      { id: 23, name: "Vanilla Donut", image: donutVanillaImage, price: 200 },
      { id: 24, name: "Chocolate Sprinkle Donut", image: donutChocolateSprinkleImage, price: 220 },
      { id: 25, name: "M&M Candies Donut", image: donutMMCandiesImage, price: 240 },
      { id: 26, name: "Strawberry Cheesecake", image: cheesecakeStrawberryImage, price: 300 },
      { id: 27, name: "Biscoff Cheesecake", image: cheesecakeBiscoffImage, price: 320 },
      { id: 28, name: "Blueberry Cheesecake", image: cheesecakeBlueberryImage, price: 310 },
      { id: 29, name: "Milk Chocolate Cookie", image: cookieMilkChocolateImage, price: 180 },
      { id: 30, name: "Peanut Butter Cookie", image: cookiePeanutButterImage, price: 190 },
      { id: 31, name: "Double Chocolate Cookie", image: cookieDoubleChocolateImage, price: 200 },
      { id: 32, name: "Chocolate Muffin", image: muffinChocolateImage, price: 220 },
      { id: 33, name: "Vanilla Muffin", image: muffinVanillaImage, price: 210 },
      { id: 34, name: "Blueberry Muffin", image: muffinBlueberryImage, price: 230 },
    ],
  },
  {
    category: "Summer Specials",
    items: [
      { id: 35, name: "Aam Panna Cold Brew", image: aamPannaImage, price: 450 },
      { id: 36, name: "Mango Malai Frappe", image: mangoMalaiImage, price: 480 },
      { id: 37, name: "Lemon Mint Espresso Cooler", image: lemonMintImage, price: 420 },
    ],
  },
  {
    category: "Monsoon Favorites",
    items: [
      { id: 38, name: "Masala Coffee Latte", image: masalaCoffeeImage, price: 380 },
      { id: 39, name: "Jaggery Cappuccino", image: jaggeryCappuccinoImage, price: 360 },
      { id: 40, name: "Filter Kappi", image: filterKappiImage, price: 300 },
    ],
  },
  {
    category: "Winter Warmers",
    items: [
      { id: 41, name: "Dried Fruit Saffron Milk", image: saffronMilkImage, price: 450 },
      { id: 42, name: "Date and Cinnamon Latte", image: dateCinnamonImage, price: 420 },
      { id: 43, name: "Jaggery Almond Hot Chocolate", image: jaggeryAlmondImage, price: 440 },
    ],
  },
  {
    category: "Gluten-Free Pastries",
    items: [
      { id: 44, name: "Almond Flour Brownies", image: almondBrownieImage, price: 280 },
      { id: 45, name: "Rice Flour Waffles", image: riceWaffleImage, price: 320 },
      { id: 46, name: "Chia Seed Pudding", image: chiaPuddingImage, price: 300 },
    ],
  },
  {
    category: "Healthy Options",
    items: [
      { id: 47, name: "Avocado Toast", image: avocadoToastImage, price: 380 },
      { id: 48, name: "Quinoa & Chickpea Salad", image: quinoaSaladImage, price: 350 },
      { id: 49, name: "Energy Bliss Balls", image: blissBallsImage, price: 250 },
    ],
  },
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
    const productWithMilk = { ...product, milkType };
    addToCart(productWithMilk);
    alert('${product.name} with ${milkType} added to cart');
  };

  const handleMilkChange = (productId, milk) => {
    setSelectedMilk(prevState => ({
      ...prevState,
      [productId]: milk
    }));
  };

  return (
    <div className="bg-brandDark text-white">
      <div className="min-h-[550px] sm:min-h-[600px] flex justify-center items-center">
        <div className="container pb-8 sm:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col justify-center gap-6 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1">
              <h1 data-aos="fade-up" data-aos-once="true" className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                We serve the Best{" "}
                <span 
                  data-aos="zoom-out" 
                  data-aos-delay="300" 
                  className="bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/90 font-cursive"
                >
                  Coffee
                </span>{" "}
                in the city
              </h1>
              <div data-aos="fade-up" data-aos-delay="400">
                <button className="bg-gradient-to-r from-primary to-secondary border-2 border-primary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full">
                  Coffee And Code
                </button>
              </div>
            </div>
            <div data-aos="zoom-in" data-aos-duration="300" className="min-h-[450px] flex justify-center items-center relative order-1 sm:order-2">
              <img 
                data-aos-once="true" 
                src={coffee2} 
                alt="Coffee" 
                className="w-[300px] sm:w-[450px] sm:scale-125 mx-auto spin" 
              />
              <div data-aos="fade-left" className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl absolute top-10 left-10">
                <h1 className="text-white">Welcome,</h1>
              </div>
              <div data-aos="fade-right" data-aos-offset="0" className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl absolute bottom-10 right-10">
                <h1 className="text-white">To Coffeehouse!!</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="container mx-auto">
          <h2 className="text-4xl text-center font-bold mb-8">Our Menu</h2>
          {menuCategories.map((category, index) => (
            <div key={index} className="mb-10">
              <h3 className="text-2xl font-bold mb-4">{category.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-40 h-40 object-contain mb-4 rounded-md" 
                    />
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-lg font-semibold mb-2">₹{product.price.toLocaleString()}</p>
                    {drinkCategories.includes(category.category) && (
                      <div className="mb-4">
                        <label className="block mb-2">
                          Select Milk:
                        </label>
                        <select 
                          className="p-2 rounded-lg text-black" 
                          value={selectedMilk[product.id] || "Whole Milk"}
                          onChange={(e) => handleMilkChange(product.id, e.target.value)}
                        >
                          {milkOptions.map((milk, index) => (
                            <option key={index} value={milk}>
                              {milk}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button 
                      onClick={() => handleAddToCart(product)} 
                      className="bg-primary py-2 px-4 rounded-full text-white font-semibold hover:scale-105 transition-transform"
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