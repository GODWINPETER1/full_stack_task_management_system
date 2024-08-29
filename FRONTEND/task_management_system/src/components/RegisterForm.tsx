import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Card, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/register', { email, password });
      // Handle successful registration
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Container sx={{
      display: 'flex',
      marginTop: "40px",
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
                id="standard-basic"
                variant='standard'
                label="Email"
                required
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="standard-basic"
                variant='standard'
                label="Password"
                required
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember me"
              />
              <Button type="submit" style={{backgroundColor: '#9ACD32' , color: '#000'}} fullWidth>
                Register
              </Button>
            </form>

            <Typography variant='body2' sx={{ marginTop: 2 }}>
              Already have an account? <a href="/signin">Sign in</a>
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
            {/* Animation or Image Placeholder */}
            <img 
              src={`${process.env.PUBLIC_URL}/images/task.jpg`} 
              alt="Registration Animation" 
              style={{ maxWidth: '100%', height: '340px' }} 
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default RegisterForm;
