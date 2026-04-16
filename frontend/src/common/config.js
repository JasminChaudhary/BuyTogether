/**
 * Extracts the base URL from VITE_API_URL or defaults to localhost.
 * Doing this ensures we can reach socket.io and image uploads regardless
 * of the deployment environment without breaking the app.
 */

// If VITE_API_URL is "https://buytogether.onrender.com/api"
// API_BASE_URL becomes "https://buytogether.onrender.com"
export const API_BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") 
    : "http://localhost:5000";

// The full endpoint for REST API routes
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Helper function to safely format image URLs coming from the backend.
 * Fixes Windows backslash issues and handles full URLs automatically.
 */
export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // Already a full URL
    
    // Replace Windows backslashes with forward slashes safely
    const safePath = path.replace(/\\/g, '/');
    
    // Ensure no double slashes between base and path
    const cleanPath = safePath.startsWith('/') ? safePath.substring(1) : safePath;
    
    return `${API_BASE_URL}/${cleanPath}`;
};
