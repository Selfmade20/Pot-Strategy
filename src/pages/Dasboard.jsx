import { UrlState } from "../context";

const Dashboard = () => {
  const { user, loading } = UrlState();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.email || "User"}!</p>
      </div>
    </div>
  );
};

export default Dashboard;