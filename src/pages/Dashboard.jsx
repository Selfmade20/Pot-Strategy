import { UrlState } from "../context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link, TrendingUp, Star, BarChart3, Home, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = UrlState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createNewUrl = searchParams.get("createNew");

  // Mock data - replace with real data from your API
  const dashboardData = {
    totalLinks: 4,
    totalClicks: 4638,
    averageClicks: 1160,
    analytics: [
      { date: "Mon", clicks: 45 },
      { date: "Tue", clicks: 90 },
      { date: "Wed", clicks: 135 },
      { date: "Thu", clicks: 180 },
      { date: "Fri", clicks: 150 },
      { date: "Sat", clicks: 120 },
      { date: "Sun", clicks: 95 },
    ]
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ShortLink Dashboard</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Home size={16} />
            Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Message */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome back, {user?.email || "User"}!
                </h2>
                <p className="text-gray-600">
                  Here's an overview of your link performance and analytics.
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-tr from-purple-500 to-purple-400 text-white"
              >
                <Plus size={16} className="mr-2" />
                Create New Link
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Links Card */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Links
                </CardTitle>
                <Link className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.totalLinks}</div>
                <p className="text-xs text-gray-500 mt-1">Active short links</p>
              </CardContent>
            </Card>

            {/* Total Clicks Card */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Clicks
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.totalClicks.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">All time clicks</p>
              </CardContent>
            </Card>

            {/* Average Clicks Card */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Clicks
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.averageClicks.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Per link</p>
              </CardContent>
            </Card>
          </div>

          {/* Click Analytics Chart */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Click Analytics
              </CardTitle>
              <CardDescription>
                Track your link performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {dashboardData.analytics.map((data, index) => {
                  const maxClicks = Math.max(...dashboardData.analytics.map(d => d.clicks));
                  const height = (data.clicks / maxClicks) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="text-xs text-gray-500">{data.clicks}</div>
                      <div 
                        className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-500">{data.date}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Links Section */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Recent Links</CardTitle>
              <CardDescription>
                Your most recently created short links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock recent links - replace with real data */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">youtube.com/watch?v=example</div>
                    <div className="text-sm text-purple-600">short.ly/abc123</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">1,234 clicks</div>
                    <div className="text-sm text-gray-500">Created 2 days ago</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">github.com/username/repo</div>
                    <div className="text-sm text-purple-600">short.ly/def456</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">856 clicks</div>
                    <div className="text-sm text-gray-500">Created 5 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;