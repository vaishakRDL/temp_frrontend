import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button,
    Stack, IconButton, InputAdornment, Zoom, CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ChangePassword = () => {
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 1000);
    };

    const actionButtonStyle = {
        backgroundColor: '#4a4a4a',
        color: '#00ffff',
        textTransform: 'none',
        fontWeight: 600,
        px: 8,
        py: 1,
        borderRadius: '4px',
        border: '1px solid #00f5ff',
        fontSize: '1.2rem',
        '&:hover': {
            backgroundColor: '#333',
        }
    };

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '0px',
            bgcolor: '#fff',
            height: '35px',
            fontSize: '1rem'
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#fcfdfe', minHeight: '100%' }}>
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 6 }}>Change Password</Typography>

            <Box sx={{ maxWidth: '600px', ml: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    {/* Current Password */}
                    <Grid item xs={5}>
                        <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'right', pr: 2 }}>Current Password:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            fullWidth
                            size="small"
                            type={showPasswords.current ? 'text' : 'password'}
                            sx={inputStyle}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => toggleVisibility('current')} edge="end" size="small">
                                            {showPasswords.current ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* New Password */}
                    <Grid item xs={5}>
                        <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'right', pr: 2 }}>New Password:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            fullWidth
                            size="small"
                            type={showPasswords.new ? 'text' : 'password'}
                            sx={inputStyle}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => toggleVisibility('new')} edge="end" size="small">
                                            {showPasswords.new ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Confirm Password */}
                    <Grid item xs={5}>
                        <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'right', pr: 2 }}>Confirm New Password:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            fullWidth
                            size="small"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            sx={inputStyle}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => toggleVisibility('confirm')} edge="end" size="small">
                                            {showPasswords.confirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Save Button Row */}
                    <Grid item xs={5}></Grid>
                    <Grid item xs={7}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{ ...actionButtonStyle, mt: 2 }}
                        >
                            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Success Animation */}
            <Zoom in={isSaved}>
                <Paper sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    px: 3, py: 1.5,
                    borderRadius: '12px',
                    bgcolor: '#10b981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)',
                    zIndex: 2000
                }}>
                    <CheckCircleIcon />
                    <Typography sx={{ fontWeight: 700 }}>Password Updated Successfully!</Typography>
                </Paper>
            </Zoom>
        </Box>
    );
};

export default ChangePassword;
