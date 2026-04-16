import User from "../models/User.js";

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("selectedCity");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update user's selected city
// @route   PUT /api/user/city
// @access  Private
export const updateSelectedCity = async (req, res) => {
    try {
        const { cityId } = req.body;

        if (!cityId) {
            return res.status(400).json({ message: "City ID is required" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.selectedCity = cityId;
        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .select("-password")
            .populate("selectedCity");

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Upload profile picture
// @route   POST /api/user/profile-picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (req.file) {
            user.profilePicture = `api/uploads/${req.file.filename}`; // Or just uploads/filename depending on how served
            // Ideally: served via static folder at root
            // If server.js has: app.use('/uploads', ...)
            // Then path is `/uploads/${req.file.filename}`

            // Let's stick to simple relative path and let frontend prepend server url if needed
            // OR store full relative URL
            user.profilePicture = `uploads/${req.file.filename}`;

            await user.save();

            res.json({
                message: "Image uploaded",
                profilePicture: user.profilePicture
            });
        } else {
            res.status(400).json({ message: "No image received" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Toggle saving/unsaving a property
// @route   POST /api/user/saved-properties/:propertyId
// @access  Private
export const toggleSavedProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initialize if undefined
        if (!user.savedProperties) {
            user.savedProperties = [];
        }

        const isSaved = user.savedProperties.includes(propertyId);

        if (isSaved) {
            // Unsave
            user.savedProperties = user.savedProperties.filter(
                (id) => id.toString() !== propertyId.toString()
            );
        } else {
            // Save
            user.savedProperties.push(propertyId);
        }

        await user.save();

        res.json({
            message: isSaved ? "Property unsaved" : "Property saved",
            savedProperties: user.savedProperties,
        });
    } catch (error) {
        console.error("Error toggling saved property:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user's saved properties
// @route   GET /api/user/saved-properties
// @access  Private
export const getSavedProperties = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("savedProperties");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out any nulls if property was deleted
        const validProperties = (user.savedProperties || []).filter(p => p != null);

        res.json(validProperties);
    } catch (error) {
        console.error("Error fetching saved properties:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
