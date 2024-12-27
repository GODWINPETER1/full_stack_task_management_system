import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../redux/store';
import { addTask } from '../../redux/taskSlice';
import { Modal, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Box, Paper, Tooltip } from '@mui/material';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  priority?: string;
}

const TaskCalendar: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const token = localStorage.getItem("accessToken");

  const [events, setEvents] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string | null>(null);
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [assignedUser, setAssignedUser] = useState<number | null>(null); // Add user assignment

  useEffect(() => {
    if (!projectId) {
      console.error("Project ID is missing. Check the URL.");
      return;
    }

    // Map tasks to calendar events
    const taskEvents = tasks.map((task) => ({
      title: task.title,
      start: new Date(task.due_date || new Date()),
      end: new Date(task.due_date || new Date()),
      allDay: true,
      priority: task.priority,
    }));
    setEvents(taskEvents);
  }, [tasks, projectId]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewTaskDueDate(date.toISOString().split('T')[0]); // Set the date for the form
    setModalOpen(true);
  };

  const handleCreateTask = async () => {
    if (newTaskTitle && selectedDate) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        status: 'To Do',
        due_date: newTaskDueDate || null,
        priority: newTaskPriority,
        user_id: assignedUser, // Assign user to task
      };

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/v1/projects/${projectId}/tasks`,
          newTask,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(addTask(response.data));
      } catch (error) {
        console.error('Error creating task:', error);
      }

      // Reset form fields and close modal
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate(null);
      setNewTaskPriority('Medium');
      setAssignedUser(null);
      setModalOpen(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Task Calendar
        </Typography>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
          selectable
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.priority === 'High' ? 'red' : event.priority === 'Medium' ? 'orange' : 'green',
              color: 'white',
            },
          })}
          components={{
            event: ({ event }) => (
              <Tooltip title={event.title} placement="top">
                <div style={{ padding: '5px' }}>{event.title}</div>
              </Tooltip>
            ),
          }}
        />
      </Paper>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          component={Paper}
          elevation={4}
          sx={{
            padding: '30px',
            margin: '10% auto',
            maxWidth: '500px',
            borderRadius: '10px',
            outline: 'none',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Create Task
          </Typography>
          <TextField
            label="Task Title"
            fullWidth
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            margin="dense"
            required
          />
          <TextField
            label="Task Description"
            fullWidth
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            margin="dense"
            multiline
            rows={3}
          />
          <TextField
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={newTaskDueDate || ''}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Assign to User"
            fullWidth
            select
            value={assignedUser || ''}
            onChange={(e) => setAssignedUser(Number(e.target.value))}
            margin="dense"
          >
            {/* Dynamically populate users */}
            <MenuItem value={1}>User 1</MenuItem>
            <MenuItem value={2}>User 2</MenuItem>
            <MenuItem value={3}>User 3</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTask}
            fullWidth
            sx={{ marginTop: '20px', padding: '10px' }}
          >
            Create Task
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskCalendar;
