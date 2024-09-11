import React from 'react';
import { List, ListItemText, Divider,  ListItemButton } from '@mui/material';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <div
      style={{
        width: isCollapsed ? '80px' : '250px',
        backgroundColor: '#F4F5F7',
        height: '100vh',
        padding: '1rem',
        transition: 'width 0.3s ease',
      }}
    >
      <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', display: isCollapsed ? 'none' : 'block' }}>
        Your Boards
      </h3>
      <Divider />
      <List >
        <ListItemButton>
          <ListItemText primary="Project Board 1" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Project Board 2" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Project Board 3" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Project Board 4" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
      </List>
    </div>
  );
};

export default Sidebar;
