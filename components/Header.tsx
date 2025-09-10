
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dress Fiton
        </h1>
        <span className="ml-3 px-2.5 py-1 bg-pink-100 text-pink-800 text-sm font-medium rounded-full">
          Virtual Try-On
        </span>
      </div>
    </header>
  );
};

export default Header;
