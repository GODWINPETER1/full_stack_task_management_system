import React, { useState } from 'react';
import { List, ListItemText, Divider, ListItemButton, ListItemIcon, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderIcon from '@mui/icons-material/Folder';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { AccountTree } from '@mui/icons-material';

interface SidebarProps {
  isCollapsed: boolean;
  projects: { id: string; title: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, projects }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const navigate = useNavigate();

  const handleCreateProject = () => {
    // Implement project creation logic here
    console.log('Create Project:', newProjectTitle, selectedBackground);
    setDialogOpen(false);
  };

  return (
    <div style={{ width: isCollapsed ? '80px' : '250px', backgroundColor: '#F4F5F7', height: '100vh', padding: '1rem', transition: 'width 0.3s ease' }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', display: isCollapsed ? 'none' : 'block' }}>Menu</h3>
      <List>

         {/* Projects Menu */}
         <ListItemButton onClick={() => navigate('/dashboard/overview')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
        <Divider />


        {/* Projects Menu */}
        <ListItemButton onClick={() => navigate('/dashboard/projects')}>
          <ListItemIcon>
            <AccountTree />
          </ListItemIcon>
          <ListItemText primary="Projects" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
        <Divider />

        {/* Other Menus */}
        <ListItemButton onClick={() => navigate('/dashboard/members')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Members" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
        <Divider />

        <ListItemButton onClick={() => navigate('/dashboard/agenda')}>
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Agenda" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
        <Divider />

        <ListItemButton onClick={() => navigate('/dashboard/reports')}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" sx={{ display: isCollapsed ? 'none' : 'block' }} />
        </ListItemButton>
      </List>

      <Divider sx={{ margin: '1rem 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontWeight: 'bold', display: isCollapsed ? 'none' : 'block' }}>Your Projects</h3>
        <div>
          <IconButton onClick={() => console.log('Sort Projects')}>
            <SortIcon />
          </IconButton>
          <IconButton onClick={() => setDialogOpen(true)}>
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <List>
        {projects.map((project) => (
          <div key={project.id}>
            <ListItemButton onClick={() => navigate(`projects/${project.id}`)}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={project.title} sx={{ display: isCollapsed ? 'none' : 'block' }} />
            </ListItemButton>
            <Divider />
          </div>
        ))}
      </List>

      {/* Create Project Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Title"
            fullWidth
            variant="standard"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
          />
          <Select
            fullWidth
            variant="standard"
            value={selectedBackground}
            onChange={(e) => setSelectedBackground(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Background</em>
            </MenuItem>
            <MenuItem value="background1">Background 1</MenuItem>
            <MenuItem value="background2">Background 2</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProject}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
