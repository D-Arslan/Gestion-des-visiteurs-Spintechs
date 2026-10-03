import axios from "../config/axiosInstance";

export const loginUser = async ({ username, password }) => {
  const response = await axios.post("/login", { username, password });
  return response.data;
};