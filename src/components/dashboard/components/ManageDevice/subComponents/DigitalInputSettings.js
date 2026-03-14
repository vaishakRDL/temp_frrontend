import React, { useState, useCallback } from 'react';
import {
    Box, Typography, Button, Stack, TextField,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Checkbox, Zoom, alpha, CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { DigitalInputSettingsService, DigitalInputSettingsReadService } from '../../../../../services/LoginPageService';


const buildDefaultChannels = () =>
    Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        tagName: `DIP${i + 1}`,
        enabled: false,
    }));

const DigitalInputSettings = () => {
    const [channels, setChannels] = useState(buildDefaultChannels);
    const [selectedRow, setSelectedRow] = useState(1);
    const [saving, setSaving] = useState(false);
    const [reading, setReading] = useState(false);
    const [saved, setSaved] = useState(false);

    const isBusy = saving || reading;

    const handleToggle = useCallback((id) =>
        setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, enabled: !ch.enabled } : ch)), []);

    const handleTagChange = useCallback((id) => (e) =>
        setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, tagName: e.target.value } : ch)), []);

    const handleRead = useCallback(() => {
        setReading(true);
        DigitalInputSettingsReadService((data) => {
            setReading(false);
            if (data && data.channels) {
                const mappedChannels = data.channels.map(ch => ({
                    id: parseInt(ch.chnl, 10),
                    tagName: ch.tag,
                    enabled: ch.status === "02"
                }));
                // Fill up to 4 channels if necessary or just use what api returns
                setChannels(mappedChannels);
            }
        }, (errStatus, errMsg) => {
            setReading(false);
            console.error("Read Error:", errMsg);
        });
    }, []);

    const handleSave = useCallback(() => {
        setSaving(true);
        const payload = {
            channels: channels.map(ch => ({
                chnl: String(ch.id).padStart(2, '0'),
                status: ch.enabled ? "02" : "01",
                tag: ch.tagName
            }))
        };

        DigitalInputSettingsService(payload, (data) => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }, (errStatus, errMsg) => {
            setSaving(false);
            alert("Failed to save settings: " + (errMsg || "Unknown error"));
        });
    }, [channels]);

    React.useEffect(() => {
        handleRead();
    }, [handleRead]);

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, opacity: isBusy ? 0.7 : 1 }}>

            {/* Title */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#051622' }}>
                Digital Input
            </Typography>

            {/* Refresh + Save buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={reading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                    onClick={handleRead}
                    disabled={isBusy}
                    sx={{
                        backgroundColor: '#37474f', color: '#00bcd4',
                        textTransform: 'none', fontWeight: 600, borderRadius: '4px',
                        '&:hover': { backgroundColor: '#455a64' },
                    }}
                >
                    {reading ? 'Reading…' : 'Refresh'}
                </Button>
                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={isBusy}
                    sx={{
                        backgroundColor: '#37474f', color: '#00bcd4',
                        textTransform: 'none', fontWeight: 600, borderRadius: '4px',
                        '&:hover': { backgroundColor: '#455a64' },
                        '&:disabled': { opacity: 0.65 },
                    }}
                >
                    {saving ? 'Saving…' : 'Save'}
                </Button>
            </Box>

            {/* Table */}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: '1px solid #ccc', borderRadius: '4px', maxWidth: 620, pointerEvents: isBusy ? 'none' : 'auto' }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 40, borderRight: '1px solid #e0e0e0' }} />
                            <TableCell sx={{ fontWeight: 600, color: '#00bcd4', borderRight: '1px solid #e0e0e0' }}>
                                Channel
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, color: '#00bcd4', borderRight: '1px solid #e0e0e0' }}>
                                Enable/Disable
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#00bcd4' }}>
                                Tagname
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {channels.map((ch) => (
                            <TableRow
                                key={ch.id}
                                onClick={() => !isBusy && setSelectedRow(ch.id)}
                                sx={{
                                    cursor: isBusy ? 'default' : 'pointer',
                                    backgroundColor: selectedRow === ch.id ? '#e0e0e0' : 'transparent',
                                    '&:hover': { backgroundColor: isBusy ? 'transparent' : '#f5f5f5' },
                                }}
                            >
                                {/* Arrow indicator */}
                                <TableCell sx={{ borderRight: '1px solid #e0e0e0', color: '#00bcd4', fontWeight: 700 }}>
                                    {selectedRow === ch.id ? '▶' : ''}
                                </TableCell>

                                {/* Channel number */}
                                <TableCell sx={{ color: '#00bcd4', fontWeight: 600, borderRight: '1px solid #e0e0e0' }}>
                                    {ch.id}
                                </TableCell>

                                {/* Checkbox */}
                                <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                    <Checkbox
                                        checked={ch.enabled}
                                        onChange={() => handleToggle(ch.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={isBusy}
                                        icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 18, color: '#051622' }} />}
                                        checkedIcon={<CheckBoxIcon sx={{ fontSize: 18, color: '#051622' }} />}
                                        sx={{ p: 0 }}
                                    />
                                </TableCell>

                                {/* Tag Name */}
                                <TableCell>
                                    <TextField
                                        value={ch.tagName}
                                        onChange={handleTagChange(ch.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={isBusy}
                                        size="small"
                                        variant="standard"
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{
                                            style: { fontSize: '0.85rem', color: '#051622' },
                                            maxLength: 4
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* Note */}
            <Typography variant="caption" sx={{ color: '#00bcd4', fontWeight: 600, mt: 1 }}>
                Note: Data Logged Only when Input Channel status changed
            </Typography>

            {/* Save success toast */}
            <Zoom in={saved}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{
                    color: 'success.main',
                    backgroundColor: alpha('#22c55e', 0.1),
                    px: 2, py: 0.8, borderRadius: '8px',
                    border: '1px solid', borderColor: alpha('#22c55e', 0.3),
                    width: 'fit-content',
                }}>
                    <CheckCircleIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Saved!</Typography>
                </Stack>
            </Zoom>

        </Box>
    );
};

export default DigitalInputSettings;
