import express from "express";
import { login, signup } from "../../controllers/authControllers.js";

const authRoutes = express.Router();

// Login route
authRoutes.post("/login", login);

// Signup route
authRoutes.post("/signup", signup);

export default authRoutes;