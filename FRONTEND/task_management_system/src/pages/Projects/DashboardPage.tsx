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
  DialogTitle, 
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
  
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useDispatch , useSelector } from 'react-redux';
import { deleteProject, addProject, permanentlyDeleteProject, reopenProject } from '../../redux/projectSlice';
import {  deleteProject as deleteProjectService, createProject as createProjectService } from '../../services/projectService';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import ProjectForm from '../../components/project/ProjectForm';
import { useAuth } from '../../context/AuthContext';
import {RootState} from '../../redux/store'
import { useTheme } from '@emotion/react';
import { useParams } from 'react-router-dom';
import InvitationDialog from '../../components/invitation/Invitation';

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
  const [showDeletedProjectsDialog , setShowDeletedProjectsDialog] = useState(false)
  const [dialogOpen , setDialogOpen] = useState(false)
  const { projectId } = useParams<{ projectId: string }>();

  const project = useSelector((state: RootState) => state.projects.projects)
  const deletedProjects = useSelector((state: RootState) => state.projects.deletedProjects)
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const openDialogInvite = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);
  


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

      // navigate to the task page after the project is created
      
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  //  Reopen a project
  const handleReopenProject = (id: string) => {
    dispatch(reopenProject(id))
  }


  // permanently delete a project
  const handlePermanentlyDeleteProject = (id: string) => {
    dispatch(permanentlyDeleteProject(id))
  }

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

    {/* Button to open deleted projects dialog */}

    <Button onClick={() => setShowDeletedProjectsDialog(true)} style={{ position: 'absolute', bottom: '1rem', right: '1rem'}}>
       Show deleted projects
    </Button>

    {/* Dialog to show deleted projects */}
    <Dialog
  open={showDeletedProjectsDialog}
  onClose={() => setShowDeletedProjectsDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle align="center">Deleted Projects</DialogTitle>
  <DialogContent>
    {deletedProjects.length > 0 ? (
      <List>
        {deletedProjects.map((project) => (
          <div key={project.id}>
            <ListItem>
              <Box display="flex" flexDirection="column" flexGrow={1}>
                <Typography variant="h6">{project.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {project.description}
                </Typography>
              </Box>
              <Button
                onClick={() => handleReopenProject(project.id)}
                color="primary"
                size="small" // Reduced button size
                variant="contained" // Add contained style
                sx={{ marginLeft: 1 }} // Add margin to the left
              >
                Reopen
              </Button>
              <Button
                onClick={() => handlePermanentlyDeleteProject(project.id)}
                color="error" // Changed to error color for better indication
                size="small" // Reduced button size
                variant="contained" // Add contained style
                sx={{ marginLeft: 1 }} // Add margin to the left
              >
                Delete Permanently
              </Button>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    ) : (
      <Typography>No deleted projects.</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowDeletedProjectsDialog(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

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
