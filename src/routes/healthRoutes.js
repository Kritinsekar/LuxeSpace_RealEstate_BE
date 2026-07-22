const express = require("express");
const router = express.Router();

const { healthCheck } = require("../controller/healthController");

router.get("/health", healthCheck); //controller healthCheck

module.exports = {healthRouter:router};