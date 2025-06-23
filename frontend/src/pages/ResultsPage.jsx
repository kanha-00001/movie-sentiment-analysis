import { useLocation, useNavigate } from 'react-router-dom';

function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sentiment, explanation, review } = state || {};

  // Handle case where no data is provided (e.g., direct navigation to /results)
  if (!sentiment || !explanation || !review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Color-code sentiment
  const sentimentColor =
    sentiment === 'Positive' ? 'text-green-600' : sentiment === 'Negative' ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Sentiment Analysis Result</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className={`text-2xl font-semibold mb-4 ${sentimentColor}`}>
          Sentiment: {sentiment}
        </h2>
        <p className="text-gray-700 mb-4"><strong>Review:</strong> {review}</p>
        <p className="text-gray-700 mb-6"><strong>Explanation:</strong> {explanation}</p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Analyze Another Review
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;