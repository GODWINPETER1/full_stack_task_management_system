// src/components/tasks/TaskCard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, IconButton, Dialog, DialogContent, ButtonBase, Typography, Avatar, Box, Divider, TextField, List, ListItem, ListItemText, Button,
} from '@mui/material';
import CommentForm from '../comments/CommentForm';
import CommentList from '../comments/CommentList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LabelIcon from '@mui/icons-material/Label';
import LabelDialog from '../../components/label/LabelDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import TagIcon from '@mui/icons-material/Tag';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { Visibility, VisibilityOff } from '@mui/icons-material';



interface Label {
  id: number;
  name: string;
  color: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description?: string;
  };
  onDelete: (id: number) => void;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number; // Add this field
  username: string; // Add this field
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openLabelDialog, setOpenLabelDialog] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [assignedUser, setAssignedUser] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredAssignedUsers, setFilteredAssignedUsers] = useState<User[]>([]);
  const [filteredTaggedUsers, setFilteredTaggedUsers] = useState<User[]>([]);
  const [assignSearchTerm, setAssignSearchTerm] = useState('');
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const token = localStorage.getItem('accessToken');

  // Fetch initially tagged users
  useEffect(() => {
    const fetchTaggedUsers = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/tasks/${task.id}/tags`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTaggedUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch tagged users:', error);
      }
    };

    fetchTaggedUsers();
  }, [task.id, token]);


  // Handle Tagging
  const handleTagUser = async (userId: number) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/tasks/${task.id}/tag`,
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const taggedUser = response.data.user;
      setTaggedUsers([...taggedUsers, taggedUser]);

      setTagSearchTerm('');
      setFilteredTaggedUsers([]);
    } catch (error) {
      console.error('Failed to tag user:', error);
    }
  };
  

  const searchUsers = async (query: string, setFilteredUsers: (users: User[]) => void) => {
    if (!query) {
      setFilteredUsers([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/search?query=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUsers(assignSearchTerm, setFilteredAssignedUsers);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [assignSearchTerm]);







  
    // fetch initital watch status
    useEffect(() => {

      const checkIfWatching = async () => {

        try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/tasks/${task.id}/is_watching` , {

        headers: {Authorization: `Bearer ${token}`}
      });
      setIsWatching(response.data.is_watching)
        } catch (error) {
          console.log('failed to fetch watch status' , error)
        }

      }
      checkIfWatching()
    } , [task.id , token])

    // Toggle watching status
    const toggleWatching = async () => {
      try {
        if (isWatching) {
          await axios.delete(`http://127.0.0.1:8000/api/v1/tasks/${task.id}/watch`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsWatching(false);  // Successfully stopped watching
        } else {
          await axios.post(`http://127.0.0.1:8000/api/v1/tasks/${task.id}/watch`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsWatching(true);  // Successfully started watching
        }
      } catch (error) {
        console.error('Failed to toggle watch status:', error);
      }
    };
    

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/projects/tasks/${task.id}/labels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedLabels(response.data);
      } catch (error) {
        console.error('Failed to fetch labels:', error);
      }
    };

    fetchLabels();
  }, [task.id, token]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenLabelDialog = () => setOpenLabelDialog(true);
  const handleCloseLabelDialog = () => setOpenLabelDialog(false);

  const handleLabelChange = (labels: Label[]) => {
    setSelectedLabels(labels);
  };

  const handleNewComment = (newComment : any) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };
  

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/tasks/${task.id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    fetchComments()
  } , [task.id])

  


    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        searchUsers(tagSearchTerm, setFilteredTaggedUsers);
      }, 300);
  
      return () => clearTimeout(delayDebounceFn);
    }, [tagSearchTerm]);

  return (
    <>
      <Card style={{ position: 'relative', borderRadius: '12px', marginBottom: '15px' }}>
        <CardContent>
        <Box display="flex" flexWrap="wrap" marginTop={1}>
            {selectedLabels.map((label) => (
              <Box
                key={label.id}
                style={{
                  backgroundColor: label.color,
                  color: 'white',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  margin: '2px',
                  fontSize: '0.75rem',
                }}
              >
              </Box>
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>{task.title}</Typography>
          {/* <Typography variant="body2" color="textSecondary">{task.description}</Typography> */}

          {/* Display selected labels as colored tags */}
          

          <IconButton
            style={{ position: 'absolute', top: 5, right: 5 }}
            onClick={handleOpenDialog}
          >
            <MoreVertIcon />
          </IconButton>
          {
            isWatching && (
              <VisibilityIcon style={{ color: '#44546f', position: 'absolute', bottom: 10, left: 20 , fontSize: '20px' ,  }}/>
            )
          }
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: { display: 'flex', flexDirection: 'row', borderRadius: '15px' },
        }}
      >
        {/* Left Side: Task Details */}
        <DialogContent style={{ flex: 2, paddingRight: '10px' }}>
          <Box marginBottom={2}>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2" color="textSecondary">{task.description}</Typography>
          </Box>

          {/* User Assignment/Search */}
          <Box marginBottom={2}>
            <Typography variant="subtitle1" fontWeight="bold">Assign Users</Typography>
            <TextField
              label="Search Users"
              value={assignSearchTerm}
              onChange={(e) => setAssignSearchTerm(e.target.value)}
              fullWidth
              margin="dense"
              placeholder="Invite by name or email"
            />
            <List>
              {filteredAssignedUsers.map((user) => (
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

          {/* Comments Section */}
          <Box marginTop={2}>
            <Typography variant="subtitle1" fontWeight="bold">Comments</Typography>
            <CommentForm taskId={task.id} onCommentAdded={handleNewComment} />
            <CommentList comments={comments} />
          </Box>

          <Box>
    <Typography variant="h6">Tag Users</Typography>
    <TextField
        label="Search users"
        variant="outlined"
        value={tagSearchTerm}
        onChange={(e) => setTagSearchTerm(e.target.value)}
        fullWidth
    />
    <List>
        {filteredTaggedUsers.map((user) => (
            <ListItem key={user.id}  component="div" onClick={() => handleTagUser(user.id)}>
                <Avatar>{user.username[0]}</Avatar>
                <ListItemText primary={user.username} secondary={user.email} />
            </ListItem>
        ))}
    </List>

    {/* Render tagged users */}
    <Typography variant="subtitle1">Tagged Users</Typography>
    <List>
        {taggedUsers.map((user) => (
            <ListItem key={user.id}>
                <Avatar>{user.username[0]}</Avatar>
                <ListItemText primary={user.username} secondary={user.email} />
            </ListItem>
        ))}
    </List>
</Box>


        </DialogContent>
<Box
  style={{
    flex: 1,
    backgroundColor: '#091e420f',
    color: 'white',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}
>
  {/* Action Items with Icons */}
  {[{
    label: isWatching ? 'Watching' : 'Watch', // Change label based on isWatching
    icon: isWatching ? <VisibilityOff /> : <Visibility />, // Change icon based on isWatching
    action: toggleWatching
  },
    { label: 'Labels', icon: <LabelIcon />, action: handleOpenLabelDialog },
    { label: 'Members', icon: <LinkIcon /> },
    { label: 'Relations', icon: <LinkIcon /> },
    { label: 'Tags', icon: <TagIcon /> },
    { label: 'Attachments', icon: <AttachFileIcon /> },
    { label: 'Location', icon: <AttachFileIcon /> }
  ].map((item) => (
    <ButtonBase
      key={item.label}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#3d474d',
        color: 'white',
        marginTop: '10px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
      }}
      onClick={item.action ? item.action : () => console.log(`Clicked ${item.label}`)}
    >
      <Box style={{ marginRight: '10px' }}>{item.icon}</Box>
      {item.label}
    </ButtonBase>
  ))}
</Box>

      </Dialog>

      <LabelDialog
        open={openLabelDialog}
        onClose={handleCloseLabelDialog}
        taskId={task.id}
        selectedLabels={selectedLabels}
        onLabelChange={handleLabelChange}
      />
    </>
  );
};

export default TaskCard;
