import React from 'react';
import { Box, Container } from '@mui/material';
import NotificationStatusResults from '../components/notification/NotificationStatusResults';

function NotificationStatusComponent() {
    return (
        <Container maxWidth={false} style={{ marginTop: 0 }}>
            <Box sx={{ mt: 1 }}>
                <NotificationStatusResults />
            </Box>
        </Container>
    );
}

export default NotificationStatusComponent;
