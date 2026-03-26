import axios from "axios";

const API = axios.create({
  baseURL: "https://splitmate-0a2j.onrender.com/api",
});

// Add token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
