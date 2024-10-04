import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getProjectAnalytics, getTaskAnalytics } from '../../utils/analytics';

const Overview: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('');
  const { username, userId } = useAuth();
  const [projectAnalytics, setProjectAnalytics] = useState<{
    total_projects: number;
    active_projects: number;
    completed_projects: number;
  } | null>(null);
  
  const [taskAnalytics, setTaskAnalytics] = useState<{
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    task_progress: number;
  } | null>(null);

  // Fetch project analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (userId) {
          const projectData = await getProjectAnalytics(userId);
          setProjectAnalytics(projectData);

          const taskData = await getTaskAnalytics(userId);
          setTaskAnalytics(taskData);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [userId]);

  // Function to determine the greeting based on the current hour
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Update the clock every second
  useEffect(() => {
    setGreeting(getGreeting());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* Greeting Card */}
        <Grid container spacing={2} style={{ padding: '20px 0' }}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {greeting}, {username}!
            </Typography>
            <Typography variant="h3" color="primary">
              {currentTime}
            </Typography>
            <Typography variant="body1">
              Here's an overview of your tasks and projects for today.
            </Typography>
          </Grid>
        </Grid>
        
        {/* Projects Overview Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Projects Overview</Typography>
              {projectAnalytics ? (
                <>
                  <Typography>Total Projects: {projectAnalytics.total_projects}</Typography>
                  <Typography>Active Projects: {projectAnalytics.active_projects}</Typography>
                  <Typography>Completed Projects: {projectAnalytics.completed_projects}</Typography>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Loading project analytics...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Task Analytics Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Task Analytics</Typography>
              {taskAnalytics ? (
                <>
                  <Typography>Total Tasks: {taskAnalytics.total_tasks}</Typography>
                  <Typography>Completed Tasks: {taskAnalytics.completed_tasks}</Typography>
                  <Typography>Pending Tasks: {taskAnalytics.pending_tasks}</Typography>
                  <Typography>Task Progress: {taskAnalytics.task_progress}%</Typography>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Loading task analytics...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
