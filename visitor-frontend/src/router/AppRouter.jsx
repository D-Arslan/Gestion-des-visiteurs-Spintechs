import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ServiceList from "../pages/ServiceList";
import Visites from "../pages/Visites";
import VisitorInfo from "../pages/VisitorInfo";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";
import useAuthStore from "../store/authStore"; // ✅ correct import

export default function AppRouter() {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token;

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visites"
          element={
            <ProtectedRoute>
              <Visites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visiteurs"
          element={
            <ProtectedRoute>
              <VisitorInfo />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
