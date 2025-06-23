const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 5000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./reviews.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_text TEXT NOT NULL,
      sentiment TEXT NOT NULL,
      explanation TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Sentiment analysis using Groq API
async function analyzeSentiment(review) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis tool. Analyze the sentiment of the provided movie review and classify it as "Positive", "Negative", or "Neutral". Provide a brief explanation (1-2 sentences) for the classification. Return the response in JSON format with "sentiment" and "explanation" fields, e.g., {"sentiment": "Positive", "explanation": "The review expresses enthusiasm and satisfaction."}'
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this movie review: "${review}"`
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the JSON content from the response
    const result = JSON.parse(response.data.choices[0].message.content);
    return {
      sentiment: result.sentiment,
      explanation: result.explanation
    };
  } catch (error) {
    console.error('Error calling Groq API:', error.message);
    return {
      sentiment: 'Neutral',
      explanation: 'Unable to analyze sentiment due to API error.'
    };
  }
}

// API endpoint for sentiment analysis
app.post('/analyze', async (req, res) => {
  const { review } = req.body;
  if (!review || typeof review !== 'string') {
    return res.status(400).json({ error: 'Review text is required' });
  }

  const { sentiment, explanation } = await analyzeSentiment(review);

  // Store review in database
  db.run(
    `INSERT INTO reviews (review_text, sentiment, explanation) VALUES (?, ?, ?)`,
    [review, sentiment, explanation],
    (err) => {
      if (err) {
        console.error('Error storing review:', err.message);
      }
    }
  );

  res.json({ sentiment, explanation });
});

// Start server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});