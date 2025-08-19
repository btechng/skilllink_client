// src/components/api.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000"; // fallback for local dev

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // allows sending cookies if using sessions
});

// Attach JWT token from localStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const registerUser = (data: any) => api.post("/api/auth/register", data);
export const loginUser = (data: any) => api.post("/api/auth/login", data);
export const getCurrentUser = () => api.get("/api/auth/me");
export const updateProfile = (data: any) => api.put("/api/auth/me", data);

// ---------- JOBS ----------
export const createJob = (data: any) => api.post("/api/jobs", data);
export const getJobs = () => api.get("/api/jobs");
export const getJobById = (id: string) => api.get(`/api/jobs/${id}`);
export const applyToJob = (id: string, data: any) =>
  api.post(`/api/jobs/${id}/proposals`, data);

// ---------- PROPOSALS ----------
export const getProposals = (jobId: string) =>
  api.get(`/api/jobs/${jobId}/proposals`);
export const updateProposalStatus = (
  jobId: string,
  proposalId: string,
  status: string
) => api.put(`/api/jobs/${jobId}/proposals/${proposalId}`, { status });

// ---------- PAYMENTS (Paystack Escrow) ----------
export const initPayment = (data: any) => api.post("/api/payments/init", data);
export const verifyPayment = (ref: string) =>
  api.get(`/api/payments/verify/${ref}`);

// ---------- ADMIN (protected routes) ----------
export const getAllUsers = () => api.get("/api/admin/users");
export const getAllJobs = () => api.get("/api/admin/jobs");

export default api;
