import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

type RefreshResponse = {
  data: {
    token: string;
  };
};

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

// expose setter for login
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// attach token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// refresh logic
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;

    if (!config || !error.response) {
      return Promise.reject(error);
    }

    const is401 = error.response.status === 401;
    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/refresh") ||
      config.url?.includes("/auth/logout");

    if (is401 && !config._retry && !isAuthRoute) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(api(config));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await api.get<RefreshResponse>("/auth/refresh");

        const newToken = res.data.data.token;

        accessToken = newToken;

        queue.forEach((cb) => cb(newToken));
        queue = [];

        config.headers.Authorization = `Bearer ${newToken}`;

        return api(config);
      } catch (err) {
        queue = [];
        accessToken = null;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;