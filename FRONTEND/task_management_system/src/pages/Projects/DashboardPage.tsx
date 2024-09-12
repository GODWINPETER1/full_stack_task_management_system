import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deleteProject, addProject } from '../../redux/projectSlice';
import { deleteProject as deleteProjectService, createProject as createProjectService } from '../../services/projectService';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ProjectForm from '../../components/project/ProjectForm';
import { useAuth } from '../../context/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  background: string;
}

const DashboardPage: React.FC = () => {
  const { projects, onEdit, onDelete } = useOutletContext<{ projects: Project[], onEdit: (id: string) => void, onDelete: (id: string) => void }>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title');  // Can also be 'description', 'background', etc.
  const [filterOption, setFilterOption] = useState('all');  // Customize this further if needed
  const [sortDirection, setSortDirection] = useState('asc'); // Add sort direction state
  const [openDialog, setOpenDialog] = useState(false);
  
  const dispatch = useDispatch();


  // Handle project deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteProjectService(id);
      dispatch(deleteProject(id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  // Handle project creation
  const handleCreateProject = async (title: string, description: string, background: string) => {
    try {
      const newProject = { title, description, background };
      const createdProject = await createProjectService(newProject);
      dispatch(addProject(createdProject));
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  // Drag and drop functionality
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    // Implement drag and drop reordering logic here
  };

  const filteredProjects = projects
  .filter((project) => {
    // Check if the filter option is set to 'all' or apply other filter logic (if needed)
    if (filterOption === 'all') {
      return (
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // You can add more filter logic here if needed (e.g., by project status, background, etc.)
    return (
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  })
  .sort((a, b) => {
    // Sorting logic
    if (sortOption === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortOption === 'description') {
      return sortDirection === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    // Default return 0 if no other sorting criteria
    return 0;
  });


  return (
    <>
      {/* Create Project Button Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button startIcon={<Add />} onClick={() => setOpenDialog(true)}
          style={{
            background: 'linear-gradient(0deg, #f6f7ff 23.96%, #fff 60.42%)',
            color: "#2f2f38"
          }}>
          Create Project
        </Button>
      </div>

      {/* Sort, Filter, and Search Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120, marginRight: '1rem' }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              label="Sort by"
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="description">Description</MenuItem>
              {/* Add more sort options if needed */}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort Direction</InputLabel>
            <Select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              label="Sort Direction"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120, marginLeft: '1rem' }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              label="Filter"
            >
              <MenuItem value="all">All</MenuItem>
              {/* Add more filter options if needed */}
            </Select>
          </FormControl>
        </div>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Project List Section */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Grid container spacing={2} ref={provided.innerRef} {...provided.droppableProps}>
              {filteredProjects.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id} index={index}>
                  {(provided) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '200px', backgroundColor: project.background }}>
                        <CardContent>
                          <Typography variant="h5">{project.title}</Typography>
                          <Typography variant="body2">{project.description}</Typography>
                        </CardContent>
                        <div style={{ padding: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton onClick={() => onEdit(project.id)}><Edit /></IconButton>
                          <IconButton onClick={() => handleDelete(project.id)}><Delete /></IconButton>
                        </div>
                      </Card>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

      {/* Project Creation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <ProjectForm onSubmit={handleCreateProject} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardPage;
