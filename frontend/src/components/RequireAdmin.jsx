import { Navigate, useLocation } from "react-router-dom";
import { isAdmin } from "../services/session";

export default function RequireAdmin({ children }) {
  const loc = useLocation();
  if (!isAdmin()) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}
