import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { logoutClient } from "./logout";

export const API_URL = import.meta.env.VITE_API_URL;

// /client-auth/* (login/refresh/logout) and /portal/* (invitations, me)
// now exist on time_sheet_server — Milestone 1. This is the client-portal
// equivalent of work.wk's customFetch.ts, which hits /auth/* (staff).
// Deliberately a different namespace, not /auth/*: a client token must
// never be accepted by a staff-only endpoint or vice versa (both sides
// now enforce this server-side too). /portal/bookings|quotes|invoices
// are still Milestone 2+ — see CLIENT_PORTAL_FIGMA_BRIEF.md.
const customFetch = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const AUTH_ENDPOINTS = [
  "/client-auth/login",
  "/client-auth/refresh",
  "/client-auth/logout",
];

const isAuthEndpoint = (url?: string) =>
  !!url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Single in-flight refresh promise so concurrent 401s (e.g. several
// requests firing right as the access token expires) share one refresh
// call instead of each rotating the refresh token against each other.
let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = customFetch
      .post("/client-auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

customFetch.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      !isAuthEndpoint(config.url)
    ) {
      config._retry = true;

      try {
        await refreshAccessToken();
        return customFetch(config);
      } catch (refreshError) {
        await logoutClient();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default customFetch;
