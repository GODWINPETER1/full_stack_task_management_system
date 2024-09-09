import React, { ReactNode , useState} from 'react';
import { Box } from '@mui/material';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

// Define the props type including 'children'
interface MainLayoutProps {
  children: ReactNode;
  isCollapsed: boolean
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

    const [isCollapsed , setIsCollapsed ] = useState(false)

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isCollapsed = {isCollapsed} />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <Box sx={{ padding: '2rem' }}>
          {children} {/* Render pages here */}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
