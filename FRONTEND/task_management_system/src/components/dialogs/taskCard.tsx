import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List, ListItem, ListItemText, ButtonBase, Menu, MenuItem,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface User {
  id: number;
  username: string;
  email: string;
}

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    assigned_to_id?: number | null;
  };
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedUser, setAssignedUser] = useState<User[]>([]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const searchUsers = async (query: string) => {
      if (query.length > 0) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/?search=${query}`);
          setFilteredUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } else {
        setFilteredUsers([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchUsers(searchTerm);
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);


  // Function to invite a user
  const handleInviteUser = (user: User) => {

    if (!assignedUser.some((invited) => invited.id === user.id)) {
      setAssignedUser([...assignedUser , user])
    }
    setSearchTerm('') // clear search term
    setFilteredUsers([])
  }

  return (
    <>
      <Card style={{ position: 'relative' }}>
        <CardContent>
          <h4>{task.title}</h4>
          <IconButton
            style={{ position: 'absolute', top: 5, right: 5 }}
            onClick={handleOpenDialog}
          >
            <MoreVertIcon />
          </IconButton>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Assign Task</span>
            <div>
              <IconButton onClick={handleMenuOpen}>
                <MoreHorizIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Archive Task</MenuItem>
                <MenuItem onClick={handleMenuClose}>Duplicate Task</MenuItem>
              </Menu>
              <IconButton onClick={handleCloseDialog}>
                <CancelIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>

        <DialogContent>
          <p className='dialog-paragraphy'>Managing access keeps data secure. Set permissions for your project and invite new users or groups. Here's who has access right now:</p>

          {/* User Assignment/Search */}
          <TextField
            label="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            margin="dense"
            placeholder="Invite others by entering a name or email"
          />

          {/* List of filtered users */}
          <List>
            {filteredUsers.map((user) => (
              <ButtonBase
                key={user.id}
                onClick={() => handleInviteUser(user)}
                style={{ width: '100%' }}
              >
                <ListItem component="li" style={{ width: '100%' }}>
                  <ListItemText primary={user.username} secondary={user.email} />
                </ListItem>
              </ButtonBase>
            ))}
          </List>
           {
             assignedUser.length > 0 && (
             <CardContent>
                <Typography variant='body1'> <strong> {assignedUser.length} Members </strong> </Typography>

                    <List>
                          {
                            assignedUser.map((user) => (
                              <ListItem key = {user.id}>
                                 <ListItemText primary={user.username}></ListItemText>
                              </ListItem>
                            ))
                          }
                    </List>
             </CardContent> 
              
             )
           }
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onDelete(task.id)} color="secondary" startIcon={<DeleteIcon />}>
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCard;
