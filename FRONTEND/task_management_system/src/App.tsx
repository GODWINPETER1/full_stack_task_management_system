import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
// Import LoginPage and other components/pages as needed

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        {/* Add routes for other pages here */}
      </Routes>
    </Router>
  );
};

export default App;
