import React from 'react';
import {Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='header-container'>
        <Toolbar>
        <Typography variant="h5" style={{ flexGrow: 1 , color: '#000'  , fontWeight: 600}}>
          Godwin Peter
        </Typography>
        <Button  style={{ backgroundColor: '#9ACD32' , color: '#000'}}  onClick={() => navigate('/register')}>
          Get Qoute 
        </Button>
      </Toolbar>
    </div>
      
    
  );
};

export default Header;
