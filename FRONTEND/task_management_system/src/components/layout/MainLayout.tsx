import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../services/projectService';
import { setProjects, selectProjects } from '../../redux/projectSlice';
import Navbar from '../navbar/Navbar';
import NotificationList from '../notifications/NotificationList';
import { useNavigate } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        dispatch(setProjects(data));
      } catch (error: any) {
        console.error('Failed to fetch projects:', error?.response || error);
      }
    };

    fetchProjects();
  }, [dispatch]);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleEdit = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality if needed
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} projects={projects} />

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar onToggleSidebar={handleToggleSidebar} />
        {/* Scrollable middle content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', padding: '2rem' }}>
          <Outlet context={{ projects, onEdit: handleEdit, onDelete: handleDelete }} />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
