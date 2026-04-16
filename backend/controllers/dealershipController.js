import Dealership from "../models/Dealership.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
// @desc    Create a new dealership
// @route   POST /api/dealerships
// @access  Private/Admin
export const createDealership = async (req, res) => {
    try {
        const {
            name,
            brand,
            city,
            address,
            contactPerson,
            contactPhone,
            coordinates,
            minimumGroupSize,
            tokenAmount,
            groupJoiningDeadline,
            groupRules
        } = req.body;

        if (!name || !brand || !city || !address || !contactPerson || !contactPhone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const images = req.files?.['images']?.map(file => `uploads/${file.filename}`) || [];

        // Parse coordinates
        let parsedCoordinates = null;
        if (coordinates) {
            try {
                parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
            } catch (e) {
                console.error("Error parsing coordinates:", e);
            }
        }

        // Check if dealership already exists in this city
        const dealershipExists = await Dealership.findOne({ name, city });

        if (dealershipExists) {
            return res.status(400).json({ message: "Dealership already exists in this city" });
        }

        const dealership = await Dealership.create({
            name,
            brand,
            city,
            address,
            coordinates: parsedCoordinates,
            contactPerson,
            contactPhone,
            images,
            minimumGroupSize: minimumGroupSize || undefined,
            tokenAmount: tokenAmount || undefined,
            groupJoiningDeadline: groupJoiningDeadline || undefined,
            groupRules: groupRules || undefined
        });

        const populatedDealership = await Dealership.findById(dealership._id).populate("city").populate("currentGroup");

        // Notify users in this city about the new dealership
        const usersInCity = await User.find({ selectedCity: city });
        const notifications = usersInCity.map(u => ({
            user: u._id,
            type: "NEW_DEALERSHIP",
            title: "New Dealership in your city",
            message: `A new ${brand} dealership, ${name}, has been listed in your city!`,
            relatedId: dealership._id
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json(populatedDealership);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all dealerships
// @route   GET /api/dealerships
// @access  Private/Admin
export const getAllDealerships = async (req, res) => {
    try {
        const { city, limit } = req.query;

        const filter = city ? { city } : {};

        // If user is not admin, only show active dealerships
        if (req.user && req.user.role !== "ADMIN") {
            filter.isActive = true;
        }

        let query = Dealership.find(filter)
            .populate("city")
            .populate("currentGroup")
            .sort({ createdAt: -1 });

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const dealerships = await query;

        res.json(dealerships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get dealerships by city
// @route   GET /api/dealerships/city/:cityId
// @access  Private/Admin
export const getDealershipsByCity = async (req, res) => {
    try {
        const dealerships = await Dealership.find({ city: req.params.cityId, isActive: true })
            .populate("city")
            .populate("currentGroup")
            .sort({ name: 1 });

        res.json(dealerships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get dealership by ID
// @route   GET /api/dealerships/:id
// @access  Private (User/Admin)
export const getDealershipById = async (req, res) => {
    try {
        const dealership = await Dealership.findById(req.params.id)
            .populate("city")
            .populate({
                path: "currentGroup",
                populate: {
                    path: "members",
                    populate: { path: "buyer", select: "name email" }
                }
            });

        if (!dealership) {
            return res.status(404).json({ message: "Dealership not found" });
        }

        res.json(dealership);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update dealership
// @route   PUT /api/dealerships/:id
// @access  Private/Admin
export const updateDealership = async (req, res) => {
    try {
        const dealership = await Dealership.findById(req.params.id);

        if (!dealership) {
            return res.status(404).json({ message: "Dealership not found" });
        }

        const {
            name,
            brand,
            city,
            address,
            contactPerson,
            contactPhone,
            coordinates,
            minimumGroupSize,
            tokenAmount,
            groupJoiningDeadline,
            groupRules
        } = req.body;

        if (req.files?.['images']) {
            const newImages = req.files['images'].map(file => `uploads/${file.filename}`);
            dealership.images = [...(dealership.images || []), ...newImages];
        }

        if (coordinates) {
            try {
                dealership.coordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
            } catch (e) {
                console.error("Error parsing coordinates:", e);
            }
        }

        dealership.name = name || dealership.name;
        dealership.brand = brand || dealership.brand;
        dealership.city = city || dealership.city;
        dealership.address = address || dealership.address;
        dealership.contactPerson = contactPerson || dealership.contactPerson;
        dealership.contactPhone = contactPhone || dealership.contactPhone;
        dealership.minimumGroupSize = minimumGroupSize || dealership.minimumGroupSize;
        dealership.tokenAmount = tokenAmount || dealership.tokenAmount;
        dealership.groupJoiningDeadline = groupJoiningDeadline || dealership.groupJoiningDeadline;
        dealership.groupRules = groupRules || dealership.groupRules;

        await dealership.save();

        const updatedDealership = await Dealership.findById(dealership._id).populate("city").populate("currentGroup");

        res.json(updatedDealership);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Toggle dealership active status
// @route   PATCH /api/dealerships/:id/toggle
// @access  Private/Admin
export const toggleDealershipStatus = async (req, res) => {
    try {
        const dealership = await Dealership.findById(req.params.id);

        if (!dealership) {
            return res.status(404).json({ message: "Dealership not found" });
        }

        dealership.isActive = !dealership.isActive;
        await dealership.save();

        const updatedDealership = await Dealership.findById(dealership._id).populate("city").populate("currentGroup");

        res.json(updatedDealership);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete dealership image
// @route   DELETE /api/dealerships/:id/images
// @access  Private/Admin
export const deleteDealershipImage = async (req, res) => {
    try {
        const { imagePath } = req.body;
        const dealership = await Dealership.findById(req.params.id);

        if (!dealership) {
            return res.status(404).json({ message: "Dealership not found" });
        }

        if (!imagePath) {
            return res.status(400).json({ message: "Image path is required" });
        }

        // Remove image from array
        dealership.images = dealership.images.filter(img => img !== imagePath);

        await dealership.save();

        const updatedDealership = await Dealership.findById(dealership._id).populate("city").populate("currentGroup");

        res.json(updatedDealership);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete dealership
// @route   DELETE /api/dealerships/:id
// @access  Private/Admin
export const deleteDealership = async (req, res) => {
    try {
        const dealership = await Dealership.findById(req.params.id);

        if (!dealership) {
            return res.status(404).json({ message: "Dealership not found" });
        }

        await dealership.deleteOne();

        res.json({ message: "Dealership removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
