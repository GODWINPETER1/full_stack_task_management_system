import React, { useState } from 'react';
import {
  Card, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Checkbox, FormControlLabel,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Icon for the menu
import UploadIcon from '@mui/icons-material/Upload'; // Icon for file upload
import DeleteIcon from '@mui/icons-material/Delete'; // Icon for deleting subtasks

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description?: string;
    status: string;
    due_date?: string | null;
    priority?: 'Low' | 'Medium' | 'High';
    subtasks?: Subtask[];
    attachments?: string[];
  };
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [comments, setComments] = useState('');

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  

  // Function to add a new subtask
  const handleAddSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: subtasks.length + 1, title: newSubtask, completed: false },
    ]);
    setNewSubtask('');
  };

  // Function to remove a subtask
  const handleRemoveSubtask = (id: number) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

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

      {/* Task Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Task Options</DialogTitle>
        <DialogContent>
          <p><strong>Task Title:</strong> {task.title}</p>
          <p><strong>Description:</strong> {task.description || 'No description provided'}</p>
          <p><strong>Due Date:</strong> {task.due_date ? task.due_date : 'No due date'}</p>

          {/* Priority Selector */}
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>

          {/* Subtasks */}
          <h5>Subtasks</h5>
          {subtasks.map((subtask) => (
            <div key={subtask.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={subtask.completed}
                    onChange={() =>
                      setSubtasks(subtasks.map((s) => s.id === subtask.id
                        ? { ...s, completed: !s.completed } : s))
                    }
                  />
                }
                label={subtask.title}
              />
              <IconButton onClick={() => handleRemoveSubtask(subtask.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <TextField
            label="Add Subtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            fullWidth
            margin="dense"
          />
          <Button onClick={handleAddSubtask} color="primary">Add Subtask</Button>

          {/* Attachments */}
          <h5>Attachments</h5>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            color="primary"
          >
            Upload File
            <input type="file" hidden />
          </Button>

          {/* Comments Section */}
          <h5>Comments</h5>
          <TextField
            label="Add a Comment"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            fullWidth
            margin="dense"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onDelete(task.id)} color="secondary">
            Delete Task
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCard;
