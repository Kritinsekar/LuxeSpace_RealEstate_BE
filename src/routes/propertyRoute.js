const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getSimilarProperties
} = require("../controller/propertyController");

// Public Routes
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.get("/:id/similar", getSimilarProperties);

// Protected Routes
router.post("/", authMiddleware, createProperty);
router.put("/:id", authMiddleware, updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);

module.exports = {
    propertyRouter: router
};