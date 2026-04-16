import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    getAllPropertyGroups,
    getGroupsByCity,
    getGroupDetails,
    enableChat,
    dissolveGroup,
    markGroupSuccessful,
} from "../controllers/propertyGroupController.js";

const router = express.Router();

// All routes are admin-only
router.use(protect, admin);

router.get("/", getAllPropertyGroups);
router.get("/city/:cityId", getGroupsByCity);
router.get("/:id", getGroupDetails);
router.patch("/:id/enable-chat", enableChat);
router.patch("/:id/dissolve", dissolveGroup);
router.patch("/:id/mark-successful", markGroupSuccessful);

export default router;
