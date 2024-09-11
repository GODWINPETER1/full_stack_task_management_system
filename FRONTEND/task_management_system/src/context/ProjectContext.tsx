// src/context/ProjectContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectContextType {
  projects: { id: string; title: string; description: string }[];
  setProjects: React.Dispatch<React.SetStateAction<{ id: string; title: string; description: string }[]>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<{ id: string; title: string; description: string }[]>([]);

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
