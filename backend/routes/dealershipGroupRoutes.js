import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    getAllDealershipGroups,
    getGroupsByCity,
    getGroupDetails,
    enableChat,
    dissolveGroup,
    markGroupSuccessful,
} from "../controllers/dealershipGroupController.js";

const router = express.Router();

// All routes are admin-only
router.use(protect, admin);

router.get("/", getAllDealershipGroups);
router.get("/city/:cityId", getGroupsByCity);
router.get("/:id", getGroupDetails);
router.patch("/:id/enable-chat", enableChat);
router.patch("/:id/dissolve", dissolveGroup);
router.patch("/:id/mark-successful", markGroupSuccessful);

export default router;
