// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // Important for session cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
