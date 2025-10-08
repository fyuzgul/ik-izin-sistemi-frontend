import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LeaveRequests from './pages/LeaveRequests';
import Approvals from './pages/Approvals';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import LeaveTypes from './pages/LeaveTypes';
import CreateEmployee from './pages/CreateEmployee';
import CreateDepartment from './pages/CreateDepartment';
import CreateLeaveType from './pages/CreateLeaveType';
import CreateLeaveRequest from './pages/CreateLeaveRequest';
import Login from './pages/Login';
import { UserRole } from './constants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leave-requests" 
              element={
                <ProtectedRoute>
                  <LeaveRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leave-requests/create" 
              element={
                <ProtectedRoute>
                  <CreateLeaveRequest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/departments/create" 
              element={
                <ProtectedRoute>
                  <CreateDepartment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/approvals" 
              element={
                <ProtectedRoute>
                  <Approvals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees/create" 
              element={
                <ProtectedRoute>
                  <CreateEmployee />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/departments" 
              element={
                <ProtectedRoute>
                  <Departments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/departments/create" 
              element={
                <ProtectedRoute>
                  <CreateDepartment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leave-types" 
              element={
                <ProtectedRoute>
                  <LeaveTypes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leave-types/create" 
              element={
                <ProtectedRoute>
                  <CreateLeaveType />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
