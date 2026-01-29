export const config = {
    // Uses VITE_SERVER_URL environment variable if set (e.g. in Vercel or .env)
    // Otherwise falls back to constructing URL from current hostname (for local mobile testing)
    SERVER_URL: import.meta.env.VITE_SERVER_URL || `http://${window.location.hostname}:3001`,

    // Environment helpers
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
};
