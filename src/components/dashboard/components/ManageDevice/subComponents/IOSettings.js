import React, { useState, useCallback, useEffect } from 'react';
import {
    Box, Typography, Button, Stack, FormControlLabel,
    Checkbox, Zoom, alpha, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { SettingsReadService, SettingsWriteService } from '../../../../../services/LoginPageService';

const PROTOCOLS = [
    { key: 'modbus', label: 'Modbus' },
    { key: 'analog', label: 'Analog' },
    { key: 'digitalInput', label: 'Digital Input' },
    { key: 'modbusTcp', label: 'Modbus TCP' },
];

const IOSettings = () => {
    const [enabled, setEnabled] = useState({
        modbus: false, analog: false, digitalInput: false, modbusTcp: false,
    });
    const [saving, setSaving] = useState(false);
    const [reading, setReading] = useState(false);
    const [saved, setSaved] = useState(false);

    const isBusy = saving || reading;

    const toggle = useCallback((key) =>
        setEnabled(prev => ({ ...prev, [key]: !prev[key] })), []);

    const handleRead = useCallback(() => {
        setReading(true);
        SettingsReadService((data) => {
            setReading(false);
            if (data && data.fields && data.fields.length >= 4) {
                setEnabled({
                    modbus: data.fields[0] === "02",
                    analog: data.fields[1] === "02",
                    digitalInput: data.fields[2] === "02",
                    modbusTcp: data.fields[3] === "02",
                });
            }
        }, (errStatus, errMsg) => {
            setReading(false);
            console.error("Read Error:", errMsg);
        });
    }, []);

    const handleSave = useCallback(() => {
        setSaving(true);
        const payload = {
            fields: [
                enabled.modbus ? "02" : "01",
                enabled.analog ? "02" : "01",
                enabled.digitalInput ? "02" : "01",
                enabled.modbusTcp ? "02" : "01",
            ]
        };

        SettingsWriteService(payload, (data) => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }, (errStatus, errMsg) => {
            setSaving(false);
            alert("Failed to save settings: " + (errMsg || "Unknown error"));
        });
    }, [enabled]);

    useEffect(() => {
        handleRead();
    }, [handleRead]);

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3, opacity: isBusy ? 0.7 : 1 }}>

            {/* Title */}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622', mb: 1 }}>
                    I/O Protocol Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Select the protocols you want to enable on this device
                </Typography>
            </Box>

            {/* Checkboxes */}
            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap sx={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
                {PROTOCOLS.map(p => (
                    <FormControlLabel
                        key={p.key}
                        control={
                            <Checkbox
                                checked={enabled[p.key]}
                                onChange={() => toggle(p.key)}
                                disabled={isBusy}
                                icon={<CheckBoxOutlineBlankIcon sx={{ color: '#051622', fontSize: 22 }} />}
                                checkedIcon={<CheckBoxIcon sx={{ color: '#051622', fontSize: 22 }} />}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#051622' }}>
                                {p.label}
                            </Typography>
                        }
                    />
                ))}
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isBusy}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                        backgroundColor: '#051622', color: '#fff',
                        textTransform: 'none', fontWeight: 600,
                        borderRadius: '8px', px: 4, py: 1,
                        '&:hover': { backgroundColor: '#183b52' },
                    }}
                >
                    {saving ? 'Writing…' : 'Write Settings'}
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleRead}
                    disabled={isBusy}
                    startIcon={reading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                    sx={{
                        borderColor: '#051622', color: '#051622',
                        textTransform: 'none', fontWeight: 600,
                        borderRadius: '8px', px: 4, py: 1,
                        '&:hover': { borderColor: '#183b52', backgroundColor: alpha('#051622', 0.04) },
                    }}
                >
                    {reading ? 'Reading…' : 'Read Settings'}
                </Button>

                <Zoom in={saved}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{
                        color: 'success.main',
                        backgroundColor: alpha('#22c55e', 0.1),
                        px: 2, py: 0.8, borderRadius: '8px',
                        border: '1px solid', borderColor: alpha('#22c55e', 0.3),
                    }}>
                        <CheckCircleIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Settings applied successfully
                        </Typography>
                    </Stack>
                </Zoom>
            </Stack>

        </Box>
    );
};

export default IOSettings;
