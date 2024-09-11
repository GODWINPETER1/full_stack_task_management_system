// src/components/ProjectForm.tsx
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface ProjectFormProps {
  onSubmit: (title: string, description: string) => void;
  initialValues?: { title: string; description: string };
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialValues = { title: '', description: '' } }) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);

  const handleSubmit = () => {
    onSubmit(title, description);
  };

  return (
    <div>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSubmit} variant="contained">Save</Button>
    </div>
  );
};

export default ProjectForm;
