import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

interface ReminderFormProps {
  taskId: number;
  onReminderAdded: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ taskId, onReminderAdded }) => {
  const [reminderTime, setReminderTime] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      await axios.post(`http://127.0.0.1:8000/api/v1/reminders/`, {
        task_id: taskId,
        reminder_time: reminderTime
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReminderTime('');
      onReminderAdded();
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        type="datetime-local"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
        required
      />
      <Button type="submit">Set Reminder</Button>
    </form>
  );
};

export default ReminderForm;
