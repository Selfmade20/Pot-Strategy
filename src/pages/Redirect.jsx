import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { trackLinkClick } from "../db/apiLinks";

const Redirect = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        setLoading(true);
        console.log('Redirect component: processing shortCode:', id);
        
        // Track the click
        const linkData = await trackLinkClick(id);
        console.log('Link data after tracking:', linkData);
        
        // Redirect to the original URL
        if (linkData && linkData.original_url) {
          console.log('Redirecting to:', linkData.original_url);
          window.location.href = linkData.original_url;
        } else {
          console.error('No original_url in linkData:', linkData);
          setError("Link not found or inactive");
        }
      } catch (error) {
        console.error("Redirect error:", error);
        setError("Link not found or inactive");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      handleRedirect();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/" 
            className="text-purple-600 hover:text-purple-700 underline"
          >
            Go back to homepage
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default Redirect;