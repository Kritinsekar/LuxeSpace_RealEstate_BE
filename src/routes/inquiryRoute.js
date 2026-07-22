const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createInquiry,
    getMyInquiries
} = require("../controller/inquiryController");

router.post("/", authMiddleware, createInquiry);

router.get("/my", authMiddleware, getMyInquiries);

module.exports = {
    inquiryRouter: router
};