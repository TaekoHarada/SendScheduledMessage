import express from "express";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import admin from "firebase-admin";

const app = express();
const port = 5001;

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlIPTl0oe4HAgE6buZi2eSl-KY3ro4zn8",
  authDomain: "sendscheduledmessage.firebaseapp.com",
  projectId: "sendscheduledmessage",
  storageBucket: "sendscheduledmessage.appspot.com",
  messagingSenderId: "946670035472",
  appId: "1:946670035472:web:316a275eb23b176c002095",
  measurementId: "G-33RT9SFMFL",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to create a new customer record
app.post("/customers", async (req, res) => {
  const { userId, customerData } = req.body;

  try {
    // Create a new customer record with userId
    const docRef = await addDoc(collection(db, "customers"), {
      ...customerData,
      userId: userId, // Attach the user ID to the customer record
    });
    res.status(201).json({ message: "Customer created", id: docRef.id });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// Endpoint to get the authenticated user's customer records
app.get("/customers", async (req, res) => {
  // const userId = req.query.userId; // Get userId from query (or use your auth mechanism)
  try {
    const q = query(collection(db, "customers"));
    const querySnapshot = await getDocs(q);
    const customers = [];

    querySnapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({ error: "Failed to retrieve customers" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
