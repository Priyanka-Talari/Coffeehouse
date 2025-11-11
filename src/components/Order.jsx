import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";

// Import all images
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

// Menu categories with images and prices
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

const Order = ({ cart, updateCart, activeDiscount, handlePlaceOrder, removeFromCart }) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [address, setAddress] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const exchangeRate = 83.36;

  // Function to get image URL from menuCategories
  const getImageUrl = (item) => {
    if (!item) {
      console.warn("Item is undefined or null");
      return "/images/default-coffee.jpg";
    }

    const menuItem = menuCategories
      .flatMap(category => category.items)
      .find(menuItem => menuItem.name === item.name);

    return menuItem ? menuItem.image : "/images/default-coffee.jpg";
  };

  // Function to get price from menuCategories
  const getItemPrice = (item) => {
    if (!item) return 0;

    const menuItem = menuCategories
      .flatMap(category => category.items)
      .find(menuItem => menuItem.name === item.name);

    return menuItem ? menuItem.price : 0;
  };

  // Handle image error loading
  const handleImageError = (itemName, fallbackSrc) => {
    console.error(`Failed to load image for ${itemName}, using fallback`);
    setImageLoadErrors(prev => ({
      ...prev,
      [itemName]: true
    }));
    return fallbackSrc;
  };

  useEffect(() => {
    const loadCartItems = () => {
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        try {
          const parsedItems = JSON.parse(savedCartItems);
          if (Array.isArray(parsedItems) && parsedItems.length > 0) {
            const fixedItems = parsedItems.map(item => {
              // Ensure each item has a proper image URL
              const imageUrl = getImageUrl(item);
              console.log(`Loading cart item: ${item.name}, image: ${imageUrl}`);
              
              return {
                ...item,
                image: imageUrl,
                price: item.price || getItemPrice(item)
              };
            });
            updateCart(fixedItems);
            setCartItems(fixedItems);
          }
        } catch (error) {
          console.error("Error parsing cart items from localStorage:", error);
        }
      }
    };

    const loadUserAddress = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAddress(userData.address || "");
          }
        } catch (error) {
          console.error("Error loading user address:", error);
        }
      }
    };

    loadCartItems();
    loadUserAddress();
  }, [updateCart]);

  useEffect(() => {
    const loadCartFromFirebase = async () => {
      const user = auth.currentUser;
      if (user && (!cart || cart.length === 0)) {
        try {
          const cartRef = doc(db, "carts", user.uid);
          const cartDoc = await getDoc(cartRef);
          
          if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            if (cartData.items && Array.isArray(cartData.items) && cartData.items.length > 0) {
              const fixedItems = cartData.items.map(item => {
                return {
                  ...item,
                  image: getImageUrl(item),
                  price: item.price || getItemPrice(item)
                };
              });
              updateCart(fixedItems);
              setCartItems(fixedItems);
            }
          }
        } catch (error) {
          console.error("Error loading cart from Firebase:", error);
        }
      }
    };

    loadCartFromFirebase();
  }, [cart, updateCart]);

  useEffect(() => {
    if (activeDiscount.appliedOffer && activeDiscount.appliedOffer.category === "Filter Kappi Bonus") {
      const hasFilterKappi = cart.some((item) => item.name === "Filter Kappi" || item.name.startsWith("Filter Kappi with"));
      const hasFreeCookie = cart.some((item) => item.name === "Free Cookie");

      if (hasFilterKappi && !hasFreeCookie) {
        const newCart = [...cart, { 
          name: "Free Cookie", 
          price: 0, 
          image: "/images/cookie.jpg" 
        }];
        updateCart(newCart);
      }
    }
  }, [activeDiscount, cart, updateCart]);

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    let discount = 0;

    if (activeDiscount.type === "percentage") {
      discount = subtotal * (activeDiscount.percentage / 100);
    } else if (activeDiscount.type === "fixed") {
      discount = activeDiscount.fixedAmount;
    }

    return {
      subtotal,
      discount,
      total: Math.max(subtotal - discount, 0),
    };
  };

  const { subtotal, discount, total } = calculateTotal();

  const handleProceedToPay = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowPaymentOptions(true);
  };

  const validatePaymentDetails = () => {
    if (selectedPaymentMethod === "UPI") {
      if (!paymentId.includes("@")) {
        alert("Please enter a valid UPI ID (e.g., example@upi)");
        return false;
      }
    }

    if (selectedPaymentMethod === "Card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        alert("Please enter a valid 16-digit card number");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert("Please enter expiry date in MM/YY format");
        return false;
      }
      if (!/^\d{3}$/.test(cardCvv)) {
        alert("Please enter a valid 3-digit CVV");
        return false;
      }
    }

    if (!address.trim()) {
      alert("Please enter a shipping address");
      return false;
    }

    return true;
  };

  const saveOrderToUserProfile = async (orderData) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        console.error("No authenticated user found");
        return false;
      }
      
      const ordersCollectionRef = collection(db, "orders");
      const orderRef = await addDoc(ordersCollectionRef, {
        userId: user.uid,
        items: orderData.items.map(item => ({
          name: item.name,
          price: item.price || getItemPrice(item),
          image: getImageUrl(item),
          preferences: item.preferences || {}
        })),
        total: orderData.total,
        date: new Date().toISOString(),
        status: "completed",
        shippingAddress: orderData.address || "",
        paymentMethod: orderData.paymentMethod || "",
        paymentId: orderData.paymentId || ""
      });
      
      const userDocRef = doc(db, "users", user.uid);
      
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const pastOrders = userData.pastOrders || [];
        
        const newOrder = {
          id: orderRef.id,
          items: orderData.items.map(item => ({
            name: item.name,
            price: item.price || getItemPrice(item),
            image: getImageUrl(item),
            preferences: item.preferences || {}
          })),
          total: orderData.total,
          date: new Date().toISOString()
        };
        
        pastOrders.push(newOrder);
        
        await updateDoc(userDocRef, {
          pastOrders: pastOrders
        });
        
        console.log("Order successfully added to user profile");
        return true;
      } else {
        console.error("User document not found");
        return false;
      }
    } catch (error) {
      console.error("Error saving order to user profile:", error);
      return false;
    }
  };

  const clearCart = async () => {
    localStorage.removeItem("cartItems");
    
    const user = auth.currentUser;
    if (user) {
      try {
        const cartRef = doc(db, "carts", user.uid);
        await updateDoc(cartRef, {
          items: [],
          total: 0,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error clearing cart in Firebase:", error);
      }
    }
    
    updateCart([]);
    setCartItems([]);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    if (!validatePaymentDetails()) {
      return;
    }

    const paymentDetails = {
      method: selectedPaymentMethod,
      ...(selectedPaymentMethod === "UPI" && { upiId: paymentId }),
      ...(selectedPaymentMethod === "Card" && {
        cardNumber,
        cardExpiry,
        cardCvv,
      }),
    };

    try {
      await handlePlaceOrder(paymentDetails);
      
      const user = auth.currentUser;
      if (user) {
        const orderData = {
          items: cart,
          total: total,
          address: address,
          paymentMethod: selectedPaymentMethod,
          paymentId: selectedPaymentMethod === "UPI" ? paymentId : "N/A"
        };
        
        await saveOrderToUserProfile(orderData);
      }
      
      setOrderPlaced(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error processing order:", error);
      alert("There was a problem processing your order. Please try again.");
    }
  };

  const handleSuccessModalClose = async () => {
    setShowSuccessModal(false);
    setShowPaymentOptions(false);
    setSelectedPaymentMethod("");
    setPaymentId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    
    await clearCart();
    
    setTimeout(() => {
      setOrderPlaced(false);
    }, 500);
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0;
    }
    return `₹${amount.toFixed(2)}`;
  };

  const handleRemoveFromCart = (itemToRemove) => {
    const updatedCart = cart.filter(item => {
      return !(item.name === itemToRemove.name && item.price === itemToRemove.price);
    });
    
    updateCart(updatedCart);
    
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    
    const user = auth.currentUser;
    if (user) {
      try {
        const cartRef = doc(db, "carts", user.uid);
        updateDoc(cartRef, {
          items: updatedCart,
          total: updatedCart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0),
          updatedAt: new Date().toISOString()
        }).catch(error => {
          console.error("Error updating cart in Firebase:", error);
        });
      } catch (error) {
        console.error("Error accessing Firebase cart:", error);
      }
    }
  };

  // Preload images to ensure they're cached
  useEffect(() => {
    const preloadImages = () => {
      Object.values(menuCategories).forEach(category => {
        category.items.forEach(item => {
          const img = new Image();
          img.src = item.image;
        });
      });
    };
    preloadImages();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gradient-to-r from-stone-100 to-amber-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto border border-brown-300" style={{ borderColor: '#D2B48C' }}>
        <h2 className="text-2xl md:text-3xl font-semibold text-center py-6 font-serif border-b" style={{ color: '#8B4513', borderColor: '#F5DEB3' }}>Your Order Summary</h2>

        {orderPlaced && !showSuccessModal && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4">
            <span className="block sm:inline">Order placed successfully! Thank you for your purchase.</span>
          </div>
        )}

        <div className="p-4 md:p-6">
          {cart.length > 0 ? (
            cart.map((item, index) => {
              const itemName = item.name.split(" (")[0].split(" with ")[0];
              const imageUrl = getImageUrl(item);
              const displayImage = imageLoadErrors[itemName] 
                ? "/images/default-coffee.jpg" 
                : imageUrl;
              
              return (
                <div key={index} className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#F5DEB3' }}>
                  <div className="flex items-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden mr-4 flex items-center justify-center border" style={{ backgroundColor: '#FFF8DC', borderColor: '#D2B48C' }}>
                      <img 
                        src={displayImage} 
                        alt={itemName} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          console.log("Image error for:", itemName, "URL was:", e.target.src);
                          e.target.onerror = null;
                          e.target.src = handleImageError(itemName, "/images/default-coffee.jpg");
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg md:text-xl" style={{ color: '#654321' }}>
                        {item.name}
                      </h3>
                      {item.preferences && (
                        <p className="text-sm text-gray-600">
                          {Object.entries(item.preferences).map(([key, value]) => (
                            <span key={key}>{key}: {value}, </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-bold text-lg md:text-xl mr-4" style={{ color: '#654321' }}>
                      {formatCurrency(item.price || getItemPrice(item))}
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="text-white px-3 py-1 md:px-4 md:py-2 rounded-full transition duration-300 shadow-md"
                      style={{ backgroundColor: '#E74C3C' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C0392B'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E74C3C'}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="text-center text-xl font-medium" style={{ color: '#8B4513' }}>Your cart is empty!</p>
              <p className="text-center text-lg mt-2" style={{ color: '#A0522D' }}>Add some delicious coffee to get started.</p>
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#FAF0E6', borderColor: '#D2B48C' }}>
              <h3 className="text-lg md:text-xl font-semibold text-center mb-4" style={{ color: '#8B4513' }}>Order Details</h3>
              <div className="flex justify-between px-4 py-2 border-b" style={{ borderColor: '#E6CCB2' }}>
                <span className="font-medium" style={{ color: '#8B4513' }}>Subtotal:</span>
                <span className="font-bold" style={{ color: '#654321' }}>
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2 border-b" style={{ borderColor: '#E6CCB2' }}>
                <span className="font-medium text-green-600">Discount Applied:</span>
                <span className="font-bold text-green-600">
                  -{formatCurrency(discount)}
                </span>
              </div>
              <div className="flex justify-between px-4 py-3 text-xl font-bold" style={{ color: '#654321' }}>
                <span>Total:</span>
                <span>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <div className="text-center mt-6 mb-4">
              <button
                onClick={handleProceedToPay}
                className="text-white px-6 py-3 rounded-full transition duration-300 shadow-lg font-medium text-lg"
                style={{ backgroundColor: '#27AE60' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#219653'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27AE60'}
              >
                Proceed to Pay
              </button>
            </div>
          )}
        </div>

        {showPaymentOptions && (
          <div className="mx-4 md:mx-6 mb-6 p-5 rounded-lg border" style={{ backgroundColor: '#FFF8DC', borderColor: '#D2B48C' }}>
            <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: '#8B4513' }}>Choose Your Payment Method</h3>
            
            <div className="mt-4 mb-6">
              <label htmlFor="address" className="block text-left font-medium mb-2" style={{ color: '#A0522D' }}>Shipping Address:</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-3 rounded-lg w-full h-24 text-left focus:outline-none focus:ring-2"
                style={{ borderColor: '#D2B48C', color: '#654321' }}
                placeholder="Enter your complete shipping address"
              />
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              {["COD", "UPI", "Card"].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className="px-6 py-2 md:px-8 md:py-3 rounded-full transition duration-300 shadow-md text-white"
                  style={{ 
                    backgroundColor: selectedPaymentMethod === method ? '#654321' : '#8B4513'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#654321'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = selectedPaymentMethod === method ? '#654321' : '#8B4513'}
                >
                  {method}
                </button>
              ))}
            </div>

            {selectedPaymentMethod === "UPI" && (
              <div className="mt-6 bg-white p-4 rounded-lg border" style={{ borderColor: '#D2B48C' }}>
                <label htmlFor="upiId" className="block font-medium mb-2" style={{ color: '#A0522D' }}>UPI ID:</label>
                <input
                  id="upiId"
                  type="text"
                  placeholder="Enter UPI ID (e.g., example@upi)"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  className="border p-3 rounded-lg w-full text-center focus:outline-none focus:ring-2"
                  style={{ borderColor: '#D2B48C', color: '#654321' }}
                />
              </div>
            )}

            {selectedPaymentMethod === "Card" && (
              <div className="mt-6 bg-white p-4 rounded-lg border" style={{ borderColor: '#D2B48C' }}>
                <h4 className="text-center font-medium mb-4" style={{ color: '#8B4513' }}>Card Details</h4>
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <div>
                    <label htmlFor="cardNumber" className="block font-medium mb-1" style={{ color: '#A0522D' }}>Card Number:</label>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="Card Number (16 digits)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                      className="border p-3 rounded-lg w-full text-center focus:outline-none focus:ring-2"
                      style={{ borderColor: '#D2B48C', color: '#654321' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block font-medium mb-1" style={{ color: '#A0522D' }}>Expiry Date:</label>
                      <input
                        id="cardExpiry"
                        type="text"
                        placeholder="Expiry (MM/YY)"
                        value={cardExpiry}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 2) {
                            setCardExpiry(value);
                          } else if (value.length <= 4) {
                            setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
                          }
                        }}
                        className="border p-3 rounded-lg w-full text-center focus:outline-none focus:ring-2"
                        style={{ borderColor: '#D2B48C', color: '#654321' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="cardCvv" className="block font-medium mb-1" style={{ color: '#A0522D' }}>CVV:</label>
                      <input
                        id="cardCvv"
                        type="password"
                        placeholder="CVV (3 digits)"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        className="border p-3 rounded-lg w-full text-center focus:outline-none focus:ring-2"
                        style={{ borderColor: '#D2B48C', color: '#654321' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={handlePayment}
                className="text-white px-8 py-3 rounded-full transition duration-300 shadow-lg font-medium text-lg"
                style={{ backgroundColor: '#27AE60' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#219653'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27AE60'}
              >
                Pay {formatCurrency(total)}
              </button>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl border-4" style={{ borderColor: '#D2B48C' }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EBFFDC' }}>
                  <svg className="w-10 h-10" style={{ color: '#27AE60' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#8B4513' }}>Order Placed Successfully!</h3>
                <p className="text-lg mb-6" style={{ color: '#A0522D' }}>
                  Thank you for your purchase. Your coffee will be prepared with care and delivered soon!
                </p>
                <p className="text-md mb-6" style={{ color: '#CD853F' }}>
                  Order total: {formatCurrency(total)}
                </p>
                <button
                  onClick={handleSuccessModalClose}
                  className="text-white px-8 py-3 rounded-full transition duration-300 shadow-md font-medium"
                  style={{ backgroundColor: '#27AE60' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#219653'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27AE60'}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;