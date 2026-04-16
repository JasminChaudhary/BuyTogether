import mongoose from "mongoose";

const dealershipGroupSchema = new mongoose.Schema(
    {
        dealership: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dealership",
            required: [true, "Dealership is required"],
        },
        status: {
            type: String,
            enum: ["OPEN", "QUALIFIED", "CHAT_ENABLED", "SUCCESSFUL", "DISSOLVED"],
            default: "OPEN",
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DealershipGroupMember",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Virtual field for member count
dealershipGroupSchema.virtual("memberCount").get(function () {
    return this.members.length;
});

// Ensure virtuals are included in JSON
dealershipGroupSchema.set("toJSON", { virtuals: true });
dealershipGroupSchema.set("toObject", { virtuals: true });

// Method to check if group qualifies
dealershipGroupSchema.methods.checkQualification = async function () {
    await this.populate("dealership");
    if (this.memberCount >= this.dealership.minimumGroupSize && this.status === "OPEN") {
        this.status = "QUALIFIED";
        await this.save();
    }
    return this.status === "QUALIFIED" || this.status === "CHAT_ENABLED" || this.status === "SUCCESSFUL";
};

// Method to dissolve group
dealershipGroupSchema.methods.dissolve = async function () {
    if (this.status === "SUCCESSFUL") {
        throw new Error("Cannot dissolve a successful group");
    }
    this.status = "DISSOLVED";
    await this.save();

    // Update all member tokens to REFUNDED
    const DealershipGroupMember = mongoose.model("DealershipGroupMember");
    await DealershipGroupMember.updateMany(
        { group: this._id, tokenStatus: "PAID" },
        { tokenStatus: "REFUNDED" }
    );
};

// Method to mark group as successful
dealershipGroupSchema.methods.markSuccessful = async function () {
    if (this.status !== "QUALIFIED" && this.status !== "CHAT_ENABLED") {
        throw new Error("Only qualified groups can be marked as successful");
    }
    this.status = "SUCCESSFUL";
    await this.save();

    // Update all member tokens to FORFEITED
    const DealershipGroupMember = mongoose.model("DealershipGroupMember");
    await DealershipGroupMember.updateMany(
        { group: this._id, tokenStatus: "PAID" },
        { tokenStatus: "FORFEITED" }
    );
};

const DealershipGroup = mongoose.model("DealershipGroup", dealershipGroupSchema);

export default DealershipGroup;
