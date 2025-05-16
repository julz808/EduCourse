
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-yellow-300 p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-9xl font-bold text-white mb-6">404</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <p className="text-2xl text-gray-700 font-semibold">
            This is not the web page you are looking for.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
        
        <p className="mt-8 text-gray-700">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
