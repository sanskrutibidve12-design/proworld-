import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ✅ Public APIs (NO TOKEN)
  const publicUrls = ["/domains/", "/courses/", "/colleges/", "/applications/"];

  const isPublic = publicUrls.some((url) =>
    config.url?.includes(url)
  );

  // ✅ Attach token ONLY for private APIs
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;