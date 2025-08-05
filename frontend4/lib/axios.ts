import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
