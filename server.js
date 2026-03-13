import express from "express";
import dotenv from "@dotenvx/dotenvx";

import { baseRoute } from "./routes/index.js";
import { connectDB } from "./configs/mongoDBConfig.js";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();  // Load local .env secrets
}

// Creates an express app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Base route
app.use("/", baseRoute);

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`\n🚀 Server listening on port: ${PORT}`);
});
