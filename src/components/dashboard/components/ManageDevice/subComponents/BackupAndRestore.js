import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, Button,
    Stack, Zoom, CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BackupAndRestore = () => {
    const [action, setAction] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const handleAction = (type) => {
        setAction(type);
        setTimeout(() => {
            setAction(null);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 1500);
    };

    // Standard styling matching the simplified "Offline Data" look
    const actionButtonStyle = {
        backgroundColor: '#4a4a4a',
        color: '#00ffff',
        textTransform: 'none',
        fontWeight: 500,
        px: 3,
        py: 0.8,
        borderRadius: '0px', // Standard sharp edges
        border: '1px solid #00f5ff',
        minWidth: '120px',
        fontSize: '0.9rem',
        '&:hover': {
            backgroundColor: '#333',
        }
    };

    const fieldSetStyle = {
        p: 4,
        border: '1px solid #999',
        borderRadius: '0px',
        position: 'relative',
        mt: 4,
        maxWidth: '800px'
    };

    const legendTitleStyle = {
        position: 'absolute',
        top: -12,
        left: 10,
        bgcolor: '#fff',
        px: 0.5,
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#000'
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#fff', minHeight: '100%', color: '#000' }}>
            {/* Header and Restart button row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, maxWidth: '800px' }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>Backup and Restore</Typography>

                <Button
                    variant="contained"
                    onClick={() => handleAction('Restarting...')}
                    sx={{ ...actionButtonStyle }}
                >
                    {action === 'Restarting...' ? <CircularProgress size={18} color="inherit" /> : 'Restart'}
                </Button>
            </Box>

            {/* Simple Fieldset Container */}
            <Box sx={fieldSetStyle}>
                <Typography sx={legendTitleStyle}>Configuration Backup/Restore</Typography>

                <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                    <Button
                        variant="contained"
                        onClick={() => handleAction('Backing up...')}
                        sx={{ ...actionButtonStyle }}
                    >
                        {action === 'Backing up...' ? <CircularProgress size={18} color="inherit" /> : 'Backup'}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleAction('Restoring...')}
                        sx={{ ...actionButtonStyle }}
                    >
                        {action === 'Restoring...' ? <CircularProgress size={18} color="inherit" /> : 'Restore'}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleAction('Resetting...')}
                        sx={{ ...actionButtonStyle }}
                    >
                        {action === 'Resetting...' ? <CircularProgress size={18} color="inherit" /> : 'Factory Default'}
                    </Button>
                </Stack>
            </Box>

            {/* Notification */}
            <Zoom in={isSaved}>
                <Paper elevation={3} sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    px: 3, py: 1,
                    bgcolor: '#10b981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    zIndex: 2000
                }}>
                    <CheckCircleIcon size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Operation Successful</Typography>
                </Paper>
            </Zoom>
        </Box>
    );
};

export default BackupAndRestore;
