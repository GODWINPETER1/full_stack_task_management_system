import React from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField, MenuItem, Button } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deleteProject } from '../../redux/projectSlice';
import { deleteProject as deleteProjectService } from '../../services/projectService';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export interface ProjectListProps {
  projects: { id: string; title: string; description: string }[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isCollapsed?: boolean; // Optional prop
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete, isCollapsed }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleDelete = async (id: string) => {
    try {
      await deleteProjectService(id);
      dispatch(deleteProject(id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const onDragEnd = (result: any) => {
    // Handle reordering of projects
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filter ? project.title === filter : true)
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TextField
          select
          label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {/* handle create project */}}
        >
          Create Project
        </Button>
      </div>

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
                      <Card
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '200px',
                          padding: '10px',
                          backgroundColor: '#f4f5f7',
                          borderRadius: '8px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                        }}
                      >
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
    </>
  );
};

export default ProjectList;
