import { useState } from "react";
import { UrlState } from "../context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link, TrendingUp, Star, BarChart3, Home, Plus, ExternalLink, Copy, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRealtimeLinks } from "../hooks/useRealtimeLinks";
import { deleteLink, trackLinkClick } from "../db/apiLinks";
import { generateShortUrl } from "../config";
import Toast from "../components/Toast";

const Dashboard = () => {
  const { user, loading } = UrlState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createNewUrl = searchParams.get("createNew");

  // Use real-time data hook
  const { links, stats, analytics, loading: dataLoading, error, refreshData, setLinks, setStats } = useRealtimeLinks(user?.id);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        console.log('Delete request - Link ID:', linkId, 'User ID:', user?.id);
        
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        
        await deleteLink(linkId, user.id);
        
        // Immediately update the UI by removing the deleted link
        setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
        
        // Update stats immediately
        setStats(prevStats => ({
          ...prevStats,
          totalLinks: prevStats.totalLinks - 1
        }));
        
        setToast({ show: true, message: 'Link deleted successfully!', type: 'success' });
        
        // Also refresh data to ensure everything is in sync
        refreshData();
      } catch (error) {
        console.error('Error deleting link:', error);
        setToast({ show: true, message: 'Failed to delete link. Please try again.', type: 'error' });
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ show: true, message: 'Link copied to clipboard!', type: 'success' });
    } catch (error) {
      console.error("Failed to copy:", error);
      setToast({ show: true, message: 'Failed to copy link', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
      <Toast 
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        type={toast.type}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ShortLink Dashboard</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => navigate("/")}
          >
            <Home size={16} />
            Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Welcome Message */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Welcome back, {user?.email || "User"}!
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Here's an overview of your link performance and analytics.
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-tr from-purple-500 to-purple-400 text-white w-full sm:w-auto"
              >
                <Plus size={16} className="mr-2" />
                Create New Link
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

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
                <div className="text-2xl font-bold text-gray-900">
                  {dataLoading ? "..." : stats.totalLinks}
                </div>
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
                  {dataLoading ? "..." : stats.totalClicks.toLocaleString()}
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
                  {dataLoading ? "..." : stats.averageClicks.toLocaleString()}
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
              {dataLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="h-64 relative px-4">
                  {/* Line Chart */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                    
                    {/* Line chart */}
                    {analytics.length > 1 && (
                      <g>
                        {/* Area fill under the line */}
                        <defs>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                        
                        {/* Area path */}
                        <path
                          d={(() => {
                            const points = analytics.map((data, index) => {
                              const x = (index / (analytics.length - 1)) * 90 + 5;
                              const maxClicks = Math.max(...analytics.map(d => d.clicks), 1);
                              const y = 95 - ((data.clicks / maxClicks) * 80);
                              return `${x},${y}`;
                            });
                            return `M ${points[0]} L ${points.slice(1).join(' L ')} L ${points[points.length - 1].split(',')[0]},95 L ${points[0].split(',')[0]},95 Z`;
                          })()}
                          fill="url(#areaGradient)"
                        />
                        
                        {/* Line path */}
                        <path
                          d={analytics.map((data, index) => {
                            const x = (index / (analytics.length - 1)) * 90 + 5;
                            const maxClicks = Math.max(...analytics.map(d => d.clicks), 1);
                            const y = 95 - ((data.clicks / maxClicks) * 80);
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="url(#lineGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Data points */}
                        {analytics.map((data, index) => {
                          const x = (index / (analytics.length - 1)) * 90 + 5;
                          const maxClicks = Math.max(...analytics.map(d => d.clicks), 1);
                          const y = 95 - ((data.clicks / maxClicks) * 80);
                          return (
                            <circle
                              key={index}
                              cx={x}
                              cy={y}
                              r="3"
                              fill="#8b5cf6"
                              stroke="white"
                              strokeWidth="2"
                            />
                          );
                        })}
                      </g>
                    )}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2">
                    {analytics.map((data, index) => (
                      <div key={index} className="text-xs text-gray-500 text-center">
                        {data.date}
                      </div>
                    ))}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
                    {(() => {
                      const maxClicks = Math.max(...analytics.map(d => d.clicks), 1);
                      return [maxClicks, Math.round(maxClicks * 0.75), Math.round(maxClicks * 0.5), Math.round(maxClicks * 0.25), 0].map((value, index) => (
                        <div key={index}>{value}</div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Links Section */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Your Links</CardTitle>
              <CardDescription>
                Manage your shortened links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading your links...</p>
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No links created yet.</p>
                  <p className="text-sm mt-2">Create your first shortened link to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {links.map((link) => (
                    <div key={link.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-100 rounded-lg gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="group relative">
                          <div className="font-medium text-gray-900 text-sm sm:text-base break-all line-clamp-2 hover:line-clamp-none transition-all duration-200 cursor-pointer" 
                               title={link.original_url}>
                            {link.original_url}
                          </div>
                          {/* Tooltip for mobile */}
                          <div className="sm:hidden absolute bottom-full left-0 right-0 bg-gray-900 text-white text-xs p-2 rounded mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            {link.original_url}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-purple-600 break-all mt-1">
                          {generateShortUrl(link.short_code)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <div className="text-right flex-1 sm:flex-none">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            {link.clicks.toLocaleString()} clicks
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {formatDate(link.created_at)}
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generateShortUrl(link.short_code))}
                            className="h-8 w-8 p-0"
                          >
                            <Copy size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                // Track the click first
                                await trackLinkClick(link.short_code);
                                // Then open the URL
                                window.open(link.original_url, '_blank');
                                // Refresh data to show updated click count
                                refreshData();
                              } catch (error) {
                                console.error('Error tracking click:', error);
                                // Still open the URL even if tracking fails
                                window.open(link.original_url, '_blank');
                              }
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;