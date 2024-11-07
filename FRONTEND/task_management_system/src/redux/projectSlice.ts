import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Project {
  id: string;
  title: string;
  description: string;
  background: string; // Background color for the project
}

interface ProjectState {
  projects: Project[];
  deletedProjects: Project[]; // New list to store deleted projects
}

const initialState: ProjectState = {
  projects: [],
  deletedProjects: [], // Initialize the deleted projects list
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
    updateProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject(state, action: PayloadAction<string>) {
      const projectIndex = state.projects.findIndex(p => p.id === action.payload);
      if (projectIndex >= 0) {
        const deletedProject = state.projects[projectIndex];
        state.deletedProjects.push(deletedProject);
        state.projects.splice(projectIndex, 1);  // Remove from active projects
      }
    },
    reopenProject(state, action: PayloadAction<string>) {
      const projectIndex = state.deletedProjects.findIndex(p => p.id === action.payload);
      if (projectIndex >= 0) {
        const reopenedProject = state.deletedProjects[projectIndex];
        state.projects.push(reopenedProject);
        state.deletedProjects.splice(projectIndex, 1);  // Remove from deleted projects
      }
    },
    permanentlyDeleteProject(state, action: PayloadAction<string>) {
      state.deletedProjects = state.deletedProjects.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  permanentlyDeleteProject,
  reopenProject,
} = projectSlice.actions;

export const selectProjects = (state: RootState) => state.projects.projects;
export const selectDeletedProjects = (state: RootState) => state.projects.deletedProjects;

export default projectSlice.reducer;
