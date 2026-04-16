import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    sendMessage,
    getMessages,
} from "../controllers/groupChatController.js";

const router = express.Router();

// All routes require authentication (buyer or admin)
router.use(protect);

router.post("/:groupId/messages", sendMessage);
router.get("/:groupId/messages", getMessages);

export default router;
