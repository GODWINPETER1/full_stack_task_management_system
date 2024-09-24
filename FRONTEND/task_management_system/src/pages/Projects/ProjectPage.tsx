import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { addTask, setTasks, updateTask, deleteTask } from '../../redux/taskSlice';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from '../../components/dialogs/taskCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoneIcon from '@mui/icons-material/Done';
import InfoIcon from '@mui/icons-material/Info';  // Importing Info icon for empty columns

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);  // Dialog open/close state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/projects/${projectId}/tasks`);
        dispatch(setTasks(response.data));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [projectId, dispatch]);

  const handleCreateTask = async () => {
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'To Do',
      due_date: newTaskDueDate || null,
    };

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/v1/projects/${projectId}/tasks`, newTask);
      dispatch(addTask(response.data));
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate(null);
      setOpen(false);  // Close the dialog after task creation
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (id: number, status: string) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const newStatus = status === 'Doing' ? 'In Progress' : status;
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/v1/projects/tasks/${id}`, {
          ...updatedTask,
          status: newStatus,
        });
        dispatch(updateTask(response.data));
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/projects/tasks/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const draggedTaskId = parseInt(result.draggableId, 10);
    const newStatus = destination.droppableId;

    if (source.droppableId !== destination.droppableId) {
      handleUpdateTask(draggedTaskId, newStatus);
    }
  };

  const renderColumn = (status: string, icon: JSX.Element, headerColor: string) => {
    const filteredTasks = tasks.filter((task) => task.status === status);

    return (
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            className="column"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              marginRight: '10px',
              flex: 1,
              borderRight: '1px solid #ccc',
              padding: '10px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: headerColor,
              padding: '10px',
              borderRadius: '4px',
              color: 'white',
              marginBottom: '10px',
            }}>
              {icon}
              <h3 style={{ marginLeft: '8px' }}>{status}</h3>
            </div>

            {/* Show message if no tasks are available in this status */}
            {filteredTasks.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#757575', padding: '20px' }}>
                <InfoIcon style={{ fontSize: '40px', marginBottom: '10px' }} />
                <p>No tasks added yet</p>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: '8px', // Reduce space between task cards
                      }}
                    >
                      <TaskCard task={task} onDelete={handleDeleteTask} />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Project {projectId}</h2>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create Task
        </Button>
      </div>

      {/* Dialog for task creation */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            fullWidth
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Task Description"
            fullWidth
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            margin="dense"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleCreateTask} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {renderColumn('To Do', <AssignmentIcon />, 'rgb(46, 215, 216)')}
          {renderColumn('In Progress', <HourglassTopIcon />, 'rgb(0, 170, 255)')}
          {renderColumn('Done', <DoneIcon />, '#4caf50')}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectPage;
