import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Frontend-side gating is UX only. Real authorization is enforced by the
 * backend on every request regardless of what this component allows through.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
