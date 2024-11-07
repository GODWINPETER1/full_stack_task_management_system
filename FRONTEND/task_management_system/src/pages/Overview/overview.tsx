import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Box, LinearProgress, Divider } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getProjectAnalytics, getTaskAnalytics } from '../../utils/analytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Overview: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('');
  const { username, userId , user } = useAuth();
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

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    setGreeting(getGreeting());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const taskDistribution = taskAnalytics ? [
    { name: 'Completed', value: taskAnalytics.completed_tasks },
    { name: 'Pending', value: taskAnalytics.pending_tasks }
  ] : [];

  const projectData = projectAnalytics ? [
    { name: 'Total Projects', value: projectAnalytics.total_projects },
    { name: 'Active Projects', value: projectAnalytics.active_projects },
    { name: 'Completed Projects', value: projectAnalytics.completed_projects }
  ] : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        padding: 4,
        backgroundColor: '#f6f7ff',  // Light background for contrast
      }}
    >
      <Box sx={{ paddingBottom: 2 }}>
        {/* Greeting Section */}
        <Typography variant="h4" gutterBottom>{greeting}, {user?.name || username}!</Typography>
        <Typography variant="h3" color="primary">{currentTime}</Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>Here's an overview of your tasks and projects for today.</Typography>
        <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
        <Grid container spacing={4}>
          {/* Projects Overview */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 2, borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Projects Overview</Typography>
                {projectAnalytics ? (
                  <>
                    <Typography>Total Projects: {projectAnalytics.total_projects}</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={projectData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">Loading project analytics...</Typography>
                )}

                
              </CardContent>
            </Card>
          </Grid>

          {/* Task Analytics */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 2, borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Task Analytics</Typography>
                {taskAnalytics ? (
                  <>
                    <Typography>Total Tasks: {taskAnalytics.total_tasks}</Typography>
                    <Typography>Completed Tasks: {taskAnalytics.completed_tasks}</Typography>
                    <Typography>Pending Tasks: {taskAnalytics.pending_tasks}</Typography>
                    <Typography>Task Progress: {taskAnalytics.task_progress}%</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={taskDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                          dataKey="value"
                        >
                          {taskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <Typography sx={{ marginTop: 2 }}>Task Progress</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={taskAnalytics.task_progress}
                      sx={{ marginTop: 1, borderRadius: 2, height: 10 }}
                    />
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">Loading task analytics...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Overview;
