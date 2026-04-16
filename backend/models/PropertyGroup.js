import mongoose from "mongoose";

const propertyGroupSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: [true, "Property is required"],
        },
        status: {
            type: String,
            enum: ["OPEN", "QUALIFIED", "CHAT_ENABLED", "SUCCESSFUL", "DISSOLVED"],
            default: "OPEN",
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "GroupMember",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Virtual field for member count
propertyGroupSchema.virtual("memberCount").get(function () {
    return this.members.length;
});

// Ensure virtuals are included in JSON
propertyGroupSchema.set("toJSON", { virtuals: true });
propertyGroupSchema.set("toObject", { virtuals: true });

// Method to check if group qualifies
propertyGroupSchema.methods.checkQualification = async function () {
    await this.populate("property");
    if (this.memberCount >= this.property.minimumGroupSize && this.status === "OPEN") {
        this.status = "QUALIFIED";
        await this.save();
    }
    return this.status === "QUALIFIED" || this.status === "CHAT_ENABLED" || this.status === "SUCCESSFUL";
};

// Method to dissolve group
propertyGroupSchema.methods.dissolve = async function () {
    if (this.status === "SUCCESSFUL") {
        throw new Error("Cannot dissolve a successful group");
    }
    this.status = "DISSOLVED";
    await this.save();

    // Update all member tokens to REFUNDED
    const GroupMember = mongoose.model("GroupMember");
    await GroupMember.updateMany(
        { group: this._id, tokenStatus: "PAID" },
        { tokenStatus: "REFUNDED" }
    );
};

// Method to mark group as successful
propertyGroupSchema.methods.markSuccessful = async function () {
    if (this.status !== "QUALIFIED" && this.status !== "CHAT_ENABLED") {
        throw new Error("Only qualified groups can be marked as successful");
    }
    this.status = "SUCCESSFUL";
    await this.save();

    // Update all member tokens to FORFEITED
    const GroupMember = mongoose.model("GroupMember");
    await GroupMember.updateMany(
        { group: this._id, tokenStatus: "PAID" },
        { tokenStatus: "FORFEITED" }
    );
};

const PropertyGroup = mongoose.model("PropertyGroup", propertyGroupSchema);

export default PropertyGroup;
