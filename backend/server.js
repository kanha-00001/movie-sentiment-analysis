const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port =process.env.PORT || 5000;
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
        model: 'deepseek-r1-distill-llama-70b',
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
        },
        timeout: 10000
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    return {
      sentiment: result.sentiment,
      explanation: result.explanation
    };
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    return {
      sentiment: 'Neutral',
      explanation: 'Unable to analyze sentiment due to API error. Please try again later or check your API key.'
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

// New endpoint to fetch recommendations based on review history
app.get('/recommendations', (req, res) => {
  db.all(`SELECT review_text, sentiment FROM reviews ORDER BY timestamp DESC`, (err, rows) => {
    if (err) {
      console.error('Error fetching reviews:', err.message);
      return res.status(500).json({ error: 'Failed to fetch recommendations' });
    }

    if (rows.length === 0) {
      return res.json({ recommendations: ['No recommendations available yet. Submit a review to get started!'] });
    }

    // Simple recommendation logic based on sentiment
    const recommendations = rows.map(row => {
      if (row.sentiment === 'Positive') {
        return `Based on your positive review "${row.review_text}", you might enjoy "The Shawshank Redemption" or "Inception".`;
      } else if (row.sentiment === 'Negative') {
        return `Based on your negative review "${row.review_text}", you might prefer "The Dark Knight" or "Parasite".`;
      }
      return `Based on your neutral review "${row.review_text}", consider "Pulp Fiction" or "The Grand Budapest Hotel".`;
    });

    res.json({ recommendations });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});