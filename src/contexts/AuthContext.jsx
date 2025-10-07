import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      
      console.log('Login response:', response);
      
      // Store only token
      localStorage.setItem('token', response.token);
      
      // Decode token to get user info
      const userInfo = decodeToken(response.token);
      console.log('Decoded user info:', userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setUser(userInfo);
      console.log('User state set to:', userInfo);
      return { success: true, data: response };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Giriş yapılırken hata oluştu' 
      };
    }
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      console.log('Decoded token payload:', payload);
      
      // Correct claim names based on JWT token structure
      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      const roleName = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const roleId = payload.RoleId;
      const employeeId = payload.EmployeeId;
      const departmentId = payload.DepartmentId;
      const departmentName = payload.DepartmentName;
      const employeeName = payload.EmployeeName;
      const isActive = payload.IsActive === 'True';
      
      console.log('Parsed values:', {
        userId, username, email, roleName, roleId, 
        employeeId, departmentId, departmentName, employeeName, isActive
      });
      
      return {
        userId: userId ? parseInt(userId) : 0,
        username: username || '',
        email: email || '',
        roleName: roleName || '',
        roleId: roleId ? parseInt(roleId) : 0,
        employeeId: employeeId ? parseInt(employeeId) : 0,
        departmentId: departmentId ? parseInt(departmentId) : 0,
        departmentName: departmentName || '',
        employeeName: employeeName || '',
        isActive: isActive,
        lastLoginDate: new Date(payload.exp * 1000)
      };
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.roleName === requiredRole;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.roleName);
  };

  const getUserId = () => {
    return user?.userId || user?.id || null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    getUserId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
