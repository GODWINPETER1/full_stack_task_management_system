import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@mui/material';

interface Reminder {
  id: number;
  task_id: number;
  reminder_time: string; // Change the type if necessary
}

interface ReminderListProps {
  taskId: number;
}

const ReminderList: React.FC<ReminderListProps> = ({ taskId }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]); // Explicitly define the type here

  const token = localStorage.getItem('accessToken');

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/reminders/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReminders(response.data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [taskId]);

  return (
    <List>
      {reminders.length === 0 ? (
        <ListItem>No reminders set for this task.</ListItem>
      ) : (
        reminders.map((reminder) => (
          <ListItem key={reminder.id}>
            <ListItemText primary={new Date(reminder.reminder_time).toLocaleString()} />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default ReminderList;
