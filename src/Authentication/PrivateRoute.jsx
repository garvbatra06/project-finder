// src/Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ user, children }) {
  if (!user) {
    // Not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }
  return children;
}
