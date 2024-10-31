// src/components/tasks/TaskCard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List, ListItem, ListItemText, ButtonBase, Menu, MenuItem, 
  Typography, Avatar, Slide , Box , Divider
} from '@mui/material';
import CommentForm from '../comments/CommentForm'; // Importing CommentForm
import CommentList from '../comments/CommentList'; // Importing CommentList
import ReminderForm from '../reminders/ReminderForm';
import ReminderList from '../reminders/ReminderList';
import Notification from '../notifications/Notification'; // Importing Notification component
import TagUserForm from '../tagging/TagUserForm'; // Importing TagUserForm
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TransitionProps } from '@mui/material/transitions';
import TaskTimer from '../timer/TaskTimer';
import TaskDetails from '../timer/TaskDetails';

// Transition for dialogs
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface User {
  id: number;
  username: string;
  email: string;
}

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description?: string; // Ensure description is a required string
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
  const [comments, setComments] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showDetails , setShowDetails] = useState(false)

  const token = localStorage.getItem('accessToken');

  const handleOpenDialog = () => {
    setOpenDialog(true);
    fetchComments(); // Fetch comments when dialog opens
  };
  
  const handleCloseDialog = () => setOpenDialog(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const searchUsers = async (query: string) => {
      if (query.length > 0) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/?search=${query}` , {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
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
  }, [searchTerm, token]);

  const handleInviteUser = (user: User) => {
    if (!assignedUser.some((invited) => invited.id === user.id)) {
      setAssignedUser([...assignedUser, user]);
    }
    setSearchTerm(''); // Clear search term
    setFilteredUsers([]);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/tasks/${task.id}/comments` , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleDeleteTag = async (userId: number) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/tasks/${task.id}/tag/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update state to remove the user from the assigned list
      setAssignedUser(assignedUser.filter((user) => user.id !== userId));
      setNotificationMessage('User tag removed successfully!');
      setNotificationOpen(true);
    } catch (error) {
      console.error('Failed to remove tag');
    }
  };
  


  const handleNotificationClose = () => setNotificationOpen(false);

  const handleTagUserAdded = () => {
    setNotificationMessage('User tagged successfully!');
    setNotificationOpen(true);
  };

  return (
    <>
      <Card style={{ position: 'relative', borderRadius: '12px', marginBottom: '15px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{task.title}</Typography>
          <Typography variant="body2" color="textSecondary">{task.description}</Typography>
          <IconButton
            style={{ position: 'absolute', top: 5, right: 5 }}
            onClick={handleOpenDialog}
          >
            <MoreVertIcon />
          </IconButton>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            borderRadius: '15px',
          }
        }}
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Assign Task</Typography>
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
          {/* Task Information */}
          <Box marginBottom={2}>
            <Typography variant="subtitle1" fontWeight="bold">{task.title}</Typography>
            <Typography variant="body2" color="textSecondary">{task.description}</Typography>
          </Box>

          <Divider />

          {/* Time Tracking Section */}
          <Box marginBottom={2} marginTop={2}>
            <Typography variant="subtitle1" fontWeight="bold">Time Tracking</Typography>
            <TaskTimer taskId={task.id} />
            <TaskDetails taskId={task.id} />
          </Box>

          <Divider />

          {/* User Assignment/Search */}
          <Box marginBottom={2} marginTop={2}>
            <Typography variant="subtitle1" fontWeight="bold">Assign Users</Typography>
            <TextField
              label="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              margin="dense"
              placeholder="Invite by name or email"
            />
            <List>
              {filteredUsers.map((user) => (
                <ButtonBase
                  key={user.id}
                  onClick={() => setAssignedUser([...assignedUser, user])}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#f0f4ff',
                    marginBottom: '5px',
                  }}
                >
                  <ListItem component="li" style={{ width: '100%' }}>
                    <Avatar style={{ marginRight: '10px' }}>{user.username[0]}</Avatar>
                    <ListItemText primary={user.username} secondary={user.email} />
                  </ListItem>
                </ButtonBase>
              ))}
            </List>
          </Box>

          {/* Assigned Users */}
          {assignedUser.length > 0 && (
            <Box marginBottom={2}>
              <Typography variant="body1" fontWeight="bold">{assignedUser.length} Members Assigned</Typography>
              <List>
                {assignedUser.map((user) => (
                  <ListItem
                    key={user.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Avatar style={{ marginRight: '10px' }}>{user.username[0]}</Avatar>
                    <ListItemText primary={user.username} />
                    <IconButton onClick={() => setAssignedUser(assignedUser.filter(u => u.id !== user.id))}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Divider />

          {/* Comment Section */}
          <Box marginTop={2}>
            <Typography variant="subtitle1" fontWeight="bold">Comments</Typography>
            <CommentForm taskId={task.id} onCommentAdded={() => setComments([...comments])} />
            <CommentList comments={comments} />
          </Box>

          <Divider />

          {/* Reminder Section */}
          <Box marginTop={2}>
            <Typography variant="subtitle1" fontWeight="bold">Reminders</Typography>
            <ReminderForm taskId={task.id} onReminderAdded={() => {setNotificationMessage('Reminder Added Successfully'); setNotificationOpen(true)}} />
            <ReminderList taskId={task.id} />
          </Box>

          <Divider />

          {/* Tagging Section */}
          <Box marginTop={2}>
            <Typography variant="subtitle1" fontWeight="bold">Tag Users</Typography>
            <TagUserForm taskId={task.id} onTagAdded={() => setNotificationMessage('User tagged successfully!')} assignedUsers={assignedUser} />
          </Box>

        </DialogContent>


        

        <DialogActions>
          <Button onClick={() => onDelete(task.id)} color="secondary" startIcon={<DeleteIcon />}>
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notificationOpen}
        message={notificationMessage}
        onClose={handleNotificationClose}
      />
    </>
  );
};

export default TaskCard;
