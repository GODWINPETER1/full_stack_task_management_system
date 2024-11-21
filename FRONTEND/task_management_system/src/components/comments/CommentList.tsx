import React from 'react';
import { List, ListItem, ListItemText, Avatar, Box, Typography } from '@mui/material';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  tagged_users?: number[];
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <List>
      {comments.map((comment) => (
        <ListItem key={comment.id} alignItems="flex-start">
          <Avatar alt={comment.username || 'User'} />
          <Box marginLeft={2}>
            <Typography variant="body1">{comment.username || 'Unknown User'}</Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(comment.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body2">{comment.content}</Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default CommentList;
