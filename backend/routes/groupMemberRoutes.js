import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    joinGroup,
    getMyGroups,
    getGroupStatus,
} from "../controllers/groupMemberController.js";

const router = express.Router();

// All routes require authentication (buyer role)
router.use(protect);

router.post("/join/:propertyId", joinGroup);
router.get("/my-groups", getMyGroups);
router.get("/status/:groupId", getGroupStatus);

export default router;
