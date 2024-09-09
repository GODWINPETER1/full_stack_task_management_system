import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
// Import LoginPage and other components/pages as needed

interface MainLayoutProps {
  isCollapsed: boolean
}


const App: React.FC = () => {

  


  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path='/signin' element = {<LoginPage/>} />
        <Route path='/dashboard' element = {<MainLayout isCollapsed children/>} />
        {/* Add routes for other pages here */}
      </Routes>
    </Router>
  );
};

export default App;
