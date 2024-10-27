import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import emailRouter from "./routes/emailRoutes.js"; // Import your email router
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS options
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from your frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (if necessary)
};

app.use(cors(corsOptions)); // Apply CORS options
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api", emailRouter); // Use your email router

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
