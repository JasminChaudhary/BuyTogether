import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
        },
        builderName: {
            type: String,
            required: [true, "Builder name is required"],
            trim: true,
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: [true, "City is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        },
        propertyType: {
            type: String,
            enum: ["Flat", "Villa", "Plot"],
            required: [true, "Property type is required"],
        },
        minimumPrice: {
            type: Number,
            required: [true, "Minimum price is required"],
            min: 0,
        },
        // Group Buying Settings
        minimumGroupSize: {
            type: Number,
            required: [true, "Minimum group size is required"],
            min: 1,
        },
        groupJoiningDeadline: {
            type: Date,
            required: [true, "Group joining deadline is required"],
        },
        tokenAmount: {
            type: Number,
            required: [true, "Token amount is required"],
            min: 0,
        },
        groupRules: {
            type: String,
            default: "By joining this group, you agree to participate in collective negotiation. The token amount is a platform service fee that will be refunded if the group fails to reach minimum size or is dissolved by admin. If the deal is successful, the token becomes a non-refundable platform fee.",
        },
        currentGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PropertyGroup",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        images: [{
            type: String,
        }],
        brochure: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate project per city
propertySchema.index({ projectName: 1, city: 1 }, { unique: true });

const Property = mongoose.model("Property", propertySchema);

export default Property;
