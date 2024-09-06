import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Card, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as needed

const RegisterForm: React.FC = () => {
  const { username, email, setUsername, setEmail, register } = useAuth();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    try {
      await register(username, email, password);
      setSuccessDialogOpen(true);  // Show success dialog
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
      marginTop: "-100px",
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
              Create Account
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                id="username"
                variant='standard'
                label="Username"
                required
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                id="email"
                variant='standard'
                label="Email"
                required
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <TextField
                id="passwordConfirmation"
                variant='standard'
                label="Confirm Password"
                required
                fullWidth
                margin="normal"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                error={passwordMismatch}
                helperText={passwordMismatch ? "Passwords do not match" : ""}
              />
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember me"
              />
              <Button type="submit" style={{ backgroundColor: '#9ACD32', color: '#000' }} fullWidth>
                Register
              </Button>
            </form>

            <Typography variant='body2' sx={{ marginTop: 2 }}>
              Already have an account? <a href="/signin">Sign in </a>
            </Typography>

          </Grid>
          <Grid item xs={12} md={6} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/path-to-your-animation-or/photo)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 250
          }}>
            <img 
              src={`${process.env.PUBLIC_URL}/images/task.jpg`} 
              alt="Registration Animation" 
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
          Registration Successful
        </DialogTitle>
        <DialogContent>
          <Typography>Your account has been created successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#4CAF50' }}>
            <a href='/signin'> OK </a>
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
          Registration Failed
        </DialogTitle>
        <DialogContent>
          <Typography>There was an error creating your account. Please try again.</Typography>
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

export default RegisterForm;
