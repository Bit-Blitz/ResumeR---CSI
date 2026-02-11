import { useState, useEffect } from "react";
import { Rocket } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 2000); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10 w-full max-w-md px-6">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Initializing Analysis Engine
          </h1>
          <p className="text-gray-500 text-xs capitalize tracking-[0.2em] mt-2 font-bold">
            Optimizing Professional Profile
          </p>
        </div>

        {/* Sleek Minimalist Progress Bar */}
        <div className="relative h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300"
            style={{ 
              animation: 'progress-loading 3s ease-in-out infinite'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
