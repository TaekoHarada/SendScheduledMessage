import { Router } from "express";
import {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} from "../controllers/customerController.js";

const router = Router();

// Route to get all customers
router.get("/", getAllCustomers);

// Route to create a new customer
router.post("/", createCustomer);

// Route to get customer details by ID
router.get("/:id", getCustomerById);

// Route to update a customer by ID
router.put("/:id", updateCustomerById);

// Route to delete a customer by ID
router.delete("/:id", deleteCustomerById);

export default router;
