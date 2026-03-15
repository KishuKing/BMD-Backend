const axios = require("axios");

exports.getChatResponse = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    // Using the same model version from your Dart code
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful medical assistant. Provide general medical info and advise professional consultation. User: ${message}`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    // Navigating the response structure to get the text
    const botResponse = response.data.candidates[0].content.parts[0].text;

    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Chatbot Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data || error.message,
    });
  }
};