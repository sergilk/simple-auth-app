const importURL = import.meta.env.VITE_API_URL;
if (!importURL) {
  console.log(
    "\x1b[33m",
    `.env not configured or missing. Using default API URL: "http://localhost:3000"`
  );
}
const BASE_URL = importURL || "http://localhost:3000";

export const API_URL = path => `${BASE_URL}${path}`;
