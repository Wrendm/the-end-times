import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

type RefreshResponse = {
  data: {
    token: string;
  };
};

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

// response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;

    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    // optional safe logging (only real errors)
    if (error.response) {
      console.log("API ERROR:", {
        url: config?.url,
        method: config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    }

    if (!config || !error.response) {
      return Promise.reject(error);
    }

    const is401 = error.response.status === 401;

    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/refresh") ||
      config.url?.includes("/auth/logout");

    const isDeleteRequest = config.method?.toLowerCase() === "delete";

    if (is401 && !config._retry && !isAuthRoute) {
      config._retry = true;

      if (isRefreshing) {
        if (isDeleteRequest) {
          return Promise.reject(error);
        }

        return new Promise((resolve) => {
          queue.push((token: string) => {
            const retryConfig = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${token}`,
              },
            };

            resolve(api(retryConfig));
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

        const retryConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          },
        };

        return api(retryConfig);
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