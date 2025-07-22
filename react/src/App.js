import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPasswordRequest from './pages/ResetPasswordRequest';
import ResetPassword from './pages/ResetPassword';
import UploadPage from './pages/Upload';
import RatePage from './pages/Rate';
import StatsPage from './pages/Stats';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/rate" element={<RatePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
