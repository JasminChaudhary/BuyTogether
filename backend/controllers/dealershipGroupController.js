import DealershipGroup from "../models/DealershipGroup.js";
import Dealership from "../models/Dealership.js";
import DealershipGroupMember from "../models/DealershipGroupMember.js";

// @desc    Get all dealership groups (Admin)
// @route   GET /api/dealership-groups
// @access  Private/Admin
export const getAllDealershipGroups = async (req, res) => {
    try {
        const groups = await DealershipGroup.find()
            .populate({
                path: "dealership",
                populate: { path: "city" }
            })
            .sort({ createdAt: -1 });

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all groups by city (Admin)
// @route   GET /api/dealership-groups/city/:cityId
// @access  Private/Admin
export const getGroupsByCity = async (req, res) => {
    try {
        const { cityId } = req.params;

        // Find all dealerships in the city
        const dealerships = await Dealership.find({ city: cityId });
        const dealershipIds = dealerships.map(d => d._id);

        // Find all groups for these dealerships
        const groups = await DealershipGroup.find({ dealership: { $in: dealershipIds } })
            .populate({
                path: "dealership",
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
// @route   GET /api/dealership-groups/:id
// @access  Private/Admin
export const getGroupDetails = async (req, res) => {
    try {
        const group = await DealershipGroup.findById(req.params.id)
            .populate({
                path: "dealership",
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
// @route   PATCH /api/dealership-groups/:id/enable-chat
// @access  Private/Admin
export const enableChat = async (req, res) => {
    try {
        const group = await DealershipGroup.findById(req.params.id).populate("dealership");

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

        const updatedGroup = await DealershipGroup.findById(group._id)
            .populate({
                path: "dealership",
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
// @route   PATCH /api/dealership-groups/:id/dissolve
// @access  Private/Admin
export const dissolveGroup = async (req, res) => {
    try {
        const group = await DealershipGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.dissolve();

        const updatedGroup = await DealershipGroup.findById(group._id)
            .populate({
                path: "dealership",
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
// @route   PATCH /api/dealership-groups/:id/mark-successful
// @access  Private/Admin
export const markGroupSuccessful = async (req, res) => {
    try {
        const group = await DealershipGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.markSuccessful();

        const updatedGroup = await DealershipGroup.findById(group._id)
            .populate({
                path: "dealership",
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
