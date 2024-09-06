import React from 'react';
import { Button } from '@mui/material';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/api/v1/auth/google";
  };

  return (
    <Button
      onClick={handleGoogleLogin} // Use handleGoogleLogin function here
      style={{ backgroundColor: '#4285F4', color: '#fff', marginTop: 16 }}
      fullWidth
    >
      Login with Google
    </Button>
  );
};

export default GoogleLoginButton;
