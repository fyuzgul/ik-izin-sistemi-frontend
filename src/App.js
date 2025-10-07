import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LeaveRequests from './pages/LeaveRequests';
import Approvals from './pages/Approvals';
import Employees from './pages/Employees';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<div>Departments sayfası yakında...</div>} />
          <Route path="/leave-types" element={<div>Leave Types sayfası yakında...</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
