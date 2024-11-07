// src/components/ProjectCard.tsx
import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

export interface ProjectCardProps {
  project: { id: string; title: string; description: string };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{project.title}</Typography>
        <Typography variant="body2">{project.description}</Typography>
        <IconButton onClick={() => onEdit(project.id)}><Edit /></IconButton>
        <IconButton onClick={() => onDelete(project.id)}><Delete /></IconButton>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
