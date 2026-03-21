import axios from "axios";

// Create one shared Axios instance so every component uses the same base API URL.
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  // Get token from localStorage so authenticated requests can be sent.
  const token = localStorage.getItem("token");

  if (token) {
    // This interceptor automatically attaches the token to every API request.
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

// Helper methods keep request details out of components and make the data flow easier to follow.
API.getLearningPaths = () => API.get("/path");
API.createLearningPath = (payload) => API.post("/path", payload);
API.completeStep = (pathId, stepIndex) => API.patch(`/step/${pathId}/${stepIndex}`);
API.deleteLearningPath = (pathId) => API.delete(`/path/${pathId}`);
API.updateNickname = (nickname) => API.patch("/auth/nickname", { nickname });

export default API;
