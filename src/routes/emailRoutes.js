import { Router } from "express";
import {
  sendEmailsToCustomers,
  getAllMailTemps,
  createMailTemp,
  getMailTempById,
  updateMailTempById,
  deleteMailTempById,
} from "../controllers/emailController.js";

const router = Router();

// Route to send emails to customers
router.post("/send-email", sendEmailsToCustomers);

router.get("/", getAllMailTemps);

router.post("/", createMailTemp);

router.get("/:id", getMailTempById);

router.put("/:id", updateMailTempById);

router.delete("/:id", deleteMailTempById);

export default router;
