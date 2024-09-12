import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProject as createProjectService, updateProject as updateProjectService } from '../../services/projectService';
import { addProject, updateProject as updateProjectState } from '../../redux/projectSlice';
import ProjectForm from '../../components/project/ProjectForm';

const backgroundOptions = [
  '#FFEBEE', '#E8F5E9', '#E3F2FD', '#FFF3E0', '#F3E5F5'
];

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add 'background' to the initialValues with a default value
  const [initialValues, setInitialValues] = useState<{ title: string; description: string; background: string }>({
    title: '',
    description: '',
    background: backgroundOptions[0], // Default background
  });

  useEffect(() => {
    if (id) {
      // Fetch project details if editing
      // For demonstration, static initialValues; fetch from API here if needed
      // setInitialValues({ title: 'Project Title', description: 'Project Description', background: '#FFEBEE' });
    }
  }, [id]);

  const handleSubmit = async (title: string, description: string, background: string) => {
    try {
      if (id) {
        // Update existing project
        await updateProjectService(id, { title, description });
        dispatch(updateProjectState({ id, title, description , background}));
      } else {
        // Create new project
        const newProject = await createProjectService({ title, description  });
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
