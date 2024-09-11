// src/pages/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProject as createProjectService, updateProject as updateProjectService } from '../../services/projectService';
import { addProject, updateProject as updateProjectState } from '../../redux/projectSlice';
import ProjectForm from '../../components/project/ProjectForm';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState<{ title: string; description: string }>({ title: '', description: '' });

  useEffect(() => {
    if (id) {
      // Fetch project details if editing
      // For demonstration, initialValues are static. Implement API call if needed.
    }
  }, [id]);

  const handleSubmit = async (title: string, description: string) => {
    try {
      if (id) {
        // Update existing project
        await updateProjectService(id, { title, description });
        dispatch(updateProjectState({ id, title, description }));
      } else {
        // Create new project
        const newProject = await createProjectService({ title, description });
        dispatch(addProject(newProject));
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{id ? 'Edit Project' : 'Create New Project'}</h2>
      <ProjectForm onSubmit={handleSubmit} initialValues={initialValues} />
    </div>
  );
};

export default ProjectDetail;
