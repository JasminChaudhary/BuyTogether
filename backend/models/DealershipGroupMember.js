import mongoose from "mongoose";

const dealershipGroupMemberSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DealershipGroup",
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
dealershipGroupMemberSchema.index({ group: 1, buyer: 1 }, { unique: true });

const DealershipGroupMember = mongoose.model("DealershipGroupMember", dealershipGroupMemberSchema);

export default DealershipGroupMember;
