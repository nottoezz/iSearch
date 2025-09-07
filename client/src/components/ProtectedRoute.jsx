import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

// simple gate to block unauthenticated access
export default function ProtectedRoute({ children }) {
  const { user } = useAuth(); // read current user from auth context
  if (!user) return <Navigate to="/login" replace />; // redirect if not logged in
  return children; // render protected content
}
