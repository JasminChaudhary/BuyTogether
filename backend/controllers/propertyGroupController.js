import PropertyGroup from "../models/PropertyGroup.js";
import Property from "../models/Property.js";
import GroupMember from "../models/GroupMember.js";

// @desc    Get all property groups (Admin)
// @route   GET /api/property-groups
// @access  Private/Admin
export const getAllPropertyGroups = async (req, res) => {
    try {
        const groups = await PropertyGroup.find()
            .populate({
                path: "property",
                populate: { path: "city" }
            })
            .populate({
                path: "members",
                populate: { path: "buyer", select: "name email" }
            })
            .sort({ createdAt: -1 });

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all groups by city (Admin)
// @route   GET /api/property-groups/city/:cityId
// @access  Private/Admin
export const getGroupsByCity = async (req, res) => {
    try {
        const { cityId } = req.params;

        // Find all properties in the city
        const properties = await Property.find({ city: cityId });
        const propertyIds = properties.map(p => p._id);

        // Find all groups for these properties
        const groups = await PropertyGroup.find({ property: { $in: propertyIds } })
            .populate({
                path: "property",
                populate: { path: "city" }
            })
            .populate({
                path: "members",
                populate: { path: "buyer", select: "name email" }
            })
            .sort({ createdAt: -1 });

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get group details
// @route   GET /api/property-groups/:id
// @access  Private/Admin
export const getGroupDetails = async (req, res) => {
    try {
        const group = await PropertyGroup.findById(req.params.id)
            .populate({
                path: "property",
                populate: { path: "city" }
            })
            .populate({
                path: "members",
                populate: { path: "buyer", select: "name email" }
            });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Enable chat for qualified group
// @route   PATCH /api/property-groups/:id/enable-chat
// @access  Private/Admin
export const enableChat = async (req, res) => {
    try {
        const group = await PropertyGroup.findById(req.params.id).populate("property");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.status !== "QUALIFIED") {
            return res.status(400).json({
                message: "Only qualified groups can have chat enabled"
            });
        }

        group.status = "CHAT_ENABLED";
        await group.save();

        const updatedGroup = await PropertyGroup.findById(group._id)
            .populate({
                path: "property",
                populate: { path: "city" }
            })
            .populate({
                path: "members",
                populate: { path: "buyer", select: "name email" }
            });

        res.json(updatedGroup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Dissolve group and refund tokens
// @route   PATCH /api/property-groups/:id/dissolve
// @access  Private/Admin
export const dissolveGroup = async (req, res) => {
    try {
        const group = await PropertyGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.dissolve();

        const updatedGroup = await PropertyGroup.findById(group._id)
            .populate({
                path: "property",
                populate: { path: "city" }
            })
            .populate({
                path: "members",
                populate: { path: "buyer", select: "name email" }
            });

        res.json({
            message: "Group dissolved and tokens refunded",
            group: updatedGroup
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// @desc    Mark group as successful
// @route   PATCH /api/property-groups/:id/mark-successful
// @access  Private/Admin
export const markGroupSuccessful = async (req, res) => {
    try {
        const group = await PropertyGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.markSuccessful();

        const updatedGroup = await PropertyGroup.findById(group._id)
            .populate({
                path: "property",
                populate: { path: "city" }
            })
            .populate({
                path: "members",
                populate: { path: "buyer", select: "name email" }
            });

        res.json({
            message: "Group marked as successful, tokens forfeited as platform fees",
            group: updatedGroup
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
