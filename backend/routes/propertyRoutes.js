import express from "express";
import {
    createProperty,
    getAllProperties,
    getPropertiesByCity,
    getPropertyById,
    updateProperty,
    togglePropertyStatus,
    deleteProperty,
    deletePropertyImage,
    deletePropertyBrochure
} from "../controllers/propertyController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin-only routes
router.post("/", protect, admin, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'brochure', maxCount: 1 }]), createProperty);
router.put("/:id", protect, admin, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'brochure', maxCount: 1 }]), updateProperty);
router.patch("/:id/toggle", protect, admin, togglePropertyStatus);
router.delete("/:id/images", protect, admin, deletePropertyImage);
router.delete("/:id/brochure", protect, admin, deletePropertyBrochure);
router.delete("/:id", protect, admin, deleteProperty);

// Buyer-accessible routes (must be after admin routes to avoid conflicts)
router.get("/", protect, getAllProperties);
router.get("/city/:cityId", protect, getPropertiesByCity);
router.get("/:id", protect, getPropertyById);

export default router;
