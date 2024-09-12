import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../services/projectService';
import { setProjects, selectProjects } from '../../redux/projectSlice';
import Navbar from '../navbar/Navbar';
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
      } catch (error) {
        console.error('Failed to fetch projects:', error);
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
    <Box sx={{ display: 'flex' }}>
      <Sidebar isCollapsed={isCollapsed} projects={projects} />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <Box sx={{ padding: '2rem' }}>
          {/* Render nested routes with context */}
          <Outlet context={{ projects, onEdit: handleEdit, onDelete: handleDelete }} />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
