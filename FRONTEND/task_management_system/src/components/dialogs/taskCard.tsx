import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List, ListItem, ListItemText, ButtonBase, Menu, MenuItem, 
  Typography, Avatar, Slide
} from '@mui/material';
import CommentForm from '../comments/CommentForm'; // Importing CommentForm
import CommentList from '../comments/CommentList'; // Importing CommentList
import ReminderForm from '../reminders/ReminderForm';
import ReminderList from '../reminders/ReminderList';
import Notification from '../notifications/Notification';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TransitionProps } from '@mui/material/transitions';



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

  // Function to invite a user
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

  const handleNotificationClose = () => setNotificationOpen(false);

  const handleReminderAdded = () => {
    setNotificationMessage('Reminder added successfully!');
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
          <Typography paragraph>
            Set permissions and invite users to manage this task.
          </Typography>

          {/* User Assignment/Search */}
          <TextField
            label="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            margin="dense"
            placeholder="Invite by name or email"
          />

          {/* List of filtered users */}
          <List>
            {filteredUsers.map((user) => (
              <ButtonBase
                key={user.id}
                onClick={() => handleInviteUser(user)}
                style={{
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: assignedUser.some(u => u.id === user.id) ? '#f0f4ff' : 'transparent',
                  transition: 'background-color 0.3s'
                }}
              >
                <ListItem component="li" style={{ width: '100%' }}>
                  <Avatar style={{ marginRight: '10px' }}>{user.username[0]}</Avatar>
                  <ListItemText primary={user.username} secondary={user.email} />
                </ListItem>
              </ButtonBase>
            ))}
          </List>

          {/* Assigned Users */}
          {assignedUser.length > 0 && (
            <CardContent>
              <Typography variant="body1"><strong>{assignedUser.length} Members Assigned</strong></Typography>
              <List>
                {assignedUser.map((user) => (
                  <ListItem key={user.id}>
                    <Avatar style={{ marginRight: '10px' }}>{user.username[0]}</Avatar>
                    <ListItemText primary={user.username} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          )}

          {/* Comment Section */}
          <CommentForm taskId={task.id} onCommentAdded={fetchComments} />
          <CommentList comments={comments} />

          {/* Reminder content */}

          <DialogContent>
          <ReminderForm taskId={task.id} onReminderAdded={handleReminderAdded} />
          <ReminderList taskId={task.id} />
        </DialogContent>

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
