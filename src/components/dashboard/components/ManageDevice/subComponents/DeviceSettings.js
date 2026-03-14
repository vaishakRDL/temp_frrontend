import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button,
    FormControlLabel, Checkbox as MuiCheckbox, Stack,
    Divider, alpha, InputAdornment
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LockIcon from '@mui/icons-material/Lock';
import WifiIcon from '@mui/icons-material/Wifi';
import DnsIcon from '@mui/icons-material/Dns';
import DevicesIcon from '@mui/icons-material/Devices';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Zoom, CircularProgress } from '@mui/material';
import { DeviceSettingsReadService, DeviceSettingsWriteService } from '../../../../../services/LoginPageService';

const isValidIP = (ip) => {
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
};

/* ─── Styled field label ──────────────────────────────────────── */
const FieldLabel = ({ children }) => (
    <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: '#475467', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5, display: 'block' }}
    >
        {children}
    </Typography>
);

/* ─── Section header ──────────────────────────────────────────── */
const SectionHeading = ({ icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ color: '#051622' }}>{icon}</Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#051622' }}>{title}</Typography>
    </Box>
);

/* ─── Common text field style ─────────────────────────────────── */
const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        '& fieldset': { borderColor: '#e0e0e0' },
        '&:hover fieldset': { borderColor: '#051622' },
        '&.Mui-focused fieldset': { borderColor: '#051622' }
    },
    '& .Mui-disabled': { backgroundColor: '#f0f0f0', WebkitTextFillColor: '#9e9e9e' }
};

/* ─── Now ─────────────────────────────────────────────────────── */
const nowDate = new Date();
const pad = (n) => String(n).padStart(2, '0');

