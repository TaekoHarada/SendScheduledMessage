import { Router } from "express";
import { sendEmailsToCustomers } from "../controllers/emailController.js";

const emailRouter = Router();

emailRouter.post("/send-email", sendEmailsToCustomers);

export default emailRouter;
