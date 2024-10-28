import { Router } from "express";
import { sendEmailsToCustomers } from "../controllers/emailController.js";

const router = Router();

router.post("/send-email", sendEmailsToCustomers);

// Route to get all mail templates
router.get("/", (req, res) => {
  res.json({ message: "Fetching all mail templates" });
});

// Route to create a new mail template
router.post("/", (req, res) => {
  const { title, message } = req.body;
  res.json({ message: `Creating a mail template with title: ${title}` });
});

// Route to send email using a specific template
router.post("/:id/send", (req, res) => {
  const { id } = req.params;
  // Logic to send an email to customers with specific conditions
  res.json({ message: `Sending email using template ID: ${id}` });
});

export default router;
