import axios from "axios";
import { setAccessToken } from "./tokenStorage";
import { getAccessToken } from "./tokenStorage";
import { redirectToLogin } from "../utils/redirect";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const prevRequest = error.config;

    if (
      error.response?.status === 401 &&
      !prevRequest._retry &&
      !prevRequest.url?.includes("/auth/refresh") &&
      !prevRequest.url?.includes("/auth/login") &&
      !prevRequest.url?.includes("/auth/register")
    ) {
      prevRequest._retry = true;

      try {
        const res = await api.get("/auth/refresh");
        const newToken = res.data.data.token;

        setAccessToken(newToken);

        prevRequest.headers = {
          ...prevRequest.headers,
          Authorization: `Bearer ${newToken}`
        };

        return api(prevRequest);
      } catch {
        setAccessToken(null);
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default api;