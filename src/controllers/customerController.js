// controllers/customerController.js
import admin from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

// Assuming formatDate function is defined somewhere in your code
const formatDate = (timestamp) => {
  if (!timestamp) return ""; // Handle null or undefined timestamps

  const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // Format: yyyy/mm/dd
};

const convertToFirestoreTimestamp = (dateString) => {
  // Validate and parse the date string
  const dateParts = dateString.split("-");
  if (dateParts.length !== 3) {
    throw new Error("Invalid date format. Expected format: yyyy-mm-dd");
  }

  const [year, month, day] = dateParts.map(Number);
  const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date

  // Return as Firestore Timestamp
  return Timestamp.fromDate(date);
};

// Function to retrieve all customers
export const getAllCustomers = async (req, res) => {
  const firestore = admin.firestore();
  try {
    const snapshot = await firestore.collection("customers").get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No customers found" });
    }

    // Map through each document and extract data, including the document ID
    const customers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Convert the Firestore Timestamp to a string
    customers.forEach((customer) => {
      if (customer.latestVisitDate) {
        customer.latestVisitDate = formatDate(customer.latestVisitDate); // Use formatDate here
      }
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({ error: "Failed to retrieve customers" });
  }
};

// Create a new customer
export const createCustomer = async (req, res) => {
  const firestore = admin.firestore();
  const { name, email, phone, latestVisitDate } = req.body;

  // Convert latestVisitDate to Firestore Timestamp
  let latestVisitTimestamp = latestVisitDate
    ? convertToFirestoreTimestamp(latestVisitDate)
    : null;

  try {
    console.log("Creating customer:", req.body);
    const docRef = await firestore.collection("customers").add({
      name,
      email,
      phone,
      latestVisitDate: latestVisitTimestamp, // Store the timestamp
    });
    res
      .status(201)
      .json({ message: "Customer created successfully", id: docRef.id });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
};

// Get a customer by ID
export const getCustomerById = async (req, res) => {
  const firestore = admin.firestore();
  const { id } = req.params;
  try {
    const doc = await firestore.collection("customers").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerData = { id: doc.id, ...doc.data() };

    // Convert latestVisitDate to string if it exists
    if (customerData.latestVisitDate) {
      customerData.latestVisitDate = formatDate(customerData.latestVisitDate);
    }

    res.status(200).json(customerData);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).json({ error: "Failed to retrieve customer" });
  }
};

export const updateCustomerById = async (req, res) => {
  const firestore = admin.firestore();
  const { id } = req.params;
  const customerData = { ...req.body };

  try {
    const docRef = firestore.collection("customers").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Convert latestVisitDate to Firestore Timestamp if it's a valid date string
    if (customerData.latestVisitDate) {
      customerData.latestVisitDate = convertToFirestoreTimestamp(
        customerData.latestVisitDate
      );
    }
    // Remove the ID field if present in the request body
    delete customerData.id;
    console.log("Updating customer:", customerData);
    await docRef.update(customerData);
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete a customer by ID
export const deleteCustomerById = async (req, res) => {
  const firestore = admin.firestore();
  const { id } = req.params;
  try {
    const docRef = firestore.collection("customers").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
