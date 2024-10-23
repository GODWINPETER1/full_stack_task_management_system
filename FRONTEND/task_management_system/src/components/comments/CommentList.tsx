import React from 'react';
import Comment from './Comment';

interface CommentListProps {
  comments: { id: number; content: string; created_at: string }[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div>
      {comments.map(comment => (
        <Comment key={comment.id} content={comment.content} createdAt={comment.created_at} />
      ))}
    </div>
  );
};

export default CommentList;
