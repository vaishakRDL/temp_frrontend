import React from 'react';
import {
    Box, Typography, Grid, Paper, FormControl, Select, MenuItem,
    Button, Stack, Zoom, CircularProgress, alpha
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import RefreshIcon from '@mui/icons-material/Refresh';

const RtuSettings = ({ rtuSettings, handleChange, handleSave, handleRead, saving, reading, isSaved }) => {
    const isBusy = saving || reading;

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 3, opacity: isBusy ? 0.7 : 1 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622', mb: 1 }}>
                    RTU Com.Port Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Configure your Modbus RTU serial port communication parameters
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4, borderRadius: '16px',
                            border: '1px solid #eef2f6',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.03)',
                            pointerEvents: isBusy ? 'none' : 'auto'
                        }}
                    >
                        <Grid container spacing={3}>
                            {[
                                {
                                    label: 'Baud Rate', field: 'baudRate', options: [
                                        { label: '4800', value: '01' },
                                        { label: '9600', value: '02' },
                                        { label: '14400', value: '03' },
                                        { label: '19200', value: '04' },
                                        { label: '38400', value: '08' },
                                        { label: '57600', value: '0C' },
                                        { label: '115200', value: '18' },
                                    ]
                                },
                                {
                                    label: 'Data Bit', field: 'dataBit', options: [
                                        { label: '7 bit', value: '07' },
                                        { label: '8 bit', value: '08' },
                                    ]
                                },
                                {
                                    label: 'Parity', field: 'parity', options: [
                                        { label: 'None', value: '00' },
                                        { label: 'Odd', value: '01' },
                                        { label: 'Even', value: '02' },
                                    ]
                                },
                                {
                                    label: 'Stop Bit', field: 'stopBit', options: [
                                        { label: '1 bit', value: '01' },
                                        { label: '2 bit', value: '02' },
                                    ]
                                }
                            ].map((item) => (
                                <Grid item xs={12} sm={6} key={item.field}>
                                    <FormControl fullWidth disabled={isBusy}>
                                        <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {item.label}
                                        </Typography>
                                        <Select
                                            value={rtuSettings[item.field]}
                                            onChange={handleChange(item.field)}
                                            size="small"
                                            sx={{
                                                borderRadius: '8px',
                                                backgroundColor: '#f9fafb',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#051622' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#051622' }
                                            }}
                                        >
                                            {item.options.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={isBusy}
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                sx={{
                                    backgroundColor: '#051622', color: '#fff',
                                    px: 4, py: 1, borderRadius: '8px',
                                    textTransform: 'none', fontWeight: 600,
                                    '&:hover': { backgroundColor: '#183b52' }
                                }}
                            >
                                {saving ? 'Writing...' : 'Write Settings'}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={handleRead}
                                disabled={isBusy}
                                startIcon={reading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                                sx={{
                                    borderColor: '#051622', color: '#051622',
                                    px: 4, py: 1, borderRadius: '8px',
                                    textTransform: 'none', fontWeight: 600,
                                    '&:hover': { borderColor: '#183b52', backgroundColor: alpha('#051622', 0.04) }
                                }}
                            >
                                {reading ? 'Reading...' : 'Read Settings'}
                            </Button>

                            <Zoom in={isSaved}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'success.main', ml: { sm: 2 } }}>
                                    <CheckCircleIcon fontSize="small" />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Settings applied successfully</Typography>
                                </Stack>
                            </Zoom>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', backgroundColor: alpha('#051622', 0.02), border: '1px dashed #e0e0e0' }}>
                        <Stack spacing={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#051622' }}>Quick Tips</Typography>
                            <Typography variant="caption" color="text.secondary">
                                • Ensure the Baud Rate matches your slave device's configuration.
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                • Most Modbus RTU devices use 8-N-1 (8 Data Bits, None Parity, 1 Stop Bit) as default.
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                • For longer cable lengths, lower baud rates are more stable.
                            </Typography>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RtuSettings;
