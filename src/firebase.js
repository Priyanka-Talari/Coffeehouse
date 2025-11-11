// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the authentication module
import { getFirestore } from "firebase/firestore"; // Import Firestore for user profile data

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4AZCtEmC0WfVl3kB60I5zNOHmgGanf2M",
  authDomain: "login-7fbb0.firebaseapp.com",
  projectId: "login-7fbb0",
  storageBucket: "login-7fbb0.appspot.com",
  messagingSenderId: "471450029199",
  appId: "1:471450029199:web:538ed1cc947ccef1bb74fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export auth and db objects to use in other components