import express, { json } from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import cors from "cors";
import uploadRouter from "./routes/upload.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.router.js";

dotenv.config();

const app = express();

// CORS setup to allow all origins and allow credentials
const corsOptions = {
	origin: "*", // Allow all origins
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow all common HTTP methods
	allowedHeaders: ["Content-Type", "Authorization"], // Allow Content-Type and Authorization headers
	credentials: true, // Allow cookies and authorization headers
};

// Apply the CORS middleware globally with the above options
app.use(cors(corsOptions));

// Middleware to parse JSON request body
app.use(json());

// Connect to the database
connectDB();

// Use route handlers
app.use("/api", uploadRouter);
app.use("/api/admin", adminRouter);
app.use("/api/v1/auth", userRouter);

// Simple test route to verify if the server is running
app.get("/test", (req, res) => {
	res.json({ message: "Server is up and running" });
});

// Define the server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
