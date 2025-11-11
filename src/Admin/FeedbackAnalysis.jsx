import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { getFeedbackAnalytics } from "../api";

ChartJS.register(ArcElement, Tooltip, Legend);

const FeedbackAnalysis = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingDistribution, setRatingDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [positiveFeedback, setPositiveFeedback] = useState(0);
  const [negativeFeedback, setNegativeFeedback] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const data = await getFeedbackAnalytics();
        
        // Ensure data exists and has proper structure
        if (!data) {
          throw new Error("No data received from server");
        }

        // Handle different possible data structures
        const feedbackData = Array.isArray(data.feedback) ? data.feedback : 
                           Array.isArray(data.recentFeedback) ? data.recentFeedback : 
                           Array.isArray(data) ? data : [];
        
        setFeedbackList(feedbackData);
        
        // Set rating distribution with fallbacks
        const distribution = data.rating_distribution || 
                           data.ratingDistribution || 
                           (data.ratings ? data.ratings : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        
        setRatingDistribution({
          1: distribution[1] || 0,
          2: distribution[2] || 0,
          3: distribution[3] || 0,
          4: distribution[4] || 0,
          5: distribution[5] || 0
        });

        // Calculate positive/negative feedback if not provided
        const positive = data.positive || data.positiveFeedback || 
                       feedbackData.filter(f => f.rating >= 4).length;
        const negative = data.negative || data.negativeFeedback || 
                        feedbackData.filter(f => f.rating <= 2).length;
        
        setPositiveFeedback(positive);
        setNegativeFeedback(negative);
        
        // Set average rating with fallback calculation
        const avgRating = data.averageRating || data.average_rating || 
                         (feedbackData.length > 0 ? 
                          (feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackData.length).toFixed(1) : 
                          0);
        
        setAverageRating(avgRating);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch feedback data. Please try again later.");
        // Reset to empty state
        setFeedbackList([]);
        setRatingDistribution({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        setPositiveFeedback(0);
        setNegativeFeedback(0);
        setAverageRating(0);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const calculateRatingPercentages = () => {
    try {
      const total = Object.values(ratingDistribution).reduce((sum, value) => sum + value, 0);
      if (total === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      return {
        1: Math.round((ratingDistribution[1] / total) * 100),
        2: Math.round((ratingDistribution[2] / total) * 100),
        3: Math.round((ratingDistribution[3] / total) * 100),
        4: Math.round((ratingDistribution[4] / total) * 100),
        5: Math.round((ratingDistribution[5] / total) * 100),
      };
    } catch (error) {
      console.error("Error calculating rating percentages:", error);
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
  };

  const calculateSentimentPercentages = () => {
    try {
      const total = positiveFeedback + negativeFeedback;
      if (total === 0) return { positive: 0, negative: 0 };

      return {
        positive: Math.round((positiveFeedback / total) * 100),
        negative: Math.round((negativeFeedback / total) * 100),
      };
    } catch (error) {
      console.error("Error calculating sentiment percentages:", error);
      return { positive: 0, negative: 0 };
    }
  };

  const ratingPercentages = calculateRatingPercentages();
  const sentimentPercentages = calculateSentimentPercentages();

  const ratingChartData = {
    labels: [
      `1 Star (${ratingPercentages[1]}%)`,
      `2 Stars (${ratingPercentages[2]}%)`,
      `3 Stars (${ratingPercentages[3]}%)`,
      `4 Stars (${ratingPercentages[4]}%)`,
      `5 Stars (${ratingPercentages[5]}%)`,
    ],
    datasets: [
      {
        data: Object.values(ratingDistribution),
        backgroundColor: [
          "#FF6384",
          "#FF9F40",
          "#FFCD56",
          "#4BC0C0",
          "#36A2EB",
        ],
        hoverBackgroundColor: [
          "#E55373",
          "#E58F30",
          "#E5BD46",
          "#3BB0B0",
          "#2692D2",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const sentimentChartData = {
    labels: [
      `Positive (${sentimentPercentages.positive}%)`,
      `Negative (${sentimentPercentages.negative}%)`,
    ],
    datasets: [
      {
        data: [positiveFeedback, negativeFeedback],
        backgroundColor: ["#4BC0C0", "#FF6384"],
        hoverBackgroundColor: ["#3BB0B0", "#E55373"],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading feedback data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Customer Feedback Analytics</h1>
          <p className="text-center mt-2 opacity-90">
            Insights from customer ratings and feedback
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Feedback</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {feedbackList.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Rating</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {averageRating} <span className="text-xl">/ 5</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sentiment Ratio</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {positiveFeedback}:{negativeFeedback}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Rating Distribution
            </h3>
            <div className="h-80">
              <Pie data={ratingChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Feedback Sentiment
            </h3>
            <div className="h-80">
              <Pie data={sentimentChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Detailed Feedback
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedbackList.length > 0 ? (
                    feedbackList.map((feedback, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {feedback.user_id || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {feedback.feedback || 'No feedback text'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              (feedback.rating || 0) >= 4
                                ? "bg-green-100 text-green-800"
                                : (feedback.rating || 0) <= 2
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {feedback.rating || 0} Stars
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.created_at ? new Date(feedback.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No feedback available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Restaurant Feedback Analytics</p>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackAnalysis;