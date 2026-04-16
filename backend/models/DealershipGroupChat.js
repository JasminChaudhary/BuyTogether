import mongoose from "mongoose";

const dealershipGroupChatSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DealershipGroup",
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
dealershipGroupChatSchema.index({ group: 1, createdAt: -1 });

const DealershipGroupChat = mongoose.model("DealershipGroupChat", dealershipGroupChatSchema);

export default DealershipGroupChat;
