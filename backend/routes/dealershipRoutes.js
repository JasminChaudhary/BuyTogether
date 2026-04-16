import express from "express";
import {
    createDealership,
    getAllDealerships,
    getDealershipsByCity,
    getDealershipById,
    updateDealership,
    toggleDealershipStatus,
    deleteDealership,
    deleteDealershipImage
} from "../controllers/dealershipController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin-only routes
router.post("/", protect, admin, upload.fields([{ name: 'images', maxCount: 10 }]), createDealership);
router.put("/:id", protect, admin, upload.fields([{ name: 'images', maxCount: 10 }]), updateDealership);
router.patch("/:id/toggle", protect, admin, toggleDealershipStatus);
router.delete("/:id/images", protect, admin, deleteDealershipImage);
router.delete("/:id", protect, admin, deleteDealership);

// Public/User routes
router.get("/", protect, getAllDealerships);
router.get("/city/:cityId", protect, getDealershipsByCity);
router.get("/:id", protect, getDealershipById);

export default router;
