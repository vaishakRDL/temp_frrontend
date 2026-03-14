import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button,
    FormControl, Select, MenuItem, Stack, Divider,
    Radio, RadioGroup, FormControlLabel,
    IconButton, Zoom, alpha, CircularProgress, ButtonGroup
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SdCardIcon from '@mui/icons-material/SdCard';
import { OfflineDataReadService, OfflineDataWriteService } from '../../../../../services/LoginPageService';

const OfflineData = () => {
    const [uploadMode, setUploadMode] = useState('Disable');
    const [logFile, setLogFile] = useState('');
    const [saving, setSaving] = useState(false);
    const [reading, setReading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const fetchOfflineMode = () => {
        setReading(true);
        OfflineDataReadService((res) => {
            setReading(false);
            const data = res?.data || res;
            if (data && data.mode) {
                setUploadMode(data.mode === '02' ? 'Enable' : 'Disable');
            }
        }, (err) => {
            setReading(false);
            console.error("Error reading offline mode:", err);
        });
    };

    React.useEffect(() => {
        fetchOfflineMode();
    }, []);

    const handleSave = () => {
        setSaving(true);
        const payload = {
            mode: uploadMode === 'Enable' ? '02' : '00'
        };
        OfflineDataWriteService(payload, (res) => {
            setSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, (err) => {
            setSaving(false);
            alert("Failed to save offline mode");
        });
    };

    const actionButtonStyle = {
        backgroundColor: '#4a4a4a',
        color: '#00ffff',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
        borderRadius: '4px',
        border: '1px solid #00f5ff',
        '&:hover': {
            backgroundColor: '#333',
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#fcfdfe', minHeight: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>Offline Data</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Column 1: Offline File Upload */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        position: 'relative',
                        mt: 2
                    }}>
                        <Typography variant="subtitle2" sx={{
                            position: 'absolute',
                            top: -12,
                            left: 20,
                            bgcolor: '#fff',
                            px: 1,
                            fontWeight: 700,
                            color: '#475569'
                        }}>
                            Offline File Upload
                        </Typography>

                        <RadioGroup
                            row
                            value={uploadMode}
                            onChange={(e) => setUploadMode(e.target.value)}
                            sx={{ mt: 1 }}
                        >
                            <FormControlLabel value="Enable" control={<Radio size="small" />} label="Enable" sx={{ mr: 4 }} />
                            <FormControlLabel value="Disable" control={<Radio size="small" />} label="Disable" />
                        </RadioGroup>
                    </Paper>

                    <Box sx={{ mt: 4 }}>
                        <ButtonGroup variant="contained" sx={{ height: 48, borderRadius: '8px', overflow: 'hidden', border: '1px solid #00f5ff' }}>
                            <Button
                                onClick={fetchOfflineMode}
                                disabled={reading || saving}
                                sx={{ ...actionButtonStyle, px: 6, bgcolor: '#455a64', color: '#00bcd4' }}
                            >
                                {reading ? <CircularProgress size={24} color="inherit" /> : 'Read'}
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={reading || saving}
                                sx={{ ...actionButtonStyle, px: 6, bgcolor: '#0f172a', color: '#00f5ff' }}
                            >
                                {saving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Grid>

                {/* Column 2: Offline Log File */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        position: 'relative',
                        mt: 2
                    }}>
                        <Typography variant="subtitle2" sx={{
                            position: 'absolute',
                            top: -12,
                            left: 20,
                            bgcolor: '#fff',
                            px: 1,
                            fontWeight: 700,
                            color: '#475569'
                        }}>
                            Offline Log File
                        </Typography>

                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Log Files:</Typography>
                                <Select
                                    size="small"
                                    value={logFile}
                                    onChange={(e) => setLogFile(e.target.value)}
                                    sx={{ minWidth: 150, borderRadius: '4px' }}
                                >
                                    <MenuItem value="">Choose...</MenuItem>
                                    <MenuItem value="log_2024_01_01">log_2024_01_01.json</MenuItem>
                                    <MenuItem value="log_2024_01_02">log_2024_01_02.json</MenuItem>
                                </Select>
                                <IconButton size="small" color="primary">
                                    <RefreshIcon sx={{ color: '#0f172a' }} />
                                </IconButton>
                                <Button
                                    variant="contained"
                                    sx={{
                                        ...actionButtonStyle,
                                        bgcolor: '#4a4a4a',
                                        fontSize: '0.8rem',
                                        flexShrink: 0
                                    }}
                                >
                                    Download Json Format
                                </Button>
                            </Box>

                            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        ...actionButtonStyle,
                                        flex: 1
                                    }}
                                >
                                    Convert Json to CSV
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        ...actionButtonStyle,
                                        flex: 1
                                    }}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Notes Section */}
            <Box sx={{ mt: 6 }}>
                <Stack spacing={2}>
                    <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 600 }}>
                        <Typography component="span" sx={{ fontWeight: 800 }}>Note1:</Typography> Offline data may take longer time to upload during this time live data will be missed.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 600 }}>
                        <Typography component="span" sx={{ fontWeight: 800 }}>Note2:</Typography> Larger Offline duration data preferred to download from the device manually.
                    </Typography>
                </Stack>
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
                    <Typography sx={{ fontWeight: 700 }}>Settings Updated!</Typography>
                </Paper>
            </Zoom>
        </Box>
    );
};

export default OfflineData;
