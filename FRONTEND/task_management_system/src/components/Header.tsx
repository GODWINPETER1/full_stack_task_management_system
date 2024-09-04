import React from 'react';
import {Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Header: React.FC = () => {
  // const navigate = useNavigate();

  return (
    <div className='header-container'>
        <Toolbar>
        <img 
              className='header-container'
              src={`${process.env.PUBLIC_URL}/images/logo.png`} 
              alt="Registration Animation" 
              style={{ maxWidth: '100%', height: '130px' }} 
            />
        {/* <Button  style={{ backgroundColor: '#9ACD32' , color: '#000'}}  onClick={() => navigate('/register')}>
          Get Qoute 
        </Button> */}
      </Toolbar>
    </div>
      
    
  );
};

export default Header;
