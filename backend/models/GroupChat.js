import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PropertyGroup",
            required: [true, "Group is required"],
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Sender is required"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            maxlength: [1000, "Message cannot exceed 1000 characters"],
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient message retrieval
groupChatSchema.index({ group: 1, createdAt: -1 });

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;
