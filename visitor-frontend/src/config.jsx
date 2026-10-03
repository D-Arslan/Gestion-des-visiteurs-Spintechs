const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8060";

const config = {
  apiUrl: `${baseUrl}/api`,
  publicUrl: baseUrl,
};

export default config;