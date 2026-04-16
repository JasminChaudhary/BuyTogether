const isBrowser = typeof window !== "undefined";
const hostname = isBrowser ? window.location.hostname : "";
const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

// In production, never fall back to localhost unless we are actually local.
const defaultApiUrl = isLocalhost ? "http://localhost:5000/api" : "/api";
export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

// If API_URL is "/api", base becomes empty string (same-origin).
export const API_BASE_URL = API_URL.replace(/\/api\/?$/, "");

/**
 * Helper function to safely format image URLs coming from the backend.
 * Fixes Windows backslash issues and handles full URLs automatically.
 */
export const getImageUrl = (path) => {
    // Some parts of the app may pass an array (e.g. images[]) or a non-string.
    // Normalize to a single string to avoid runtime crashes.
    const value = Array.isArray(path) ? path[0] : path;
    if (!value || typeof value !== "string") return "";

    if (value.startsWith("http")) return value; // Already a full URL

    // Replace Windows backslashes with forward slashes safely
    const safePath = value.replace(/\\/g, "/");

    // Ensure no double slashes between base and path
    const cleanPath = safePath.startsWith('/') ? safePath.substring(1) : safePath;

    return `${API_BASE_URL}/${cleanPath}`;
};
