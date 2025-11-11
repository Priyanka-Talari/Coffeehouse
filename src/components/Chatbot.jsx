import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backgroundImage = "/src/assets/images/chatbot.jpg";
const botLogo = "/src/assets/images/bot logo.jpg";

const Chatbot = ({ setCart }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to our coffee shop. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [dynamicButtons, setDynamicButtons] = useState([]);
  const [showPredefinedButtons, setShowPredefinedButtons] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isWaitingForCustomFeedback, setIsWaitingForCustomFeedback] = useState(false);
  const [currentRating, setCurrentRating] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRatedOrFeedback, setHasRatedOrFeedback] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Define strictly hot drinks
  const strictlyHotDrinks = [
    "Espresso", "Cortado", "Flat White", "Drip Coffee", "Filter Kappi", 
    "Jaggery Cappuccino", "Masala Coffee Latte", "Dried Fruit Saffron Milk",
    "Date and Cinnamon Latte", "Jaggery Almond Hot Chocolate"
  ];
  
  // Define strictly cold drinks
  const strictlyColdDrinks = [
    "Iced Americano", "Iced Latte", "Iced Mocha", "Nitro Cold Brew",
    "Aam Panna Cold Brew", "Mango Malai Frappe", "Lemon Mint Espresso Cooler"
  ];
  
  // Define drinks that require only hot/cold preference (no milk selection)
  const hotColdOnlyDrinks = [
    "Americano", "Mocha", "Caramel Macchiato", "Flat White"
  ];
  
  // Define drinks that require both hot/cold preference and milk type
  const hotColdAndMilkDrinks = [
    "Latte", "Caramel Latte", "Vanilla Latte", "Hazelnut Mocha", 
    "Honey Almond Latte", "Coconut Mocha", "Pumpkin Spice Latte"
  ];

  const predefinedQuestions = [
    { text: "Opening Hours", value: "hours" },
    { text: "Bestsellers", value: "bestsellers" },
    { text: "View Menu", value: "menu" },
    { text: "Place Order", value: "place order" },
    { text: "Give Feedback", value: "feedback" }
  ];

  const imageMapping = {
    // Coffee images
    Espresso: "/src/assets/images/espresso.jpg",
    Americano: "/src/assets/images/americano.jpg",
    "Caramel Macchiato": "/src/assets/images/caramel-macchiato.jpg",
    Cortado: "/src/assets/images/cortado.jpg",
    "Flat White": "/src/assets/images/flat-white.jpg",
    Cappuccino: "/src/assets/images/cappuccino.jpg",
    Latte: "/src/assets/images/latte.jpg",
    Mocha: "/src/assets/images/mocha.jpg",
    "Drip Coffee": "/src/assets/images/drip-coffee.jpg",
    "Iced Americano": "/src/assets/images/iced-americano.jpg",
    "Iced Latte": "/src/assets/images/iced-latte.jpg",
    "Iced Mocha": "/src/assets/images/iced-mocha.jpg",
    "Cold Brew": "/src/assets/images/cold-brew.jpg",
    "Nitro Cold Brew": "/src/assets/images/nitro-cold-brew.jpg",
    "Caramel Latte": "/src/assets/images/caramel-latte.jpg",
    "Vanilla Latte": "/src/assets/images/vanilla-latte.jpg",
    "Hazelnut Mocha": "/src/assets/images/hazelnut-mocha.jpg",
    "Pumpkin Spice Latte": "/src/assets/images/pumpkin-spice-latte.jpg",
    "Honey Almond Latte": "/src/assets/images/honey-almond-latte.jpg",
    "Coconut Mocha": "/src/assets/images/coconut-mocha.jpg",
    "Aam Panna Cold Brew": "/src/assets/images/aam-panna-cold-brew.jpg",
    "Mango Malai Frappe": "/src/assets/images/mango-malai-frappe.jpg",
    "Lemon Mint Espresso Cooler": "/src/assets/images/lemon-mint-espresso-cooler.jpg",
    "Masala Coffee Latte": "/src/assets/images/masala-coffee-latte.jpg",
    "Jaggery Cappuccino": "/src/assets/images/jaggery-cappuccino.jpg",
    "Filter Kappi": "/src/assets/images/filter-kappi.jpg",
    "Dried Fruit Saffron Milk": "/src/assets/images/dried-fruit-saffron-milk.jpg",
    "Date and Cinnamon Latte": "/src/assets/images/date-cinnamon-latte.jpg",
    "Jaggery Almond Hot Chocolate": "/src/assets/images/jaggery-almond-hot-chocolate.jpg",
    
    // Pastry images
    "Almond Croissant": "/src/assets/images/almond-croissant.jpg",
    "Chocolate Croissant": "/src/assets/images/chocolate-croissant.jpg",
    "Strawberry Croissant": "/src/assets/images/strawberry-croissant.jpg",
    "Strawberry Cheesecake": "/src/assets/images/strawberry-cheesecake.jpg",
    "Biscoff Cheesecake": "/src/assets/images/biscoff-cheesecake.jpg",
    "Blueberry Cheesecake": "/src/assets/images/blueberry-cheesecake.jpg",
    "Milk Chocolate Cookie": "/src/assets/images/milk-chocolate-cookie.jpg",
    "Peanut Butter Cookie": "/src/assets/images/peanut-butter-cookie.jpg",
    "Double Chocolate Cookie": "/src/assets/images/double-chocolate-cookie.jpg",
    "Chocolate Muffin": "/src/assets/images/chocolate-muffin.jpg",
    "Vanilla Muffin": "/src/assets/images/vanilla-muffin.jpg",
    "Blueberry Muffin": "/src/assets/images/blueberry-muffin.jpg",
    "Vanilla Donut": "/src/assets/images/vanilla-donut.jpg",
    "Chocolate Sprinkle Donut": "/src/assets/images/chocolate-sprinkle-donut.jpg",
    "M&M Candies Donut": "/src/assets/images/mm-candies-donut.jpg",
    "Avocado Toast": "/src/assets/images/avocado-toast.jpg",
    "Quinoa & Chickpea Salad": "/src/assets/images/quinoa-chickpea-salad.jpg",
    "Energy Bliss Balls": "/src/assets/images/energy-bliss-balls.jpg",
    "Almond Flour Brownies": "/src/assets/images/almond-flour-brownies.jpg",
    "Rice Flour Waffles": "/src/assets/images/rice-flour-waffles.jpg",
    "Chia Seed Pudding": "/src/assets/images/chia-seed-pudding.jpg"
  };

  const defaultCoffeeImage = "/src/assets/images/coffee-default.jpg";
  const defaultPastryImage = "/src/assets/images/pastry-default.jpg";

  // State to track the current coffee selection process
  const [currentCoffeeSelection, setCurrentCoffeeSelection] = useState({
    name: "",
    needsTemperature: false,
    needsMilk: false,
    temperature: "",
    milk: "",
    size: "",
    sugar: ""
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCoffeeSelection = (coffeeName) => {
    // Reset the current coffee selection
    const selection = {
      name: coffeeName,
      needsTemperature: false,
      needsMilk: false,
      temperature: "",
      milk: "",
      size: "",
      sugar: ""
    };
    
    // Determine if we need to ask about temperature and milk based on coffee type
    if (strictlyHotDrinks.includes(coffeeName)) {
      // For strictly hot drinks, automatically set temperature and continue
      selection.temperature = "Hot";
      selection.needsTemperature = false;
      selection.needsMilk = false;
    } else if (strictlyColdDrinks.includes(coffeeName)) {
      // For strictly cold drinks, automatically set temperature and continue
      selection.temperature = "Cold";
      selection.needsTemperature = false;
      selection.needsMilk = false;
    } else if (hotColdOnlyDrinks.includes(coffeeName)) {
      // For drinks that need only temperature preference
      selection.needsTemperature = true;
      selection.needsMilk = false;
    } else if (hotColdAndMilkDrinks.includes(coffeeName)) {
      // For drinks that need both temperature and milk preferences
      selection.needsTemperature = true;
      selection.needsMilk = true;
    }
    
    setCurrentCoffeeSelection(selection);
    
    // Display the selection in the chat
    const userMessage = { text: coffeeName, isBot: false };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // If we need to ask about temperature, prompt the user
    if (selection.needsTemperature) {
      const temperatureMessage = { text: `Would you like your ${coffeeName} hot or cold?`, isBot: true };
      setMessages(prevMessages => [...prevMessages, temperatureMessage]);
      setDynamicButtons(["Hot", "Cold"]);
      setShowPredefinedButtons(false);
    } else {
      // Otherwise, proceed with the complete coffee details
      completeCoffeeOrder(selection);
    }
  };

  const handleTemperatureSelection = (temperature) => {
    const updatedSelection = {...currentCoffeeSelection, temperature};
    setCurrentCoffeeSelection(updatedSelection);
    
    // Display the selection in the chat
    const userMessage = { text: temperature, isBot: false };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // If we need to ask about milk, prompt the user
    if (updatedSelection.needsMilk) {
      const milkMessage = { text: "Which milk type would you prefer? (Regular, Skim, Almond, Oat, Soy)", isBot: true };
      setMessages(prevMessages => [...prevMessages, milkMessage]);
      setDynamicButtons(["Regular", "Skim", "Almond", "Oat", "Soy"]);
    } else {
      // Otherwise, proceed with the complete coffee details
      completeCoffeeOrder(updatedSelection);
    }
  };

  const handleMilkSelection = (milk) => {
    const updatedSelection = {...currentCoffeeSelection, milk};
    
    // Display the selection in the chat
    const userMessage = { text: milk, isBot: false };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Proceed with the complete coffee details
    completeCoffeeOrder(updatedSelection);
  };

  const completeCoffeeOrder = async (coffeeSelection) => {
    // Format the order details to send to the API
    const orderDetails = `${coffeeSelection.name} (${coffeeSelection.temperature || "Regular"})`;
    
    // Show loading message
    const loadingMessage = { text: "Processing your coffee selection...", isBot: true };
    setMessages(prevMessages => [...prevMessages, loadingMessage]);
    setDynamicButtons([]);
    
    try {
      // Send the complete order to the API
      const response = await axios.post("http://localhost:8000/api/chat", {
        message: orderDetails,
      });
      
      // Handle the API response (replace loading message)
      setMessages(prevMessages => 
        prevMessages.slice(0, prevMessages.length - 1).concat({ 
          text: response.data.response, 
          isBot: true 
        })
      );
      
      // Handle buttons from API
      if (response.data.buttons?.length > 0) {
        setDynamicButtons(response.data.buttons);
        setShowPredefinedButtons(false);
      } else {
        setDynamicButtons([]);
        setShowPredefinedButtons(true);
      }
      
      // Extract order details if present
      const orderPattern = /Order Summary:/i;
      if (response.data.response && orderPattern.test(response.data.response)) {
        const orderDetails = extractOrderDetails(response.data.response);
        if (orderDetails) {
          setCurrentOrder(orderDetails);
          
          // If this includes "Thank you for your order", prompt for rating
          if (response.data.response.includes("Thank you for your order!")) {
            setCart(orderDetails);
            
            const thankYouMessage = { 
              text: "Your order has been prepared! Please rate your experience before checkout.", 
              isBot: true,
            };
            
            setTimeout(() => {
              setMessages(prev => [...prev, thankYouMessage]);
              setDynamicButtons(["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]);
              setShowPredefinedButtons(false);
            }, 1000);
          }
        }
      }
    } catch (error) {
      console.error("Server Error:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Sorry, I couldn't connect to the server. Please check your connection and try again.", isBot: true }
      ]);
      setDynamicButtons([]);
      setShowPredefinedButtons(true);
    }
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isProcessing) return;
    
    setIsProcessing(true);

    // Check if this is custom feedback
    if (isWaitingForCustomFeedback) {
      const userMessage = { text: messageText, isBot: false };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput("");
      setIsWaitingForCustomFeedback(false);
      
      try {
        await axios.post("http://localhost:8000/api/feedback", {
          user_id: "default_user",
          feedback: messageText,
          rating: currentRating
        });
        
        const negativePhrases = ["poor", "bad", "worst", "terrible", "improvement", "average"];
        const isNegativeFeedback = negativePhrases.some(phrase => messageText.toLowerCase().includes(phrase));
        
        const responseMessage = isNegativeFeedback 
          ? "We apologize for the inconvenience. We'll work hard to improve our service. Thank you for your feedback! ☕"
          : "Thank you for your positive feedback! We appreciate it! ☕";
        
        setMessages(prevMessages => [...prevMessages, { text: responseMessage, isBot: true }]);
        setHasRatedOrFeedback(true);
        
        if (currentOrder && currentOrder.length > 0) {
          const promptMessage = { 
            text: "Would you like to proceed to checkout?", 
            isBot: true 
          };
          
          setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, promptMessage]);
            setDynamicButtons(["Proceed to Checkout", "Cancel"]);
            setShowPredefinedButtons(false);
          }, 1000);
        } else {
          setDynamicButtons([]);
          setShowPredefinedButtons(true);
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "Sorry, I couldn't submit your feedback. Please try again later.", isBot: true }
        ]);
      } finally {
        setIsProcessing(false);
      }
      
      return;
    }

    // Check if this is a coffee selection
    const isCoffeeSelection = [...strictlyHotDrinks, ...strictlyColdDrinks, ...hotColdOnlyDrinks, ...hotColdAndMilkDrinks].includes(messageText);
    
    if (isCoffeeSelection) {
      handleCoffeeSelection(messageText);
      setInput("");
      setIsProcessing(false);
      return;
    }
    
    // Check if this is a temperature selection for the current coffee
    if (currentCoffeeSelection.name && currentCoffeeSelection.needsTemperature && ["Hot", "Cold"].includes(messageText)) {
      handleTemperatureSelection(messageText);
      setInput("");
      setIsProcessing(false);
      return;
    }
    
    // Check if this is a milk selection for the current coffee
    if (currentCoffeeSelection.name && currentCoffeeSelection.needsMilk && currentCoffeeSelection.temperature && ["Regular", "Skim", "Almond", "Oat", "Soy"].includes(messageText)) {
      handleMilkSelection(messageText);
      setInput("");
      setIsProcessing(false);
      return;
    }

    // For predefined buttons, map the displayed text to the API value
    const matchedPredefined = predefinedQuestions.find(q => q.text === messageText);
    const apiMessage = matchedPredefined ? matchedPredefined.value : messageText;

    // Show user message in the chat
    const userMessage = { text: messageText, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    // Special case for Place Order button
    if (messageText === "Place Order") {
      // Add loading message
      const loadingMessage = { text: "Processing your order request...", isBot: true };
      setMessages((prevMessages) => [...prevMessages, loadingMessage]);
    }

    try {
      // Normal flow for other messages
      const response = await axios.post("http://localhost:8000/api/chat", {
        message: apiMessage,
      });
      handleApiResponse(response, messageText);
    } catch (error) {
      console.error("Server Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, I couldn't connect to the server. Please check your connection and try again.", isBot: true },
      ]);
      setIsProcessing(false);
    }
  };

  const handleApiResponse = (response, messageText) => {
    if (response.data.response) {
      // If Place Order, replace the loading message
      if (messageText === "Place Order") {
        setMessages((prevMessages) => 
          prevMessages.slice(0, prevMessages.length - 1).concat({ 
            text: response.data.response, 
            isBot: true 
          })
        );
      } else {
        // Normal response
        const botMessage = { text: response.data.response, isBot: true };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    }

    // Handle dynamic buttons
    if (response.data.buttons?.length > 0) {
      setDynamicButtons(response.data.buttons);
      setShowPredefinedButtons(false);
    } else {
      setDynamicButtons([]);
      setShowPredefinedButtons(true);
    }

    // Check for order summary in response
    const orderPattern = /Order Summary:/i;
    if (response.data.response && orderPattern.test(response.data.response)) {
      const orderDetails = extractOrderDetails(response.data.response);
      if (orderDetails) {
        setCurrentOrder(orderDetails);
        
        if (response.data.response.includes("Thank you for your order!")) {
          // Final confirmation, add rating prompt
          setCart(orderDetails);
          
          const thankYouMessage = { 
            text: "Your order has been prepared! Please rate your experience before checkout.", 
            isBot: true,
          };
          
          setTimeout(() => {
            setMessages((prev) => [...prev, thankYouMessage]);
            setDynamicButtons(["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]);
            setShowPredefinedButtons(false);
          }, 1000);
        }
      }
    }

    if (messageText === "Proceed to Checkout" && currentOrder) {
      if (hasRatedOrFeedback) {
        navigate('/order', { 
          state: { 
            cart: currentOrder
          } 
        });
      } else {
        const botMessage = { 
          text: "Please rate your experience or provide feedback before proceeding to checkout.", 
          isBot: true 
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setDynamicButtons(["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]);
      }
    }
    
    // Handle Place New Order button
    if (messageText === "Place New Order") {
      // Reset checkout flow
      setHasRatedOrFeedback(false);
      setCurrentOrder(null);
      setCurrentCoffeeSelection({
        name: "",
        needsTemperature: false,
        needsMilk: false,
        temperature: "",
        milk: "",
        size: "",
        sugar: ""
      });
      
      // This needs to send "place order" to the backend to match the backend route
      setTimeout(() => {
        sendMessage("Place Order");
      }, 500);
    }
    
    setIsProcessing(false);
  };

  const extractOrderDetails = (responseText) => {
    // Enhanced regex to handle different formats
    const coffeeMatch = responseText.match(/- (.+?) \((.+?)(, (.*?))?\)/);
    const sizeMatch = responseText.match(/- Size: (.*?)(?:\n|$)/);
    const milkMatch = responseText.match(/- Milk: (.*?)(?:\n|$)/);
    const sideItemMatch = responseText.match(/- Side Item: (.*?)(?:\n|$)/);
    
    const totalPriceMatch = responseText.match(/- Total Price: ₹(\d+)/);
    const priceSingleMatch = responseText.match(/- Price: ₹(\d+)/);
    const priceMatch = totalPriceMatch || priceSingleMatch;
    
    let sideItemPrice = 0;
    if (sideItemMatch) {
      const sideItemName = sideItemMatch[1];
      
      if (totalPriceMatch && priceSingleMatch) {
        sideItemPrice = parseInt(totalPriceMatch[1]) - parseInt(priceSingleMatch[1]);
      } else if (totalPriceMatch) {
        // Estimate side item price
        sideItemPrice = Math.round(parseInt(totalPriceMatch[1]) * 0.3); // Assume side item is about 30% of total
      }
    }
    
    if (coffeeMatch && priceMatch) {
      const coffeeName = coffeeMatch[1];
      const temperature = coffeeMatch[2] || "";
      const sugar = coffeeMatch[4] || "";
      const size = sizeMatch ? sizeMatch[1] : "Medium";
      
      // Only include milk if it's applicable and specified
      const milk = milkMatch ? milkMatch[1] : 
                  (strictlyHotDrinks.includes(coffeeName) || 
                   strictlyColdDrinks.includes(coffeeName)) ? null : "Regular";
      
      const price = parseInt(priceMatch[1]);
      
      const specs = {};
      if (temperature) specs.Temperature = temperature;
      if (sugar) specs.Sugar = sugar;
      if (size) specs.Size = size;
      if (milk) specs.Milk = milk;
      
      const orderItems = [
        {
          name: coffeeName,
          specifications: specs,
          price: sideItemMatch ? (price - sideItemPrice) : price,
          quantity: 1,
          image: imageMapping[coffeeName] || defaultCoffeeImage
        }
      ];
      
      if (sideItemMatch) {
        const sideItemName = sideItemMatch[1];
        orderItems.push({
          name: sideItemName,
          price: sideItemPrice,
          quantity: 1,
          image: imageMapping[sideItemName] || defaultPastryImage
        });
      }
      
      return orderItems;
    }
    
    return null;
  };

  const handleButtonClick = async (buttonText) => {
    if (isProcessing) return;
    
    // Handle coffee selection
    const isCoffeeSelection = [...strictlyHotDrinks, ...strictlyColdDrinks, ...hotColdOnlyDrinks, ...hotColdAndMilkDrinks].includes(buttonText);
    if (isCoffeeSelection) {
      handleCoffeeSelection(buttonText);
      return;
    }
    
    // Handle temperature selection for current coffee
    if (currentCoffeeSelection.name && currentCoffeeSelection.needsTemperature && ["Hot", "Cold"].includes(buttonText)) {
      handleTemperatureSelection(buttonText);
      return;
    }
    
    // Handle milk selection for current coffee
    if (currentCoffeeSelection.name && currentCoffeeSelection.needsMilk && currentCoffeeSelection.temperature && ["Regular", "Skim", "Almond", "Oat", "Soy"].includes(buttonText)) {
      handleMilkSelection(buttonText);
      return;
    }
    
    if (buttonText === "Proceed to Checkout" && currentOrder) {
      if (!hasRatedOrFeedback) {
        const botMessage = { 
          text: "Please rate your experience or provide feedback before proceeding to checkout.", 
          isBot: true 
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setDynamicButtons(["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]);
        return;
      }
      
      setCart(currentOrder);
      
      navigate('/order', { 
        state: { 
          cart: currentOrder
        } 
      });
      return;
    }
    
    if (buttonText === "Cancel") {
      setCurrentOrder(null);
      setDynamicButtons([]);
      setShowPredefinedButtons(true);
      setHasRatedOrFeedback(false);
      setCurrentCoffeeSelection({
        name: "",
        needsTemperature: false,
        needsMilk: false,
        temperature: "",
        milk: "",
        size: "",
        sugar: ""
      });
      const botMessage = { text: "Order canceled. Is there anything else I can help you with?", isBot: true };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      return;
    }
    
    if (buttonText === "Rate Experience") {
      const ratingMessage = { text: "Please rate your experience:", isBot: true };
      setMessages(prevMessages => [...prevMessages, ratingMessage]);
      setDynamicButtons(["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]);
      return;
    }
    
    if (buttonText === "Give Feedback") {
      if (!currentRating) {
        const ratingFirstMessage = { text: "Please rate your experience first:", isBot: true };
        setMessages(prevMessages => [...prevMessages, ratingFirstMessage]);
        setDynamicButtons(["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]);
        return;
      }
      
      const feedbackMessage = { text: "Please choose feedback type or provide custom feedback:", isBot: true };
      setMessages(prevMessages => [...prevMessages, feedbackMessage]);
      setDynamicButtons([
        "Excellent service!",
        "Good coffee but slow service",
        "Average experience",
        "Need improvement",
        "Poor service",
        "Custom Feedback"
      ]);
      return;
    }
    
    // Match button text to predefined question values
    const matchedQuestion = predefinedQuestions.find(q => q.text === buttonText);
    if (matchedQuestion) {
      // Pass the original button text to display in chat, but use the value for API
      sendMessage(buttonText);
      return;
    }

    if (["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"].includes(buttonText)) {
      setIsProcessing(true);
      setCurrentRating(buttonText);
      const userMessage = { text: buttonText, isBot: false };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      try {
        await axios.post("http://localhost:8000/api/feedback", {
          user_id: "default_user",
          feedback: "",
          rating: buttonText
        });
        
        const botResponse = { text: "Thank you for your rating! Would you like to provide additional feedback?", isBot: true };
        setMessages(prevMessages => [...prevMessages, botResponse]);
        setHasRatedOrFeedback(true);
        
        if (currentOrder && currentOrder.length > 0) {
          setTimeout(() => {
            const promptMessage = { 
              text: "Would you like to provide feedback or proceed to checkout?", 
              isBot: true 
            };
            setMessages(prevMessages => [...prevMessages, promptMessage]);
            setDynamicButtons(["Give Feedback", "Proceed to Checkout", "Cancel"]);
          }, 1000);
        } else {
          setDynamicButtons(["Give Feedback"]);
          setShowPredefinedButtons(false);
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "Sorry, I couldn't submit your rating. Please try again later.", isBot: true }
        ]);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    const feedbackOptions = [
      "Excellent service!",
      "Good coffee but slow service",
      "Average experience",
      "Need improvement",
      "Poor service",
      "Custom Feedback"
    ];
    
    if (feedbackOptions.includes(buttonText)) {
      setIsProcessing(true);
      const userMessage = { text: buttonText, isBot: false };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      if (buttonText === "Custom Feedback") {
        setIsWaitingForCustomFeedback(true);
        const botResponse = { text: "Please type your feedback:", isBot: true };
        setMessages(prevMessages => [...prevMessages, botResponse]);
        setDynamicButtons([]);
        setIsProcessing(false);
        return;
      } else {
        try {
          await axios.post("http://localhost:8000/api/feedback", {
            user_id: "default_user",
            feedback: buttonText,
            rating: currentRating
          });
          
          const negativePhrases = ["poor", "need improvement", "average"];
          const isNegativeFeedback = negativePhrases.some(phrase => buttonText.toLowerCase().includes(phrase));
          
          const responseText = isNegativeFeedback 
            ? "We apologize for the inconvenience. We'll work hard to improve our service. Thank you for your feedback! ☕"
            : "Thank you for your positive feedback! We appreciate it! ☕";
          
          const botResponse = { text: responseText, isBot: true };
          setMessages(prevMessages => [...prevMessages, botResponse]);
          setHasRatedOrFeedback(true);
          
          if (currentOrder && currentOrder.length > 0) {
            setTimeout(() => {
              const promptMessage = { 
                text: "Would you like to proceed to checkout now?", 
                isBot: true 
              };
              setMessages(prevMessages => [...prevMessages, promptMessage]);
              setDynamicButtons(["Proceed to Checkout", "Cancel"]);
            }, 1000);
          } else {
            setDynamicButtons([]);
            setShowPredefinedButtons(true);
          }
        } catch (error) {
          console.error("Error submitting feedback:", error);
          setMessages(prevMessages => [
            ...prevMessages,
            { text: "Sorry, I couldn't submit your feedback. Please try again later.", isBot: true }
          ]);
        } finally {
          setIsProcessing(false);
        }
        return;
      }
    }

    // For coffee selection, check if it's a strictly hot or cold drink
    if (strictlyHotDrinks.includes(buttonText) || strictlyColdDrinks.includes(buttonText)) {
      sendMessage(buttonText);
      return;
    }

    sendMessage(buttonText);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
        <div className="flex items-center p-4 bg-[#5B1E1A] text-white rounded-t-lg">
          <img src={botLogo} alt="Bot Logo" className="w-10 h-10 rounded-full mr-4" />
          <div>
            <h2 className="text-2xl font-bold">CoffeeHouse Chatbot</h2>
            <p className="text-sm opacity-90">Ask me about coffee!</p>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-6 bg-[#f9f3e8]">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
              {msg.isBot && <img src={botLogo} alt="Bot" className="w-8 h-8 rounded-full mr-2" />}
              <div
                className={`px-4 py-2 rounded-lg ${msg.isBot ? "bg-[#815f4b] text-white" : "bg-[#a68b6d] text-white"}`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-[#f7e6d5] p-4">
          {/* Predefined buttons - display in two columns */}
          {showPredefinedButtons && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(question.text)}
                  className={`py-2 px-4 rounded-lg bg-[#5B1E1A] text-white hover:bg-[#4a1815] transition-colors ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isProcessing}
                >
                  {question.text}
                </button>
              ))}
            </div>
          )}
          
          {/* Dynamic buttons - display in two columns */}
          {dynamicButtons.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {dynamicButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(button)}
                  className={`py-2 px-4 rounded-lg bg-[#5B1E1A] text-white hover:bg-[#4a1815] transition-colors ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isProcessing}
                >
                  {button}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center p-4 border-t border-[#d9cbb5]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isProcessing && sendMessage()}
            placeholder="Type your message..."
            className={`flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none ${
              isProcessing ? 'bg-gray-100' : ''
            }`}
            disabled={isProcessing}
          />
          <button
            onClick={() => sendMessage()}
            className={`ml-2 py-2 px-4 bg-[#5B1E1A] text-white rounded-lg hover:bg-[#4a1815] transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;