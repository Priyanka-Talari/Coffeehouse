import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LoginImage from "../assets/images/login.jpg";
import RegisterImage from "../assets/images/register.jpg";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const switchForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsTransitioning(false);
    }, 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate(role === "admin" ? "/admin-dashboard" : "/profile");
      }, 2000);
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: fullName
      });
      
      // Save user data to Firestore with pastOrders array initialized
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        role: "customer",
        address: "",
        pastOrders: [], // Initialize empty pastOrders array
        createdAt: new Date().toISOString()
      });
      
      setSuccess("Registration successful! Redirecting to profile...");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 relative">
      {error && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-3 px-6 rounded-full shadow-lg z-50">
          {error}
        </div>
      )}
      {success && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-3 px-6 rounded-full shadow-lg z-50">
          {success}
        </div>
      )}

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className={`w-1/2 relative ${isLogin ? "order-last" : ""}`}>
          <img
            src={isLogin ? LoginImage : RegisterImage}
            alt="Login/Register"
            className="w-full h-full object-cover"
          />
        </div>

        {user ? (
          <div className="w-1/2 flex flex-col justify-center items-center p-8">
            <h2 className="text-2xl font-bold mb-6">Welcome, {user.displayName || user.email}</h2>
            <p className="mb-4">You are logged in successfully.</p>
            <button 
              onClick={() => navigate("/profile")} 
              className="bg-primary text-white py-2 px-6 rounded hover:bg-primary/80"
            >
              Go to Profile
            </button>
          </div>
        ) : (
          <div
            className={`w-1/2 flex justify-center items-center p-8 relative z-10 transition-all duration-500 transform ${
              isTransitioning
                ? isLogin
                  ? "-translate-x-full"
                  : "translate-x-full"
                : "translate-x-0"
            }`}
          >
            {isLogin ? (
              <div className="w-full max-w-sm bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between gap-2">
                      <button
                        type="button"
                        className={`w-1/2 ${
                          role === "customer"
                            ? "bg-primary text-white"
                            : "bg-gray-300"
                        } py-2 rounded hover:bg-primary/80`}
                        onClick={() => setRole("customer")}
                      >
                        Login as Customer
                      </button>
                      <button
                        type="button"
                        className={`w-1/2 ${
                          role === "admin"
                            ? "bg-primary text-white"
                            : "bg-gray-300"
                        } py-2 rounded hover:bg-primary/80`}
                        onClick={() => setRole("admin")}
                      >
                        Login as Admin
                      </button>
                    </div>
                  </div>
                  <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80">
                    Login
                  </button>
                </form>
                <p className="mt-4 text-center">
                  Don't have an account?{" "}
                  <span
                    onClick={switchForm}
                    className="text-primary cursor-pointer"
                  >
                    Register here
                  </span>
                </p>
              </div>
            ) : (
              <div className="w-full max-w-sm bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <form onSubmit={handleRegister}>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80">
                    Register
                  </button>
                </form>
                <p className="mt-4 text-center">
                  Already have an account?{" "}
                  <span
                    onClick={switchForm}
                    className="text-primary cursor-pointer"
                  >
                    Login here
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;