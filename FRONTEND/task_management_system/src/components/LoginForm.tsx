import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Card, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

const LoginForm: React.FC = () => {
  const { login } = useAuth(); // Use useAuth here
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/login', { username: usernameOrEmail, email: usernameOrEmail, password });
      // Assuming response.data contains username and email
      login(response.data.username, response.data.email);
      setSuccessDialogOpen(true); // Show success dialog
      setTimeout(() => {
        navigate('/dashboard')
      })
    } catch (error) {
      setErrorDialogOpen(true);  // Show error dialog
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
    setErrorDialogOpen(false);
  };

  return (
    <Container sx={{
      display: 'flex',
      marginTop: "-40px",
      alignItems: 'center',
      justifyContent: 'center',
      height: '75vh'
    }}>
      <Card sx={{
        display: 'flex',
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        width: '80%',
        maxWidth: 900
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography style={{ fontWeight: 400 }} variant="h4" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                id="username-or-email"
                variant='standard'
                label="Username or Email"
                required
                fullWidth
                margin="normal"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
              <TextField
                id="password"
                variant='standard'
                label="Password"
                required
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" style={{ backgroundColor: '#9ACD32', color: '#000' }} fullWidth>
                Login
              </Button>
            </form>

            <Typography variant='body2' sx={{ marginTop: 2 }}>
              Don't have an account? <a href="/"> Register </a>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/path-to-your-animation-or-photo)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 250
          }}>
            <img 
              src={`${process.env.PUBLIC_URL}/images/task.jpg`} 
              alt="Login Animation" 
              style={{ maxWidth: '100%', height: '340px' }} 
            />
          </Grid>
        </Grid>
      </Card>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title" sx={{ display: 'flex', alignItems: 'center', color: '#4CAF50' }}>
          <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
          Login Successful
        </DialogTitle>
        <DialogContent>
          <Typography>You have logged in successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#4CAF50' }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="error-dialog-title"
      >
        <DialogTitle id="error-dialog-title" sx={{ display: 'flex', alignItems: 'center', color: '#f44336' }}>
          <ErrorOutlineIcon sx={{ marginRight: 1 }} />
          Login Failed
        </DialogTitle>
        <DialogContent>
          <Typography>There was an error logging in. Please try again.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#f44336' }}>
            Retry
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginForm;
