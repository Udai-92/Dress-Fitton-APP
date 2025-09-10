
import React, { useState, useEffect } from 'react';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const loadingMessages = [
  "Warming up the virtual studio...",
  "Our AI stylist is selecting the perfect fit...",
  "Adjusting the lighting and shadows...",
  "Adding the final magical touches...",
  "This is taking a bit longer than usual, but perfection takes time!"
];

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-10 w-10 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading, error }) => {
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg font-medium text-gray-700">{loadingMessage}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          <h3 className="font-bold">Oops! Something went wrong.</h3>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (imageUrl) {
      return (
        <img src={`data:image/png;base64,${imageUrl}`} alt="Generated try-on" className="w-full h-full object-contain rounded-lg shadow-2xl" />
      );
    }
    return (
      <div className="text-center text-gray-500">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="text-xl font-semibold">Your virtual fitting room awaits</h3>
        <p>Upload your photo and a dress to see the result here.</p>
      </div>
    );
  };
  
  return (
    <div className="w-full min-h-[448px] bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

export default ResultDisplay;
