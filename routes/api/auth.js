import express from "express";
import { login, logout, refresh, signup } from "../../controllers/authControllers.js";

const authRoutes = express.Router();

// Login route
authRoutes.post("/login", login);

// Signup route
authRoutes.post("/signup", signup);

// Generate refresh token
authRoutes.get("/refresh", refresh)

// Logout route
authRoutes.post("/logout", logout)

export default authRoutes;