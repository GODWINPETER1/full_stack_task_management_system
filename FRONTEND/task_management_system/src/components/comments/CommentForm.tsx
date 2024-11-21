import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';

interface CommentFormProps {
  taskId: number;
  onCommentAdded: (newComment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const token = localStorage.getItem('accessToken');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return; // Prevent empty comments

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/tasks/${taskId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onCommentAdded(response.data); // Notify parent with new comment
      setContent(''); // Clear the input field
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 2 }}>
      <TextField
        label="Add a comment"
        variant="outlined"
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
        Submit
      </Button>
    </Box>
  );
};

export default CommentForm;

