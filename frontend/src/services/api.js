import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

API.getLearningPaths = () => API.get("/path");
API.createLearningPath = (payload) => API.post("/path", payload);
API.completeStep = (pathId, stepIndex) => API.patch(`/step/${pathId}/${stepIndex}`);
API.deleteLearningPath = (pathId) => API.delete(`/path/${pathId}`);

export default API;
