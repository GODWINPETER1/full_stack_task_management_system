import React from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ open, message, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <SnackbarContent
        message={message}
        action={
          <button onClick={onClose}>Close</button>
        }
      />
    </Snackbar>
  );
};

export default Notification;
