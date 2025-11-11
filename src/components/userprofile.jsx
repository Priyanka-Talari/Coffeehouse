import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    address: "",
    pastOrders: [],
  });
  const [addressInput, setAddressInput] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [reorderSuccess, setReorderSuccess] = useState(false);
  const navigate = useNavigate();

  // Define coffee product details with prices directly in INR
  const coffeeProducts = {
    "Filter Kappi": { price: 332.60, image: "/images/filter-kappi.jpg" }, // 3.99 USD * 83.36
    "Espresso": { price: 249.25, image: "/images/espresso.jpg" }, // 2.99 USD * 83.36
    "Cappuccino": { price: 374.29, image: "/images/cappuccino.jpg" }, // 4.49 USD * 83.36
    "Latte": { price: 415.96, image: "/images/latte.jpg" }, // 4.99 USD * 83.36
    "Americano": { price: 290.93, image: "/images/americano.jpg" }, // 3.49 USD * 83.36
    "Mocha": { price: 457.65, image: "/images/mocha.jpg" }, // 5.49 USD * 83.36
    "Free Cookie": { price: 0, image: "/images/cookie.jpg" },
    "Flat White": { price: 304.26, image: "/images/flat-white.jpg" } // 3.65 USD * 83.36
  };

  // Fetch user data from Firebase Auth and Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Fetch user details from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserDetails(userData);
            setAddressInput(userData.address || "");
          } else {
            // Create a new user document if it doesn't exist
            const newUserData = {
              fullName: currentUser.displayName || "",
              email: currentUser.email,
              address: "",
              pastOrders: [],
              createdAt: new Date().toISOString()
            };
            
            await setDoc(userDocRef, newUserData);
            setUserDetails(newUserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate("/login"); // Redirect to login if user is not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle address update
  const handleSaveAddress = async () => {
    if (user) {
      try {
        setUpdateError("");
        setUpdateSuccess(false);
        
        await updateDoc(doc(db, "users", user.uid), {
          address: addressInput,
        });
        
        setUserDetails((prev) => ({ ...prev, address: addressInput }));
        setUpdateSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("Error updating address:", error);
        setUpdateError("Failed to update address. Please try again.");
      }
    }
  };

  // Handle reordering (adding to cart)
  const handleReorder = async (order) => {
    if (user) {
      try {
        // Create detailed cart items from the order
        let cartItems = [];
        
        // Handle both array and object format of items
        if (order.items) {
          // If items is an array of objects with name property
          if (Array.isArray(order.items) && typeof order.items[0] === 'object' && order.items[0].name) {
            cartItems = order.items.map(item => ({
              name: item.name,
              price: parseFloat(typeof item.price === 'number' ? item.price : coffeeProducts[item.name]?.price || 0),
              image: item.image || coffeeProducts[item.name]?.image || "/images/default-coffee.jpg",
              quantity: item.quantity || 1,
              id: `${item.name}-${Date.now()}` // Generate a unique ID
            }));
          } 
          // If items is an array of strings
          else if (Array.isArray(order.items) && typeof order.items[0] === 'string') {
            cartItems = order.items.map(itemName => {
              const product = coffeeProducts[itemName] || { 
                price: order.total / order.items.length,
                image: "/images/default-coffee.jpg" 
              };
              
              return {
                name: itemName,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1,
                id: `${itemName}-${Date.now()}` // Generate a unique ID
              };
            });
          }
        }
        
        // Store the cart in localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        
        // Also store in Firestore for persistence
        if (cartItems.length > 0) {
          const cartRef = doc(db, "carts", user.uid);
          const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          await setDoc(cartRef, {
            items: cartItems,
            userId: user.uid,
            total: cartTotal,
            updatedAt: new Date().toISOString()
          });
        }
        
        // Show success message
        setReorderSuccess(true);
        
        // Clear success message after 1.5 seconds and navigate
        setTimeout(() => {
          setReorderSuccess(false);
          navigate("/order");
        }, 1500);
      } catch (error) {
        console.error("Error reordering:", error);
        setUpdateError("Failed to reorder. Please try again.");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to check if a string is a valid number
  const isNumeric = (str) => {
    if (typeof str === 'number') return true;
    if (typeof str !== 'string') return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  };

  // Format currency for display (only INR)
  const formatCurrency = (amount) => {
    if (!isNumeric(amount)) return "₹0.00";
    const numAmount = parseFloat(amount);
    return `₹${numAmount.toFixed(2)}`;
  };

  // Format items for display - handle different item formats
  const formatItems = (items) => {
    if (!items) return "No items";
    
    // Case 1: Array of strings
    if (Array.isArray(items) && typeof items[0] === 'string') {
      return items.join(", ");
    }
    
    // Case 2: Array of objects with name property
    if (Array.isArray(items) && typeof items[0] === 'object') {
      return items.map(item => item.name || "Unknown Item").join(", ");
    }
    
    // Fallback case
    return "Items not available";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

        {updateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">Address updated successfully!</span>
          </div>
        )}
        
        {reorderSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">Items added to cart! Redirecting to order page...</span>
          </div>
        )}
        
        {updateError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{updateError}</span>
          </div>
        )}

        {user && (
          <div className="space-y-6">
            {/* User Details Section */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {userDetails.fullName || "Not provided"}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Address:</strong> {userDetails.address || "Not provided"}</p>
              </div>
            </div>

            {/* Editable Address Section */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Update Address</h3>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your address"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                />
                <button
                  onClick={handleSaveAddress}
                  className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80"
                >
                  Save Address
                </button>
              </div>
            </div>

            {/* Past Orders Section */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Past Orders</h3>
              {userDetails.pastOrders && userDetails.pastOrders.length > 0 ? (
                <ul className="space-y-4">
                  {userDetails.pastOrders.map((order, index) => (
                    <li key={order.id || index} className="border-b border-gray-300 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p><strong>Order ID:</strong> {order.id || `Order-${index+1}`}</p>
                          <p><strong>Items:</strong> {formatItems(order.items)}</p>
                          <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
                          <p><strong>Date:</strong> {formatDate(order.date)}</p>
                        </div>
                        <button
                          onClick={() => handleReorder(order)}
                          className="bg-primary text-white py-1 px-4 rounded hover:bg-primary/80 ml-4"
                        >
                          Reorder
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No past orders found. Your order history will appear here after your first purchase.</p>
              )}
            </div>

            {/* Logout Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  auth.signOut();
                  navigate("/login");
                }}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;