import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';

interface CommentFormProps {
  taskId: number;
  onCommentAdded: () => void; // Callback to refresh comments
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string>(''); // New state for tagged users

  const token = localStorage.getItem('accessToken');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      console.error('No access token found');
      return; // Optionally handle the error for no token
    }

    const taggedUserIds = taggedUsers.split(',').map(userId => userId.trim()).filter(id => id); // Convert to array and trim

    try {
      await axios.post(`http://127.0.0.1:8000/api/v1/tasks/${taskId}/comments`, 
        { 
          content,
          tagged_users: taggedUserIds // Include tagged users in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      setContent(''); // Clear the input field after submission
      setTaggedUsers(''); // Clear the tagged users input
      onCommentAdded(); // Trigger refresh of comments
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
      <TextField
        label="Tag Users (comma-separated IDs)"
        variant="outlined"
        fullWidth
        value={taggedUsers}
        onChange={(e) => setTaggedUsers(e.target.value)} // Handle tagged users input
        sx={{ marginTop: 1 }} // Add margin for spacing
      />
      <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
        Submit
      </Button>
    </Box>
  );
};

export default CommentForm;
