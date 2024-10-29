import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import axios from 'axios';

interface User {
  id: number;
  username: string;
}

interface TagUserFormProps {
  taskId: number;
  onTagAdded: () => void; // Callback to refresh tagged users
}

const TagUserForm: React.FC<TagUserFormProps> = ({ taskId, onTagAdded }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/users'); // API endpoint to fetch users
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleTagUser = async () => {
    if (selectedUser) {
      const token = localStorage.getItem('accessToken'); // Get token from local storage
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/v1/tasks/${taskId}/tag`,
          {
            user_id: selectedUser.id, // Send user ID in the request body
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        onTagAdded(); // Refresh tagged users
        setSelectedUser(null); // Clear the selection
      } catch (error) {
        console.error('Failed to tag user:', );
      }
    }
  };
  

  return (
    <div>
      <Autocomplete
        options={users}
        getOptionLabel={(user) => user.username}
        value={selectedUser}
        onChange={(event, newValue) => setSelectedUser(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Tag a user" variant="outlined" />
        )}
      />
      <Button onClick={handleTagUser} variant="contained" color="primary" disabled={!selectedUser}>
        Tag User
      </Button>
    </div>
  );
};

export default TagUserForm;
