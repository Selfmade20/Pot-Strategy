import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UrlState } from "../context";

const Home = () => {
  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();
  const { isAuthenticated } = UrlState();

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    if (isAuthenticated) {
      // User is logged in, redirect to dashboard with the URL
      navigate(`/dashboard?createNew=${encodeURIComponent(longUrl)}`);
    } else {
      // User is not logged in, redirect to auth page
      navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
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
