import React, { useEffect } from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

const UserProfile: React.FC = () => {
  const { username, email, logout } = useAuth();


  useEffect(() => {
    console.log(username)
    console.log(email)
  } , [username , email])


  const handleLogout = () => {
    logout();
  };

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '75vh'
    }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="h6">
        Username: {username }
      </Typography>
      <Typography variant="h6">
        Email: {email}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default UserProfile;
