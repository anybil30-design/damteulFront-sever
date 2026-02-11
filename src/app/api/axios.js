import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9070",
  timeout: 10000, // 10초
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;