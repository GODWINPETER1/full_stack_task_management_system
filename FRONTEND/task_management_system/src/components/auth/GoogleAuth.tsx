import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleAuthComponent: React.FC = () => {

  const {googleLogin} = useAuth()
  const navigate = useNavigate()

  const handleLoginSuccess = async (response: CredentialResponse) => {
    const tokenId = response.credential;
    console.log(tokenId)

    try {
      // Send the token to a new backend endpoint to authenticate the user
      const res = await axios.post("http://127.0.0.1:8000/api/v1/auth/google/login", {

        token: tokenId,

      
      });
      console.log("Backend response:", res.data);

      

      // Redirect to the desired page
      if(res.data.message === 'User authenticated') {

        googleLogin(res.data.user , res.data.picture , res.data.name)
        
        navigate('/dashboard/overview')
      }

      // Handle successful authentication
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleLoginFailure = () => {
    console.error("Google login failed.");
  };

  return (
    <GoogleOAuthProvider clientId="1004784113481-4qjar2oob7k3t6e7cfbjfs08mhteaj67.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthComponent;
