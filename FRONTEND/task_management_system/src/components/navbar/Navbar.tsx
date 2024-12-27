import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Badge,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../context/AuthContext';
import ThemeToggleButton from '../button/dark_Light';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { username, email, logout, user, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/v1/notifications",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    fetchNotifications();
}, [token]);


  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleNotificationClick = () => {
    setNotificationDialogOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationDialogOpen(false);
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <AppBar position="static" color="transparent" sx={{ boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onToggleSidebar}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Task Management System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Dark/light mode toggle */}
          <Tooltip title="Toggle Dark/Light Mode">
              <IconButton>
                   <ThemeToggleButton/>
              </IconButton>
          </Tooltip>
          {/* Notification Icon with Badge */}
          <IconButton color="inherit" onClick={handleNotificationClick}>
    <Badge badgeContent={notifications.length} color="error">
        <NotificationsIcon />
    </Badge>
</IconButton>


          {/* Notification Dialog */}
          <Dialog open={notificationDialogOpen} onClose={handleNotificationClose} maxWidth="sm" fullWidth>
            <DialogTitle>Notifications</DialogTitle>
            <DialogContent>
              <List>
                {notifications.length === 0 ? (
                  <Typography variant="body2" color="textSecondary" align="center">
                    No notifications available
                  </Typography>
                ) : (
                  notifications.map((notification, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={notification.title}
                        secondary={notification.message || "No additional details"}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </DialogContent>
          </Dialog>

          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            startIcon={
              <Avatar alt={username || user?.name} src={user?.picture || undefined}>
                {username ? username.charAt(0) : user?.name?.charAt(0)}
              </Avatar>
            }
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              color: 'black',
              '&:hover': { backgroundColor: '#f4f4f6' },
            }}
          >
            {username || user?.name}
          </Button>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 8,
              sx: {
                width: '250px',
                padding: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              },
            }}
          >
            <Box sx={{ padding: '8px 16px' }}>
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {username || user?.name}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ justifyContent: 'center', marginBottom: '8px' }}>
                <Typography variant="body2" color="textSecondary">
                  {email || user?.email}
                </Typography>
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: '#d32f2f',
                  borderTop: '1px solid #f0f0f0',
                  marginTop: '8px',
                  paddingTop: '8px',
                }}
              >
                <Typography>Logout</Typography>
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
