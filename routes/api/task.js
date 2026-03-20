import express from "express";
import { createTasks, deleteTasks, getTasks, updateTasks } from "../../controllers/taskControllers.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const taskRoutes = express.Router();

// Create tasks
taskRoutes.post("/setTasks", verifyToken, createTasks);

// Get all tasks
taskRoutes.get("/getTasks", verifyToken, getTasks);

// Update the tasks
taskRoutes.put("/updateTasks", verifyToken, updateTasks);

// Delete the tasks
taskRoutes.delete("/deleteTasks/:id", verifyToken, deleteTasks);

export default taskRoutes;