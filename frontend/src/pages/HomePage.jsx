import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [review, setReview] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/analyze', { review });
      navigate('/results', {
        state: {
          sentiment: response.data.sentiment,
          explanation: response.data.explanation,
          review,
        },
      });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      alert('Failed to analyze review. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-8 drop-shadow-md text-center">
        🎬 Movie Review Sentiment Analysis
      </h1>

      <div className="w-full max-w-lg bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-200">
        <form onSubmit={handleSubmit}>
          <label htmlFor="review" className="block text-lg font-semibold text-gray-700 mb-2">
            Enter Your Movie Review:
          </label>
          <textarea
            id="review"
            className="w-full p-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            rows="6"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="E.g., I loved the cinematography and the acting was top-notch!"
            required
          ></textarea>
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg"
          >
            🔍 Analyze Sentiment
          </button>
        </form>
        <button
          onClick={() => navigate('/recommendations')}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg"
        >
          🌟 View Recommendations
        </button>
      </div>
    </div>
  );
}

export default HomePage;