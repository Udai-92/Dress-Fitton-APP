
import React, { useRef } from 'react';
import UploadIcon from './icons/UploadIcon';
import type { UploadedFile } from '../types';
import { fileToBase64 } from '../utils/imageUtils';

interface ImageUploaderProps {
  id: string;
  title: string;
  onFileSelect: (file: UploadedFile) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onFileSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        onFileSelect({ file, base64, mimeType });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("There was an error processing your file.");
      }
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <div
        onClick={handleAreaClick}
        className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Click to upload an image</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
