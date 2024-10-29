// frontend/pages/index.js
import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function Home() {
    const [username, setUsername] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    // Fetch comments initially
    useEffect(() => {
        axios.get('http://localhost:3001/api/comments').then((response) => {
            setComments(response.data);
        });

        // Listen for new comments from Socket.IO
        socket.on('newComment', (newComment) => {
            setComments((prevComments) => [newComment, ...prevComments]);
        });

        return () => socket.off('newComment');
    }, []);

    // Handle login
    const handleLogin = () => {
        axios.post('http://localhost:3001/api/login', { username })
            .then((response) => setSessionId(response.data.sessionId))
            .catch(console.error);
    };

    // Handle posting a new comment
    const handlePostComment = () => {
        axios.post('http://localhost:3001/api/comments', { sessionId, comment })
            .then((response) => setComment(''))
            .catch(console.error);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Comment System</Typography>
            {!sessionId ? (
                <div>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
                </div>
            ) : (
                <div>
                    <TextField
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" fullWidth onClick={handlePostComment}>Post Comment</Button>
                </div>
            )}
            <Typography variant="h5" sx={{ mt: 4 }}>Comments</Typography>
            <List>
                {comments.map((c) => (
                    <ListItem key={c.id} alignItems="flex-start">
                        <ListItemText
                            primary={`${c.username} (${new Date(c.timestamp).toLocaleString()})`}
                            secondary={c.comment}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}
