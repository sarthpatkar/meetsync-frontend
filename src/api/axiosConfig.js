// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ✅ Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Image generation API call
export const generateImage = async (prompt) => {
  try {
    const response = await api.post("/ai/generate-image", { prompt });
    return response.data; // { image: "base64string..." }
  } catch (error) {
    console.error("Image generation failed:", error.response?.data || error.message);
    throw error;
  }
};

export default api;