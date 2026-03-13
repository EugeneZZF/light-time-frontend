import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: "http://localhost:4242",
  headers: {
    "Content-Type": "application/json",
  },
});
