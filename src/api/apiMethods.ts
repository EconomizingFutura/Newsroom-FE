import axios from "axios";
import {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosHeaders,
} from "axios";
import { API_LIST } from "./endpoints";

const API_BASE_URL = API_LIST.BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleResponseError = (error: unknown): never => {
  console.error("API request error:", error instanceof Error ? error : error);
  if (axios.isAxiosError(error)) {
    throw error.response?.data || error;
  }
  throw error;
};

const request = async <T>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  dataOrParams?: unknown,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const axiosConfig: AxiosRequestConfig = { ...config };

    if (method === "get") {
      axiosConfig.params = dataOrParams;
    } else {
      axiosConfig.data = dataOrParams;
      if (dataOrParams instanceof FormData) {
        if (axiosConfig.headers) {
          delete (axiosConfig.headers as Record<string, unknown>)[
            "Content-Type"
          ];
        }
      }
    }

    const response: AxiosResponse<T> = await axiosInstance.request({
      method,
      url,
      ...axiosConfig,
    });

    return response.data;
  } catch (error) {
    return handleResponseError(error);
  }
};

export const GET = <T>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<T> => request<T>("get", url, params, config);

export const POST = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => request<T>("post", url, data, config);

export const PUT = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => request<T>("put", url, data, config);

export const DELETE = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => request<T>("delete", url, undefined, config);

export const PATCH = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => request<T>("patch", url, undefined, config);
