import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/dealershipGroupChatController.js";

const router = express.Router();

// Both routes require authentication
router.use(protect);

router.post("/:groupId/messages", sendMessage);
router.get("/:groupId/messages", getMessages);

export default router;
