import Property from "../models/Property.js";
import PropertyGroup from "../models/PropertyGroup.js";
import GroupMember from "../models/GroupMember.js";
import GroupChat from "../models/GroupChat.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private/Admin
export const createProperty = async (req, res) => {
    try {
        const {
            projectName,
            builderName,
            city,
            location,
            propertyType,
            minimumPrice,
            minimumGroupSize,
            groupJoiningDeadline,
            tokenAmount,
            groupRules,
            coordinates
        } = req.body;

        const images = req.files?.['images']?.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`) || [];
        const brochure = req.files?.['brochure']?.[0] ? `data:${req.files['brochure'][0].mimetype};base64,${req.files['brochure'][0].buffer.toString('base64')}` : null;

        // Validate required fields
        if (!projectName || !builderName || !city || !location || !propertyType ||
            minimumPrice === undefined || !minimumGroupSize || !groupJoiningDeadline ||
            tokenAmount === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Parse coordinates if sent as string (multipart/form-data often sends objects as strings)
        let parsedCoordinates = null;
        if (coordinates) {
            try {
                parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
            } catch (e) {
                console.error("Error parsing coordinates:", e);
                // Continue without coordinates or handle error
            }
        }

        // Validate property type
        if (!["Flat", "Villa", "Plot"].includes(propertyType)) {
            return res.status(400).json({ message: "Invalid property type" });
        }

        // Validate group settings
        if (minimumGroupSize < 1) {
            return res.status(400).json({ message: "Minimum group size must be at least 1" });
        }

        const deadline = new Date(groupJoiningDeadline);
        if (deadline <= new Date()) {
            return res.status(400).json({ message: "Group joining deadline must be in the future" });
        }

        if (tokenAmount < 0) {
            return res.status(400).json({ message: "Token amount cannot be negative" });
        }

        // Check if property already exists in this city
        const propertyExists = await Property.findOne({ projectName, city });

        if (propertyExists) {
            return res.status(400).json({ message: "Property project already exists in this city" });
        }

        // Create property
        const property = await Property.create({
            projectName,
            builderName,
            city,
            location,
            coordinates: parsedCoordinates,
            propertyType,
            minimumPrice,
            minimumGroupSize,
            groupJoiningDeadline: deadline,
            tokenAmount,
            groupRules,
            images: images || [],
            brochure: brochure,
            currentGroup: null // Explicitly handle later
        });

        // Auto-create initial PropertyGroup
        const initialGroup = await PropertyGroup.create({
            property: property._id,
            status: "OPEN",
        });

        // Link group to property
        property.currentGroup = initialGroup._id;
        await property.save();

        const populatedProperty = await Property.findById(property._id)
            .populate("city")
            .populate("currentGroup");

        // Notify users in this city about the new property
        const usersInCity = await User.find({ selectedCity: city });
        const notifications = usersInCity.map(u => ({
            user: u._id,
            type: "NEW_PROPERTY",
            title: "New Property in your city",
            message: `A new property, ${projectName}, has been listed in your city!`,
            relatedId: property._id
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json(populatedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Private/Admin
export const getAllProperties = async (req, res) => {
    try {
        const { city, limit } = req.query;

        const filter = city ? { city } : {};

        // If user is not admin, only show active properties
        if (req.user && req.user.role !== "ADMIN") {
            filter.isActive = true;
        }

        let query = Property.find(filter)
            .populate("city")
            .populate("currentGroup")
            .sort({ createdAt: -1 });

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const properties = await query;

        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get properties by city
// @route   GET /api/properties/city/:cityId
// @access  Private/Admin
export const getPropertiesByCity = async (req, res) => {
    try {
        const properties = await Property.find({ city: req.params.cityId, isActive: true })
            .populate("city")
            .populate("currentGroup")
            .sort({ projectName: 1 });

        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Private (Buyer/Admin)
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate("city")
            .populate({
                path: "currentGroup",
                populate: {
                    path: "members",
                    populate: { path: "buyer", select: "name email" }
                }
            });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Admin
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        const {
            projectName,
            builderName,
            city,
            location,
            propertyType,
            minimumPrice,
            minimumGroupSize,
            groupJoiningDeadline,
            tokenAmount,
            groupRules,
            coordinates
        } = req.body;

        if (req.files?.['images']) {
            const newImages = req.files['images'].map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
            property.images = [...(property.images || []), ...newImages];
        }

        if (req.files?.['brochure']) {
            property.brochure = `data:${req.files['brochure'][0].mimetype};base64,${req.files['brochure'][0].buffer.toString('base64')}`;
        }

        // Validate property type if provided
        if (propertyType && !["Flat", "Villa", "Plot"].includes(propertyType)) {
            return res.status(400).json({ message: "Invalid property type" });
        }

        // Validate group settings if provided
        if (minimumGroupSize !== undefined && minimumGroupSize < 1) {
            return res.status(400).json({ message: "Minimum group size must be at least 1" });
        }

        if (groupJoiningDeadline) {
            const deadline = new Date(groupJoiningDeadline);
            if (deadline <= new Date()) {
                return res.status(400).json({ message: "Group joining deadline must be in the future" });
            }
            property.groupJoiningDeadline = deadline;
        }

        if (tokenAmount !== undefined && tokenAmount < 0) {
            return res.status(400).json({ message: "Token amount cannot be negative" });
        }

        if (coordinates) {
            try {
                property.coordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
            } catch (e) {
                console.error("Error parsing coordinates:", e);
            }
        }

        property.projectName = projectName || property.projectName;
        property.builderName = builderName || property.builderName;
        property.city = city || property.city;
        property.location = location || property.location;
        property.propertyType = propertyType || property.propertyType;
        property.minimumPrice = minimumPrice !== undefined ? minimumPrice : property.minimumPrice;
        property.minimumGroupSize = minimumGroupSize !== undefined ? minimumGroupSize : property.minimumGroupSize;
        property.tokenAmount = tokenAmount !== undefined ? tokenAmount : property.tokenAmount;
        property.groupRules = groupRules || property.groupRules;

        await property.save();

        const updatedProperty = await Property.findById(property._id)
            .populate("city")
            .populate("currentGroup");

        res.json(updatedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Toggle property active status
// @route   PATCH /api/properties/:id/toggle
// @access  Private/Admin
export const togglePropertyStatus = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        property.isActive = !property.isActive;
        await property.save();

        const updatedProperty = await Property.findById(property._id)
            .populate("city")
            .populate("currentGroup");

        res.json(updatedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete property brochure
// @route   DELETE /api/properties/:id/brochure
// @access  Private/Admin
export const deletePropertyBrochure = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (!property.brochure) {
            return res.status(400).json({ message: "No brochure found for this property" });
        }

        // Remove brochure reference
        property.brochure = null;

        await property.save();

        // Note: In a production environment, you would also delete the file from the filesystem.

        const updatedProperty = await Property.findById(property._id)
            .populate("city")
            .populate("currentGroup");

        res.json(updatedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deletePropertyImage = async (req, res) => {
    try {
        const { imagePath } = req.body;
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (!imagePath) {
            return res.status(400).json({ message: "Image path is required" });
        }

        // Remove image from array
        const initialLength = property.images.length;
        property.images = property.images.filter(img => img !== imagePath);

        if (property.images.length === initialLength) {
            return res.status(404).json({ message: "Image not found in property" });
        }

        await property.save();

        // Note: In a production environment, you would also delete the file from the filesystem here
        // using fs.unlink or a storage service SDK.

        const updatedProperty = await Property.findById(property._id)
            .populate("city")
            .populate("currentGroup");

        res.json(updatedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Find associated group
        const group = await PropertyGroup.findOne({ property: property._id });

        if (group) {
            // Delete all members of this group
            await GroupMember.deleteMany({ group: group._id });
            // Delete group chat messages
            await GroupChat.deleteMany({ group: group._id });
            // Delete the group
            await group.deleteOne();
        }

        await property.deleteOne();

        res.json({ message: "Property and associated group data removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
