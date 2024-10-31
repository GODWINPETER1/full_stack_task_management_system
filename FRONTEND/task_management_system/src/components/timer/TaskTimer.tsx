import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';

interface TaskTimerProps {
  taskId: number;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ taskId}) => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Track in seconds
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const token = localStorage.getItem("accessToken")

  useEffect(() => {
    if (timerRunning && startTime) {
      const id = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else if (!timerRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerRunning, startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleStartTimer = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/tasks/${taskId}/start_timer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setTimerRunning(true);
        setStartTime(new Date());
        setElapsedTime(0);
      }
    } catch (error) {
      console.error("Failed to start timer", error);
    }
  };

  const handleStopTimer = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/tasks/${taskId}/stop_timer`,
        {
          duration: elapsedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setTimerRunning(false);
        setStartTime(null);
        setElapsedTime(0);
      }
    } catch (error) {
      console.error("Failed to stop timer", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6">{formatTime(elapsedTime)}</Typography>
      {timerRunning ? (
        <Button variant="contained" color="secondary" onClick={handleStopTimer}>
          Stop Timer
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleStartTimer}>
          Start Timer
        </Button>
      )}
    </Box>
  );
};

export default TaskTimer;
