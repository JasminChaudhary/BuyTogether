import express from "express";
import { getUserProfile, updateSelectedCity, uploadProfilePicture, toggleSavedProperty, getSavedProperties } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}${path.extname(file.originalname)}`); // user_id.ext
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("Images only!");
    }
}

// Get user profile
router.get("/profile", protect, getUserProfile);

// Update selected city
router.put("/city", protect, updateSelectedCity);

// Upload Profile Picture
router.post("/profile-picture", protect, upload.single("image"), uploadProfilePicture);

// Toggle saved property
router.post("/saved-properties/:propertyId", protect, toggleSavedProperty);

// Get user's saved properties
router.get("/saved-properties", protect, getSavedProperties);

export default router;
