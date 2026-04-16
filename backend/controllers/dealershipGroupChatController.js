import DealershipGroupChat from "../models/DealershipGroupChat.js";
import DealershipGroup from "../models/DealershipGroup.js";
import DealershipGroupMember from "../models/DealershipGroupMember.js";
import Notification from "../models/Notification.js";

// @desc    Send message to dealership group chat
// @route   POST /api/dealership-group-chat/:groupId/messages
// @access  Private (Buyer/Admin)
export const sendMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { message } = req.body;
        const senderId = req.user._id;
        const senderRole = req.user.role;

        if (!message || message.trim() === "") {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        // Find group
        const group = await DealershipGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if chat is enabled
        if (group.status !== "CHAT_ENABLED" && group.status !== "SUCCESSFUL") {
            return res.status(400).json({
                message: "Chat is not enabled for this group yet"
            });
        }

        // Check access: Admin can always access, Buyer must be a member
        if (senderRole === "BUYER") {
            const membership = await DealershipGroupMember.findOne({
                group: groupId,
                buyer: senderId
            });

            if (!membership) {
                return res.status(403).json({
                    message: "You must be a group member to send messages"
                });
            }
        }

        // Create message
        const chatMessage = await DealershipGroupChat.create({
            group: groupId,
            sender: senderId,
            message: message.trim(),
        });

        const populatedMessage = await DealershipGroupChat.findById(chatMessage._id)
            .populate("sender", "name email role");

        // Emit message to room using Socket.io
        const io = req.app.get("io");
        io.to(groupId).emit("receive_message", populatedMessage);

        // Fetch all active group members to notify them, excluding the sender
        const members = await DealershipGroupMember.find({ group: groupId, tokenStatus: "PAID" });
        const notificationsToCreate = members
            .filter(member => member.buyer.toString() !== senderId.toString())
            .map(member => ({
                user: member.buyer,
                type: "DEALERSHIP_GROUP_MESSAGE",
                title: `New message in your group`,
                message: `${req.user.role === "ADMIN" ? "Admin" : populatedMessage.sender.name} sent a new message.`,
                relatedId: groupId
            }));

        if (notificationsToCreate.length > 0) {
            await Notification.insertMany(notificationsToCreate);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all messages for a dealership group
// @route   GET /api/dealership-group-chat/:groupId/messages
// @access  Private (Buyer/Admin)
export const getMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        // Find group
        const group = await DealershipGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check access: Admin can always access, Buyer must be a member
        if (userRole === "BUYER") {
            const membership = await DealershipGroupMember.findOne({
                group: groupId,
                buyer: userId
            });

            if (!membership) {
                return res.status(403).json({
                    message: "You must be a group member to view messages"
                });
            }
        }

        // Fetch messages
        const messages = await DealershipGroupChat.find({ group: groupId })
            .populate("sender", "name email role")
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
