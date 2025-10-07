import React from 'react';

const StatsCard = ({ title, value, icon, isDark = false }) => {
  const cardClasses = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700' 
    : 'bg-white border border-gray-200';
  
  const textClasses = isDark 
    ? 'text-white' 
    : 'text-gray-900';
    
  const subtitleClasses = isDark 
    ? 'text-gray-400' 
    : 'text-gray-600';

  return (
    <div className={`${cardClasses} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} ${isDark ? 'text-white' : 'text-gray-600'}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className={`text-sm font-medium ${subtitleClasses}`}>{title}</p>
          <p className={`text-2xl font-bold ${textClasses}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
