import express from "express";
import {
    createCity,
    getAllCities,
    getActiveCities,
    toggleCityStatus,
} from "../controllers/cityController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - Get active cities
router.get("/active", getActiveCities);

// Admin routes - Protected
router.post("/", protect, admin, createCity);
router.get("/", protect, admin, getAllCities);
router.patch("/:id/toggle", protect, admin, toggleCityStatus);

export default router;
