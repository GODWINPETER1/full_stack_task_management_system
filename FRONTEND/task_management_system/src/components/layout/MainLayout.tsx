import React, { ReactNode , useState , useEffect} from 'react';
import { Box , Button } from '@mui/material';
import Sidebar from '../sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../services/projectService';
import { setProjects, selectProjects } from '../../redux/projectSlice';
import ProjectList from '../../components/project/ProjectList';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';

// Define the props type including 'children'
interface MainLayoutProps {
  children: ReactNode;
  isCollapsed: boolean
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const navigate = useNavigate();

    const [isCollapsed , setIsCollapsed ] = useState(false)

    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const data = await getProjects();
          dispatch(setProjects(data));
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      };
  
      fetchProjects();
    }, [dispatch]);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard`);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality as shown earlier
  };

  const handleCreateNew = () => {
    navigate('/project/new');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isCollapsed = {isCollapsed} />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <Box sx={{ padding: '2rem' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateNew}
          style={{ marginBottom: '20px' }}
        >
          Create New Project
        </Button>
           <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete}/>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
