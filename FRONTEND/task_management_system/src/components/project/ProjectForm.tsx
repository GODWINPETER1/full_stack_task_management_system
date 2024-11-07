import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

interface ProjectFormProps {
  onSubmit: (title: string, description: string, background: string) => void;
  initialValues?: { title: string; description: string; background: string };
}

const backgroundOptions = [
  '#FFEBEE', // Light Red
  '#E8F5E9', // Light Green
  '#E3F2FD', // Light Blue
  '#FFF3E0', // Light Orange
  '#F3E5F5', // Light Purple
  '#913f92',
  '#d84242',
  '#99c1b2'
];

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialValues = { title: '', description: '', background: backgroundOptions[0] } }) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [background, setBackground] = useState(initialValues.background);

  const handleSubmit = () => {
    onSubmit(title, description, background);
  };

  return (
    <div>
      {/* Background Header */}
      <div style={{ backgroundColor: background, padding: '20px', borderRadius: '4px', marginBottom: '1rem' }}>
        <Typography variant="h6" align="center" style={{ color: '#fff' }}>
          Project Background Preview
        </Typography>
      </div>

       {/* Background Selection */}
       <Typography variant="subtitle1" style={{ marginBottom: '0.5rem' }}>
        Select Background:
      </Typography>
      <Grid container spacing={2}>
        {backgroundOptions.map((bgColor) => (
          <Grid item xs={4} key={bgColor}>
            <Paper
              style={{
                backgroundColor: bgColor,
                height: '50px',
                cursor: 'pointer',
                border: background === bgColor ? '2px solid black' : 'none',
              }}
              onClick={() => setBackground(bgColor)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Form Fields */}
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

      <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '1rem' }}>
        Save
      </Button>
    </div>
  );
};

export default ProjectForm;
