import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, Zap, ShieldCheck, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UrlState } from "../context";
import { createShortLink } from "../db/apiLinks";
import { generateShortUrl } from "../config";
import Toast from "../components/Toast";

const Home = () => {
  const [longUrl, setLongUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();
  const { isAuthenticated, user } = UrlState();

  const handleCreateLink = async (url) => {
    setIsCreating(true);
    
    try {
      console.log('Creating link for user:', user.id, 'URL:', url);
      const newLink = await createShortLink(user.id, url);
      
      // Format the response to match our component expectations
      const formattedLink = {
        id: newLink.id,
        originalUrl: newLink.original_url,
        shortUrl: generateShortUrl(newLink.short_code),
        clicks: newLink.clicks,
        createdAt: newLink.created_at,
      };
      
      setIsCreating(false);
      return formattedLink;
    } catch (error) {
      setIsCreating(false);
      throw error;
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    if (isAuthenticated) {
      // User is logged in, create the link directly
      try {
        const newLink = await handleCreateLink(longUrl);
        setCreatedLink(newLink);
        setLongUrl(""); // Clear the input
      } catch (error) {
        console.error("Error creating link:", error);
        setToast({ show: true, message: `Failed to create link: ${error.message || error}`, type: 'error' });
      }
    } else {
      // User is not logged in, redirect to auth page
      navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
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

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Lightning Fast",
      description:
        "Generate short URLs instantly with our optimized infrastructure.",
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-white" />,
      title: "Detailed Analytics",
      description:
        "Track clicks, locations, and engagement with comprehensive analytics.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: "Always Reliable",
      description:
        "99.9% uptime guarantee ensures your links work when you need them.",
    },
  ];

  // Show different content for authenticated users
  if (isAuthenticated) {
    return (
      <section className="bg-[oklch(98.41%_0.006_293.63)] min-h-screen">
        <Toast 
          message={toast.message}
          isVisible={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          type={toast.type}
        />
        <div className="container mx-auto px-4 sm:px-8 max-w-screen-xl">
          {/* Welcome Section */}
          <div className="text-center pt-6 sm:pt-10 pb-6 sm:pb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-3 sm:mb-4">
              Welcome back, {user?.email || "User"}!
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Create your next short link and track its performance
            </p>
          </div>

          {/* Link Creation Section */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Create New Short Link
                </h3>
                
                {!createdLink ? (
                  <form onSubmit={handleShorten} className="space-y-4">
                    <Input
                      type="url"
                      value={longUrl}
                      placeholder="Enter your long URL here..."
                      onChange={(e) => setLongUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-purple-50 text-lg text-gray-700"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isCreating || !longUrl}
                      className="w-full px-8 py-3 rounded-xl bg-gradient-to-tr from-purple-500 to-purple-400 text-white font-semibold text-lg shadow hover:from-purple-600 hover:to-purple-500 transition-colors disabled:opacity-50"
                    >
                      {isCreating ? "Creating..." : "Create Short Link"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <CheckCircle size={20} />
                      <span className="font-semibold">Link created successfully!</span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Original URL:</span>
                        <ExternalLink size={16} className="text-gray-400" />
                      </div>
                      <p className="text-gray-900 text-sm break-all mb-4 line-clamp-2 hover:line-clamp-none transition-all duration-200 cursor-pointer" 
                         title={createdLink.originalUrl}>
                        {createdLink.originalUrl}
                      </p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Short Link:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(createdLink.shortUrl)}
                          className="h-6 px-2"
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                      <p className="text-purple-600 font-semibold text-base sm:text-lg break-all">
                        {createdLink.shortUrl}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => {
                          setCreatedLink(null);
                          setLongUrl("");
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Create Another Link
                      </Button>
                      <Button
                        onClick={() => navigate("/dashboard")}
                        className="flex-1 bg-gradient-to-tr from-purple-500 to-purple-400 text-white"
                      >
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>


        </div>
      </section>
    );
  }

  // Original content for non-authenticated users
  return (
    <section className="bg-[oklch(98.41%_0.006_293.63)] ">
      <div className="container mx-auto px-4 sm:px-8 max-w-screen-xl">
        <h2 className="mt-10 mb-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold text-center text-purple-500">
          Shorten Your URLs
        </h2>
        <p className="mx-auto mb-12 text-center text-gray-400 text-lg sm:text-xl max-w-2xl">
          Transform long, unwieldy URLs into short, shareable links that are
          perfect for social media, emails, and anywhere you need clean,
          professional links.
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-screen-xl flex justify-center mb-16">
        <form
          onSubmit={handleShorten}
          className="flex flex-col sm:flex-row w-full max-w-2xl bg-white rounded-2xl shadow-md p-4 items-stretch sm:items-center gap-4"
        >
          <Input
            type="url"
            value={longUrl}
            placeholder="Enter your long URL here..."
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full sm:flex-grow px-4 py-3 rounded-xl border border-purple-200 bg-purple-50 text-lg text-gray-700"
          />
          <Button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 min-w-[160px] rounded-full bg-gradient-to-tr from-purple-500 to-purple-400 text-white font-semibold text-lg shadow hover:from-purple-600 hover:to-purple-500 transition-colors text-center"
          >
            Shorten
          </Button>
        </form>
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-screen-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="text-center shadow-md rounded-xl">
              <CardContent className="flex flex-col items-center py-10 px-6 space-y-4">
                <div className="bg-gradient-to-tr from-purple-500 to-purple-400 p-4 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
