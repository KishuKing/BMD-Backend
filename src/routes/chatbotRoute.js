const express = require("express");
const router = express.Router();
const { getChatResponse } = require("../controllers/chatbotController");

// This will be accessible at /api/chatbot/chat
router.post("/chat", getChatResponse);

module.exports = router;