# Sentiment Analysis Tool for Movie Reviews

This project is a web-based sentiment analysis tool for movie reviews, built as part of the Zero To One Internship Round 1 Task. It analyzes user-submitted reviews using the Groq API and provides recommendations based on sentiment history.

## Features
- **Sentiment Analysis**: Classifies reviews as Positive (green), Negative (red), or Neutral (yellow) using Groq's `llama3-8b-8192` model.
- **Frontend**: Responsive React app with Tailwind CSS, featuring a Home Page for input, Results Page for analysis, and Recommendations Page.
- **Backend**: Node.js with Express, integrating Groq API and SQLite for storing reviews and generating recommendations.
- **Recommendations**: Suggests movies based on review sentiment history.
- **Styling**: Modern design with gradient backgrounds, blurred cards, and color-coded sentiments.

## Technologies Used
- **Frontend**: React, React Router, Axios, Tailwind CSS, Vite
- **Backend**: Node.js, Express, SQLite (`sqlite3`), Axios, dotenv
- **API**: Groq API (`llama3-8b-8192` model) for sentiment analysis
- **Database**: SQLite for storing review data

## Prerequisites
- **Node.js**: v18 or later
- **npm**: For package management
- **Groq API Key**: Sign up at [Groq Cloud](https://console.groq.com/) to get a free API key

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sentiment-analysis-tool.git
cd sentiment-analysis-tool
```

### 2. Backend Setup
- Navigate to the `backend` directory:
  ```bash
  cd backend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file in the `backend` directory with your Groq API key:
  ```
  GROQ_API_KEY=your_groq_api_key_here
  ```
- Start the backend server:
  ```bash
  npx nodemon server.js
  ```
  The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
- Open a new terminal and navigate to the `frontend` directory:
  ```bash
  cd frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the development server:
  ```bash
  npm run dev
  ```
  The frontend will run on `http://localhost:5173` (or as specified by Vite).

## Usage
1. Open your browser and go to `http://localhost:5173`.
2. Enter a movie review in the textarea on the Home Page and click "Analyze Sentiment".
3. View the sentiment result (colored Positive, Negative, or Neutral), review, and explanation on the Results Page.
4. Click "View Recommendations" on the Home or Results Page to see movie suggestions based on your review history.
5. Use the navigation buttons to return to the Home Page or analyze another review.

## Running the Application
- Ensure both the backend and frontend servers are running in separate terminals.
- Submit a review (e.g., "I loved the movie Pursuit of Happiness") to test sentiment analysis.
- Check the Recommendations Page after submitting at least one review.

## Troubleshooting
- **401 Unauthorized Error**: If you see "Error calling Groq API: Request failed with status code 401", verify your `GROQ_API_KEY` in the `.env` file is correct and active. Restart the server after updating the key.
- **CORS Issues**: Ensure the backend is running and accessible at `http://localhost:5000`.
- **Database Errors**: Check the `reviews.db` file in the `backend` directory for stored data.

