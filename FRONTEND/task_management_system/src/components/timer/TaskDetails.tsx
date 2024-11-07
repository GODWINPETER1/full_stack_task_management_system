// src/components/TaskDetails.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface TimeLog {
  id: number;
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  duration: number;
}

interface TaskDetailsProps {
  taskId: number;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId }) => {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await axios.get<TimeLog[]>(
          `http://127.0.0.1:8000/api/v1/tasks/${taskId}/time_logs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTimeLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch time logs', error);
      }
    };
    fetchTimeLogs();
  }, [taskId, token]);

  const totalDuration = timeLogs.reduce((sum, log) => sum + log.duration, 0);

  return (
    <TableContainer component={Paper}>
      <h3>
        Total Time Spent: {Math.floor(totalDuration / 3600)}:
        {Math.floor((totalDuration % 3600) / 60).toString().padStart(2, '0')}:
        {(totalDuration % 60).toString().padStart(2, '0')}
      </h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Duration (s)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timeLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.start_time).toLocaleString()}</TableCell>
              <TableCell>
                {log.end_time ? new Date(log.end_time).toLocaleString() : 'In Progress'}
              </TableCell>
              <TableCell>{log.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskDetails;
