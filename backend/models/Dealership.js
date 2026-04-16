import mongoose from "mongoose";

const dealershipSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Dealership name is required"],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, "Brand is required"],
            trim: true,
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: [true, "City is required"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        },
        images: [{
            type: String,
        }],
        contactPerson: {
            type: String,
            required: [true, "Contact person is required"],
            trim: true,
        },
        contactPhone: {
            type: String,
            required: [true, "Contact phone is required"],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Group Buying Settings
        minimumGroupSize: {
            type: Number,
            default: 5, // Default minimum group size, admin can change this
            min: 1,
        },
        groupJoiningDeadline: {
            type: Date,
            // Automatically set to 30 days from creation in controller, or admin can set this
        },
        tokenAmount: {
            type: Number,
            default: 5000, // Default token amount, admin can change this
            min: 0,
        },
        groupRules: {
            type: String,
            default: "By joining this group, you agree to participate in collective negotiation for vehicles from this dealership. The token amount is a platform service fee that will be refunded if the group fails to reach minimum size or is dissolved by admin. If the deal is successful, the token becomes a non-refundable platform fee.",
        },
        currentGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DealershipGroup",
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate dealership per city
dealershipSchema.index({ name: 1, city: 1 }, { unique: true });

const Dealership = mongoose.model("Dealership", dealershipSchema);

export default Dealership;
