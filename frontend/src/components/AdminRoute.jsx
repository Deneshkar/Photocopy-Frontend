import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return token && user?.role === "admin" ? children : <Navigate to="/" />;
}

export default AdminRoute;
