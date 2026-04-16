import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PropertyGroup",
            required: [true, "Group is required"],
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Buyer is required"],
        },
        tokenStatus: {
            type: String,
            enum: ["PENDING", "PAID", "REFUNDED", "FORFEITED"],
            default: "PAID", // Simulated payment - auto-set to PAID on join
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate joins
groupMemberSchema.index({ group: 1, buyer: 1 }, { unique: true });

const GroupMember = mongoose.model("GroupMember", groupMemberSchema);

export default GroupMember;
