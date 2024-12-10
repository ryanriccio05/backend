const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// BART-large-CNN Summarization Route
app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    // Using Hugging Face's hosted inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.error) {
      return res.status(500).json({ error: response.data.error });
    }

    res.json({ summary: response.data[0].summary_text });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
