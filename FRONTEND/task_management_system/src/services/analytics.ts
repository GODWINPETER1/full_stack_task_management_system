import axios from 'axios';

// Define API endpoint for analytics
const API_URL = 'http://127.0.0.1:8000/api/v1/analytics';

// Fetch project analytics
export const fetchProjectAnalytics = async (userId: number) => {
  try {
    console.log("Fetching project analytics for user ID:", userId); // Log userId for debugging
    const response = await axios.get(`${API_URL}/projects`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project analytics:", error);
    throw error;
  }
};


// Fetch task analytics
export const fetchTaskAnalytics = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
      params: { user_id: userId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task analytics:", error);
    throw error;
  }
};
