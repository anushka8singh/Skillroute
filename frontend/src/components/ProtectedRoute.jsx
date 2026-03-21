import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Client-side protection checks whether a JWT exists before rendering private pages.
  const token = localStorage.getItem("token");

  if (!token) {
    // Unauthenticated users are redirected to login instead of seeing dashboard content.
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
