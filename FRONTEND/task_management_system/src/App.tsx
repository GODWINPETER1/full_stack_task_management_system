// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import ProjectDetail from './pages/Projects/ProjectDetail';
import DashboardPage from './pages/Projects/DashboardPage'; // Updated import
import MembersPage from './pages/Members/Members';
import TaskCalendar from './pages/Agenda/Agenda';
import ReportsPage from './pages/Reports/Reports';
import Overview from './pages/Overview/overview';
import ProjectPage from './pages/Projects/ProjectPage';
import { ThemeProviderWrapper } from './context/ThemeContext';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<RegisterPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<MainLayout />}>
          <Route path='overview' element={<Overview/>}/>    
          <Route path="projects" element={<DashboardPage  />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="agenda/:projectId" element={<TaskCalendar />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="projects/:projectId" element={<ProjectPage/>} />
        <Route path="project/new" element={<ProjectDetail />} />
        </Route>
        
      </Routes>
    </Router>
  );
};

export default App;
