import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore"; // ✅ unified store

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}
