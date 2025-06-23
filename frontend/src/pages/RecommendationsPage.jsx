import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recommendations');
        setRecommendations(response.data.recommendations);
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-blue-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Loading Recommendations...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-blue-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Recommendations</h1>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-blue-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Recommendations</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {recommendations.length > 0 ? (
          <ul className="list-disc pl-5 mb-6">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-gray-700 mb-2">{rec}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 mb-6">No recommendations available yet.</p>
        )}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default RecommendationsPage;