const DeviceSettings = () => {
    const [form, setForm] = useState({
        deviceId: '1,1,1,1,1,1,1,1,1,1,1,1,1',
        deviceName: 'RDL',
        secretKey: 'SECRET_KEY',
        deviceMac: '00:00:00:00:00:00',
        deviceIp: '111.111.111.111',
        subnetMask: '111.111.111.111',
        gateway: '111.111.111.111',
        dns: '',
        ntpSync: '01',
        timeH: nowDate.getHours(),
        timeM: nowDate.getMinutes(),
        timeS: nowDate.getSeconds(),
        deviceDate: `${nowDate.getFullYear()}-${pad(nowDate.getMonth() + 1)}-${pad(nowDate.getDate())}`,
        debug: '01'
    });
    const [reading, setReading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const isBusy = reading || saving;

    const set = useCallback((field) => (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm(prev => ({ ...prev, [field]: val }));
    }, []);

    const setNum = useCallback((field) => (e) => {
        const val = Number(e.target.value);
        setForm(prev => ({ ...prev, [field]: val }));
    }, []);

    const networkFields = useMemo(() => [
        { label: 'Device IP', field: 'deviceIp', placeholder: '192.168.1.100' },
        { label: 'Subnet Mask', field: 'subnetMask', placeholder: '255.255.255.0' },
        { label: 'Gateway', field: 'gateway', placeholder: '192.168.1.1' },
        { label: 'DNS', field: 'dns', placeholder: '8.8.8.8' }
    ], []);

    const timeFields = useMemo(() => [
        { field: 'timeH', max: 23, label: 'h' },
        { field: 'timeM', max: 59, label: 'm' },
        { field: 'timeS', max: 59, label: 's' }
    ], []);

    const handleRead = useCallback(() => {
        setReading(true);
        DeviceSettingsReadService((data) => {
            setReading(false);
            if (data.success && data.deviceIdentity) {
                const d = data.deviceIdentity;
                setForm(prev => ({
                    ...prev,
                    deviceId: d.deviceId || prev.deviceId,
                    deviceName: d.deviceTag || prev.deviceName,
                    secretKey: d.secretKey || prev.secretKey,
                    deviceMac: d.macAddress || prev.deviceMac,
                    deviceIp: d.deviceIp || prev.deviceIp,
                    gateway: d.gatewayIp || prev.gateway,
                    subnetMask: d.subnetMask || prev.subnetMask,
                    // ntpServer: d.ntpSync === "01" ? d.ntpServer : "",
                    // debugMode: d.debug  === "01" ? d.debugMode : "01",

                }));
            }
        }, (err) => {
            setReading(false);
            console.error("Read failed:", err);
        });
    }, []);

    useEffect(() => {
        handleRead();
    }, [handleRead]);

    const handleSave = useCallback(() => {
        setSaving(true);
        const payload = {
            deviceId: form.deviceId,
            deviceTag: form.deviceName,
            secretKey: form.secretKey,
            macAddress: form.deviceMac,
            deviceIp: form.deviceIp,
            gatewayIp: form.gateway,
            subnetMask: form.subnetMask,
            // ntpServer: d.ntpSync === "01" ? d.ntpServer : "",
            // debugMode: d.debug  === "01" ? d.debugMode : "01",
        };
        DeviceSettingsWriteService(payload, (data) => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2200);
        }, (err) => {
            setSaving(false);
            console.error("Save failed:", err);
        });
    }, [form.deviceId, form.deviceName, form.secretKey, form.deviceMac, form.deviceIp, form.gateway, form.subnetMask]);

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: '#f8fafc', minHeight: '100%' }}>
            {/* Page title */}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622', mb: 0.5 }}>Device Settings</Typography>
                <Typography variant="body2" color="text.secondary">Configure device identity, network, time, and diagnostics</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* ── Left column ─────────────────────────────── */}
                <Grid item xs={12} lg={7}>

                    {/* Identity */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', backgroundColor: '#fff', mb: 3 }}>
                        <SectionHeading icon={<DevicesIcon fontSize="small" />} title="Device Identity" />
                        <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={6}>
                                <FieldLabel>Device ID</FieldLabel>
                                <TextField
                                    fullWidth size="small"
                                    value={form.deviceId}
                                    onChange={set('deviceId')}
                                    disabled={isBusy}
                                    inputProps={{ maxLength: 4 }}
                                    helperText={form.deviceId?.length > 4 ? 'Max 4 characters' : ''}
                                    sx={fieldSx}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FieldLabel>Device Name</FieldLabel>
                                <TextField fullWidth size="small" value={form.deviceName} onChange={set('deviceName')} disabled={isBusy} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FieldLabel>Device Secret Key</FieldLabel>
                                <TextField
                                    fullWidth size="small" type="password"
                                    value={form.secretKey} onChange={set('secretKey')}
                                    disabled={isBusy}
                                    inputProps={{ maxLength: 15 }}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ fontSize: 16, color: '#94a3b8' }} /></InputAdornment> }}
                                    sx={fieldSx}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FieldLabel>Device MAC Address</FieldLabel>
                                <TextField fullWidth size="small" value={form.deviceMac} disabled
                                    InputProps={{ startAdornment: <InputAdornment position="start"><WifiIcon sx={{ fontSize: 16, color: '#bbbbbb' }} /></InputAdornment> }}
                                    sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], backgroundColor: '#f0f0f0' } }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Network */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', backgroundColor: '#fff', mb: 3 }}>
                        <SectionHeading icon={<WifiIcon fontSize="small" />} title="Network Configuration" />
                        <Grid container spacing={2.5}>
                            {networkFields.map(({ label, field, placeholder }) => (
                                <Grid item xs={12} sm={6} key={field}>
                                    <FieldLabel>{label}</FieldLabel>
                                    <TextField fullWidth size="small" placeholder={placeholder}
                                        value={form[field]} onChange={set(field)}
                                        disabled={isBusy}
                                        inputProps={{ maxLength: 15 }}
                                        error={form[field] !== '' && !isValidIP(form[field])}
                                        helperText={form[field] !== '' && !isValidIP(form[field]) ? 'Invalid IP address' : ''}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><DnsIcon sx={{ fontSize: 16, color: '#94a3b8' }} /></InputAdornment> }}
                                        sx={fieldSx}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                {/* ── Right column ─────────────────────────────── */}
                <Grid item xs={12} lg={5}>

                    {/* Time & Date */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', backgroundColor: '#fff', mb: 3 }}>
                        <SectionHeading icon={<AccessTimeIcon fontSize="small" />} title="Time & Date" />

                        <Box sx={{ mb: 2.5 }}>
                            <FormControlLabel
                                control={
                                    <MuiCheckbox
                                        checked={form.ntpSync}
                                        onChange={set('ntpSync')}
                                        disabled={isBusy}
                                        icon={<CheckBoxOutlineBlankIcon sx={{ color: '#051622', fontSize: 22 }} />}
                                        checkedIcon={<CheckBoxIcon sx={{ color: '#051622', fontSize: 22 }} />}
                                    />
                                }
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <SyncIcon sx={{ fontSize: 16, color: '#051622' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#051622' }}>Enable NTP Server Sync</Typography>
                                    </Stack>
                                }
                            />
                        </Box>

                        <Box sx={{ mb: 2.5 }}>
                            <FieldLabel>Device Time (h : m : s)</FieldLabel>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {timeFields.map(({ field, max, label }, idx) => (
                                    <React.Fragment key={field}>
                                        {idx > 0 && <Typography sx={{ color: '#94a3b8', fontWeight: 700 }}>:</Typography>}
                                        <Box>
                                            <TextField
                                                type="number" size="small"
                                                value={form[field]}
                                                onChange={(e) => {
                                                    const v = Math.max(0, Math.min(max, Number(e.target.value)));
                                                    setForm(prev => ({ ...prev, [field]: v }));
                                                }}
                                                disabled={isBusy}
                                                inputProps={{ min: 0, max, style: { textAlign: 'center' } }}
                                                sx={{ width: 72, ...fieldSx }}
                                                label={label}
                                            // disabled={form.ntpSync}
                                            />
                                        </Box>
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </Box>

                        <Box>
                            <FieldLabel>Device Date</FieldLabel>
                            <TextField
                                fullWidth size="small" type="date"
                                value={form.deviceDate}
                                onChange={set('deviceDate')}
                                disabled={isBusy}
                                InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon sx={{ fontSize: 16, color: '#94a3b8' }} /></InputAdornment> }}
                                sx={fieldSx}
                            />
                        </Box>
                    </Paper>

                    {/* Debug & Save */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', backgroundColor: '#fff' }}>
                        <SectionHeading icon={<BugReportIcon fontSize="small" />} title="Diagnostics" />
                        <FormControlLabel
                            control={
                                <MuiCheckbox
                                    checked={form.debug}
                                    onChange={set('debug')}
                                    disabled={isBusy}
                                    icon={<CheckBoxOutlineBlankIcon sx={{ color: '#051622', fontSize: 22 }} />}
                                    checkedIcon={<CheckBoxIcon sx={{ color: '#051622', fontSize: 22 }} />}
                                />
                            }
                            label={<Typography variant="body2" sx={{ fontWeight: 600, color: '#051622' }}>Enable Debug</Typography>}
                            sx={{ mb: 2 }}
                        />

                        <Divider sx={{ mb: 2.5 }} />

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button
                                variant="contained"
                                onClick={handleRead}
                                disabled={isBusy}
                                startIcon={reading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                                sx={{
                                    backgroundColor: '#455a64', color: '#fff',
                                    px: 4, py: 1, borderRadius: '8px',
                                    textTransform: 'none', fontWeight: 600,
                                    '&:hover': { backgroundColor: '#37474f' }
                                }}
                            >
                                {reading ? 'Reading...' : 'Read Settings'}
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={isBusy}
                                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                sx={{
                                    backgroundColor: '#051622', color: '#fff',
                                    px: 4, py: 1, borderRadius: '8px',
                                    textTransform: 'none', fontWeight: 600,
                                    '&:hover': { backgroundColor: '#183b52', }

                                }}
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </Button>
                            <Zoom in={saved}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'success.main' }}>
                                    <CheckCircleIcon fontSize="small" />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Settings saved!</Typography>
                                </Stack>
                            </Zoom>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DeviceSettings;
