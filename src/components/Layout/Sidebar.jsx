import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../constants';

// SVG Icon Components
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LeaveRequestIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ApprovalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EmployeesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const DepartmentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const LeaveTypeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, hasAnyRole, logout } = useAuth();
  
  console.log('Sidebar user:', user);

          const allMenuItems = [
            { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon />, roles: null },
            { path: '/leave-requests', label: 'İzin Talepleri', icon: <LeaveRequestIcon />, roles: null },
            { path: '/approvals', label: 'Bekleyen Onaylar', icon: <ApprovalIcon />, roles: [UserRole.Admin, UserRole.HrManager, UserRole.DepartmentManager] },
            { path: '/employees', label: 'Çalışanlar', icon: <EmployeesIcon />, roles: [UserRole.Admin, UserRole.HrManager] },
            { path: '/departments', label: 'Departmanlar', icon: <DepartmentIcon />, roles: [UserRole.Admin, UserRole.HrManager] },
            { path: '/leave-types', label: 'İzin Türleri', icon: <LeaveTypeIcon />, roles: [UserRole.Admin, UserRole.HrManager] },
          ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    !item.roles || hasAnyRole(item.roles)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed lg:sticky lg:top-0 top-0 left-0 z-50 lg:h-screen h-full bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-2xl lg:w-72 ${
        isOpen ? 'w-full h-screen' : 'w-full lg:w-72'
      } transition-transform duration-500 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-y-0' : 'translate-y-[-100%] lg:translate-y-0'
      } overflow-hidden`}>
        <div className="p-8 h-full flex flex-col">
          {/* Header with Toggle Button */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              {/* Toggle Button */}
              <button
                onClick={onClose}
                className="lg:hidden text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Logo/Title */}
            <h1 className="text-xl font-bold text-white text-center tracking-wide">
              İzin Sistemi
            </h1>
            <div className="w-16 h-1 bg-white mx-auto mt-3 rounded-full"></div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-5 py-4 text-sm font-medium transition-all duration-300 rounded-2xl relative ${
                  location.pathname === item.path
                    ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700 hover:transform hover:scale-105'
                }`}
              >
                {/* Icon */}
                <div className={`mr-4 transition-transform duration-300 ${
                  location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
                
                {/* Label */}
                <span className="font-semibold tracking-wide">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* User Section */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-4 border border-gray-600">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-white font-semibold text-sm">{user?.username || 'Kullanıcı'}</p>
                  <p className="text-gray-400 text-xs">{user?.roleName || 'Rol'}</p>
                  <p className="text-gray-500 text-xs">{user?.departmentName || 'Departman'}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Çıkış Yap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
