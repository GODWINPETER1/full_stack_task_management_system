// Import the configured axiosInstance
import axiosInstance from './axiosInstance';

export const getProjects = async () => {
  const response = await axiosInstance.get('/' );
  return response.data;
};

export const createProject = async (projectData: { title: string; description: string }) => {
  const response = await axiosInstance.post('/', projectData);
  return response.data;
};

export const updateProject = async (id: string, projectData: { title: string; description: string }) => {
  const response = await axiosInstance.put(`/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: string) => {
  await axiosInstance.delete(`/${id}`);
};
