import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete, List, ListItem, ListItemText, IconButton } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

interface User {
  id: number;
  username: string;
}

interface TagUserFormProps {
  taskId: number;
  onTagAdded: () => void; // Callback to refresh tagged users
  assignedUsers: User[]; // Pass currently assigned users to the component
}

const TagUserForm: React.FC<TagUserFormProps> = ({ taskId, onTagAdded, assignedUsers }) => {
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
            console.error('Failed to tag user:', error);
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

      {/* Display currently tagged users with an option to remove them */}
      
    </div>
  );
};

export default TagUserForm;
