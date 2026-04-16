import City from "../models/City.js";

// @desc    Create a new city
// @route   POST /api/cities
// @access  Private/Admin
export const createCity = async (req, res) => {
    try {
        const { name, state } = req.body;

        if (!name || !state) {
            return res.status(400).json({ message: "Name and state are required" });
        }

        // Check if city already exists
        const cityExists = await City.findOne({ name });

        if (cityExists) {
            return res.status(400).json({ message: "City already exists" });
        }

        const city = await City.create({
            name,
            state,
        });

        res.status(201).json(city);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all cities (including inactive)
// @route   GET /api/cities
// @access  Private/Admin
export const getAllCities = async (req, res) => {
    try {
        const cities = await City.find({}).sort({ createdAt: -1 });
        res.json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get active cities only
// @route   GET /api/cities/active
// @access  Public
export const getActiveCities = async (req, res) => {
    try {
        const cities = await City.find({ isActive: true }).sort({ name: 1 });
        res.json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Toggle city active status
// @route   PATCH /api/cities/:id/toggle
// @access  Private/Admin
export const toggleCityStatus = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);

        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }

        city.isActive = !city.isActive;
        await city.save();

        res.json(city);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
