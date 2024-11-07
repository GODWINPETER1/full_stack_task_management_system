import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  Button,
  Box,
  TextField,
  ListItemButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface Label {
  id: number;
  name: string;
  color: string;
}

interface LabelDialogProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
  selectedLabels: Label[];
  onLabelChange: (labels: Label[]) => void;
}

const LabelDialog: React.FC<LabelDialogProps> = ({
  open,
  onClose,
  taskId,
  selectedLabels,
  onLabelChange,
}) => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#000000'); // Default color

  const fetchLabels = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/labels');
      setLabels(response.data);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleToggleLabel = (label: Label) => {
    const isSelected = selectedLabels.some((l) => l.id === label.id);
    const updatedLabels = isSelected
      ? selectedLabels.filter((l) => l.id !== label.id)
      : [...selectedLabels, label];
    onLabelChange(updatedLabels);

    const method = isSelected ? 'delete' : 'post';
    axios({
      method: method,
      url: `http://127.0.0.1:8000/api/v1/projects/tasks/${taskId}/labels/${label.id}`,
    }).catch((error) => console.error('Error updating label:', error));
  };

  const handleAddNewLabel = async () => {
    if (!newLabelName) return;
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/labels', {
        name: newLabelName,
        color: newLabelColor,
      });
      const newLabel = response.data;
      setLabels([...labels, newLabel]);
      setNewLabelName('');
      setNewLabelColor('#000000');
    } catch (error) {
      console.error('Error adding new label:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>Manage Labels</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* New Label Section */}
        <Box display="flex" alignItems="center" marginBottom={2}>
          <TextField
            label="Label Name"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
          />
          <input
            type="color"
            value={newLabelColor}
            onChange={(e) => setNewLabelColor(e.target.value)}
            style={{ marginLeft: '10px', cursor: 'pointer', height: '40px' }}
          />
          <Button onClick={handleAddNewLabel} color="primary" variant="contained" style={{ marginLeft: '10px' }}>
            Add
          </Button>
        </Box>

        {/* Existing Labels */}
        <List>
          {labels.map((label) => (
            <ListItem key={label.id} disablePadding>
              <ListItemButton
                onClick={() => handleToggleLabel(label)}
                style={{
                  backgroundColor: selectedLabels.some((l) => l.id === label.id)
                    ? label.color
                    : 'transparent',
                }}
              >
                <Checkbox
                  checked={selectedLabels.some((l) => l.id === label.id)}
                  style={{ color: label.color }}
                />
                <ListItemText primary={label.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Button onClick={onClose} color="primary" style={{ margin: '10px' }}>
        Done
      </Button>
    </Dialog>
  );
};

export default LabelDialog;
