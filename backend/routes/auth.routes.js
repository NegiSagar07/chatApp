import express from 'express'; // Importing express using ES6 syntax
import { signup, login, logout } from '../controller/auth.controller.js';

const router = express.Router(); // Create a new Router instance

// Define routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router; // Export the router
