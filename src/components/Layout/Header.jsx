import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">İzin Sistemi</h1>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/leave-requests" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              İzin Talepleri
            </Link>
            <Link 
              to="/approvals" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Onaylar
            </Link>
            <Link 
              to="/employees" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Çalışanlar
            </Link>
            <Link 
              to="/leave-types" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              İzin Türleri
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Hoş geldiniz, <span className="font-medium">Admin</span>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Çıkış
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
