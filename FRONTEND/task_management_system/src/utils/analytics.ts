import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/analytics';
const REFRESH_URL = 'http://127.0.0.1:8000/api/v1/refresh';

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('Refresh token not available');
  }

  const response = await axios.post(REFRESH_URL, { token: refreshToken });
  
  const { accessToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  
  return accessToken;
};

export const getProjectAnalytics = async (userId: string | number) => {
  try {
    let accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Access token not available');
    }

    try {
      // Pass the accessToken in the Authorization header
      const response = await axios.get(`${API_URL}/projects?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      // Cast error to an AxiosError type to safely access properties
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          // If access token is expired, try refreshing it
          accessToken = await refreshAccessToken();
          const retryResponse = await axios.get(`${API_URL}/projects?user_id=${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return retryResponse.data;
        }
      }
      throw error; // Rethrow other errors if not handled
    }
  } catch (error) {
    // Handle unknown error types safely
    if (error instanceof Error) {
      console.error('Error fetching project analytics:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};

export const getTaskAnalytics = async (userId: string | number) => {
  try {
    let accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Access token not available');
    }

    try {
      // Pass the accessToken in the Authorization header
      const response = await axios.get(`${API_URL}/tasks?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      // Cast error to an AxiosError type to safely access properties
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          // If access token is expired, try refreshing it
          accessToken = await refreshAccessToken();
          const retryResponse = await axios.get(`${API_URL}/tasks?user_id=${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return retryResponse.data;
        }
      }
      throw error; // Rethrow other errors if not handled
    }
  } catch (error) {
    // Handle unknown error types safely
    if (error instanceof Error) {
      console.error('Error fetching project analytics:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};
