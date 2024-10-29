// src/components/notifications/NotificationList.tsx

import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/notifications'); // API endpoint to fetch notifications
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <List>
      {notifications.map((notification) => (
        <ListItem key={notification.id}>
          <ListItemText primary={notification.message} />
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationList;
