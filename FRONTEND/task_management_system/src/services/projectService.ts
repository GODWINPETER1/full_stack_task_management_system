// src/services/projectService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/projects';

export const getProjects = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(API_URL , {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createProject = async (projectData: { title: string; description: string }) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
};

export const updateProject = async (id: string, projectData: { title: string; description: string }) => {
  const response = await axios.put(`${API_URL}/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
