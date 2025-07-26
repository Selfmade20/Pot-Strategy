import { Navigate, useLocation } from "react-router-dom";
import { UrlState } from "../context";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = UrlState();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute; 