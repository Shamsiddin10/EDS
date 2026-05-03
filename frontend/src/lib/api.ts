export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}')?.token : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};
