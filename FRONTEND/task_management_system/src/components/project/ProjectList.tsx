// src/components/ProjectList.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deleteProject } from '../../redux/projectSlice';
import { deleteProject as deleteProjectService } from '../../services/projectService';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

interface ProjectListProps {
  projects: { id: string; title: string; description: string }[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit }) => {
  const dispatch = useDispatch();

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
    // You'll need to update your state and possibly backend with the new order
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <Grid container spacing={2} ref={provided.innerRef} {...provided.droppableProps}>
            {projects.map((project, index) => (
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
                    <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '200px' }}>
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
  );
};

export default ProjectList;
