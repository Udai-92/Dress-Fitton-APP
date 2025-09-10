
import React, { useState, useCallback } from 'react';
import type { UploadedFile } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import SparklesIcon from './components/icons/SparklesIcon';
import { generateFitOnImage } from './services/geminiService';

const App: React.FC = () => {
  const [userImage, setUserImage] = useState<UploadedFile | null>(null);
  const [dressImage, setDressImage] = useState<UploadedFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserImageSelect = useCallback((file: UploadedFile) => {
    setUserImage(file);
  }, []);

  const handleDressImageSelect = useCallback((file: UploadedFile) => {
    setDressImage(file);
  }, []);

  const handleGenerateClick = async () => {
    if (!userImage || !dressImage) {
      setError("Please upload both your photo and a dress photo.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateFitOnImage(userImage, dressImage);
      setGeneratedImage(resultBase64);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const canGenerate = userImage !== null && dressImage !== null && !isLoading;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">How It Works</h2>
          <p className="mt-2 text-md sm:text-lg text-gray-600 max-w-2xl mx-auto">
            1. Upload a full-body photo of yourself. 2. Upload a photo of a dress. 3. Let our AI work its magic!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <ImageUploader
            id="user-photo"
            title="1. Your Photo"
            onFileSelect={handleUserImageSelect}
            previewUrl={userImage ? URL.createObjectURL(userImage.file) : null}
          />
          <ImageUploader
            id="dress-photo"
            title="2. The Dress"
            onFileSelect={handleDressImageSelect}
            previewUrl={dressImage ? URL.createObjectURL(dressImage.file) : null}
          />
          <div className="lg:col-span-1 flex flex-col items-center gap-6">
             <h3 className="text-xl font-semibold text-gray-800">3. The Result</h3>
            <ResultDisplay
              imageUrl={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <button
                onClick={handleGenerateClick}
                disabled={!canGenerate}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
                <SparklesIcon className="w-6 h-6 mr-3 -ml-1"/>
                {isLoading ? 'Styling in Progress...' : 'Try It On!'}
            </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
