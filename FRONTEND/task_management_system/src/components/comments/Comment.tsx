import React from 'react';
import { Box, Typography } from '@mui/material';

interface CommentProps {
  content: string;
  createdAt: string;
}

const Comment: React.FC<CommentProps> = ({ content, createdAt }) => {
  return (
    <Box sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
      <Typography variant="body1">{content}</Typography>
      <Typography variant="body2" color="textSecondary">{new Date(createdAt).toLocaleString()}</Typography>
    </Box>
  );
};

export default Comment;
