import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, IconButton, Avatar, Tooltip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { username, email , logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profilePic, setProfilePic] = useState<String | null>(null);
  const navigate = useNavigate()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePic(e.target?.result as string);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleLogout = () => {

    logout()
    navigate('/signin')
  };

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
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            startIcon={
              profilePic ? (
                <Avatar alt={username} src={profilePic ? profilePic.toString() : undefined} />
              ) : (
                <AccountCircleIcon />
              )
            }
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              color: 'black',
              '&:hover': { backgroundColor: '#f4f4f6' },
            }}
          >
            <Typography variant="subtitle1">{username}</Typography>
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
              <MenuItem>
                <Tooltip title="Change Photo">
                  <IconButton component="label" style={{ position: 'relative', left: '70px' }}>
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <Avatar alt={username} src={profilePic ? profilePic.toString() : undefined} />
                  </IconButton>
                </Tooltip>
              </MenuItem>
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {username}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ justifyContent: 'center', marginBottom: '8px' }}>
                <Typography variant="body2" color="textSecondary">
                  {email}
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
