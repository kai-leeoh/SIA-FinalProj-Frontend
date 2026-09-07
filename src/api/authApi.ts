import axios from "axios";

const API_BASE = "https://sia-finalproj-backend.onrender.com";

export const signup = async (email: string, password: string): Promise<string> => {
  const res = await axios.post(`${API_BASE}/auth/signup`, { email, password });
  return res.data.access_token;
};

export const googleLogin = async (credential: string): Promise<string> => {
  const res = await axios.post(`${API_BASE}/auth/google`, { credential });
  return res.data.access_token;
};

export const login = async (email: string, password: string): Promise<string> => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);

  const res = await axios.post(`${API_BASE}/auth/login`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data.access_token;
};
