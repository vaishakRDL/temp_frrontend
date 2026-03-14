import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button,
    FormControl, Select, MenuItem, Stack, Divider,
    Radio, RadioGroup, Tabs, Tab, FormControlLabel,
    InputAdornment, IconButton, Zoom, alpha, useTheme,
    useMediaQuery, Checkbox, CircularProgress, ButtonGroup
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LanIcon from '@mui/icons-material/Lan';
import TerminalIcon from '@mui/icons-material/Terminal';
import {
    MQTTCloudReadService, MQTTCloudWriteService,
    NtwkProtocolReadService, NtwkProtocolWriteService,
    DeviceSettingsReadService, DeviceSettingsWriteService,
    NtwkLteReadService, NtwkLteWriteService,
    FTTPConfigReadService, FTTPConfigWriteService,
    JSONURLReadService, JSONURLWriteService
} from '../../../../../services/LoginPageService';

const ConnectivitySettings = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmallDesktop = useMediaQuery(theme.breakpoints.down('lg'));

    // Top-level Navigation states
    const [commMode, setCommMode] = useState(''); // '0' for None, '1' for 4G/LTE
    const [protocol, setProtocol] = useState('JSON');
    const [jsonType, setJsonType] = useState('JSON URL');
    const [subTab, setSubTab] = useState('');

    // MQTT Specific states
    const [mqttProfileType, setMqttProfileType] = useState('MQTT Broker');
    const [enableSSL, setEnableSSL] = useState(false);
    const [mqttData, setMqttData] = useState({
        brokerAddress: '',
        userName: '',
        password: '',
        port: '',
        publishTopic: '',
        subscribeTopic: '',
        subscribePassword: '',
        deviceId: ''
    });

    // FTP Specific states
    const [ftpData, setFtpData] = useState({
        ftpip: '',
        username: '',
        pass: '',
        port: '21',
        logfolder: '',
        interval: '1'
    });

    // JSON URL Specific states
    const [jsonUrlData, setJsonUrlData] = useState({
        options: '1',
        url: ''
    });

    // Interaction states
    const [showPassword, setShowPassword] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [readingSettings, setReadingSettings] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [ftpIntervalUnit, setFtpIntervalUnit] = useState('Sec');
    const [wifiIpMode, setWifiIpMode] = useState('DHCP');
    const [simMode, setSimMode] = useState('Single SIM');
    const [readingProtocolMode, setReadingProtocolMode] = useState(false);
    const [savingProtocolMode, setSavingProtocolMode] = useState(false);
    const [readingSoftwareChoice, setReadingSoftwareChoice] = useState(false);
    const [savingSoftwareChoice, setSavingSoftwareChoice] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        // Fetch MQTT
        MQTTCloudReadService((res) => {
            if (res) {
                setMqttData({
                    brokerAddress: res.address || '',
                    userName: res.username || '',
                    password: res.password || '',
                    port: res.port || '',
                    publishTopic: res.publish || '',
                    subscribeTopic: res.subscribe || '',
                    subscribePassword: res.subpass || '',
                    deviceId: res.devtag || ''
                });
            }
        }, (err) => {
            console.error("Error fetching MQTT settings:", err);
        });

        // Fetch FTP
        FTTPConfigReadService((res) => {
            if (res && res.data) {
                const d = res.data;
                setFtpData({
                    ftpip: d.ftpip || '',
                    username: d.username || '',
                    pass: d.pass || '',
                    port: d.port || '21',
                    logfolder: d.logfolder || '',
                    interval: d.interval || '1'
                });
            }
        }, (err) => {
            console.error("Error fetching FTP settings:", err);
        });

        // Fetch JSON URL
        JSONURLReadService((res) => {
            if (res && res.data) {
                const d = res.data;
                const opts = d.options || '1';
                setJsonUrlData({
                    options: opts,
                    url: d.url || ''
                });
                setJsonType(opts === '1' ? 'JSON URL' : 'JSON Encryption');
            }
        }, (err) => {
            console.error("Error fetching JSON URL settings:", err);
        });
    }, []);

    const handleReadSettings = () => {
        setReadingSettings(true);
        if (protocol === 'MQTT') {
            MQTTCloudReadService((res) => {
                setReadingSettings(false);
                if (res) {
                    setMqttData({
                        brokerAddress: res.address || '',
                        userName: res.username || '',
                        password: res.password || '',
                        port: res.port || '',
                        publishTopic: res.publish || '',
                        subscribeTopic: res.subscribe || '',
                        subscribePassword: res.subpass || '',
                        deviceId: res.devtag || ''
                    });
                }
            }, (err) => {
                setReadingSettings(false);
                console.error("Error reading MQTT settings:", err);
                alert("Failed to read MQTT settings");
            });
        } else if (protocol === 'FTP') {
            FTTPConfigReadService((res) => {
                setReadingSettings(false);
                if (res && res.data) {
                    const d = res.data;
                    setFtpData({
                        ftpip: d.ftpip || '',
                        username: d.username || '',
                        pass: d.pass || '',
                        port: d.port || '21',
                        logfolder: d.logfolder || '',
                        interval: d.interval || '1'
                    });
                }
            }, (err) => {
                setReadingSettings(false);
                console.error("Error reading FTP settings:", err);
                alert("Failed to read FTP settings");
            });
        } else if (protocol === 'JSON') {
            JSONURLReadService((res) => {
                setReadingSettings(false);
                if (res && res.data) {
                    const d = res.data;
                    const opts = d.options || '1';
                    setJsonUrlData({
                        options: opts,
                        url: d.url || ''
                    });
                    setJsonType(opts === '1' ? 'JSON URL' : 'JSON Encryption');
                }
            }, (err) => {
                setReadingSettings(false);
                console.error("Error reading JSON URL settings:", err);
                alert("Failed to read JSON URL settings");
            });
        } else {
            // Placeholder for other protocol reads
            setTimeout(() => setReadingSettings(false), 500);
        }
    };

    const handleSave = () => {
        setSavingSettings(true);
        if (protocol === 'MQTT') {
            const payload = {
                address: mqttData.brokerAddress,
                username: mqttData.userName,
                password: mqttData.password,
                port: mqttData.port,
                publish: mqttData.publishTopic,
                subscribe: mqttData.subscribeTopic,
                devtag: mqttData.deviceId,
                subpass: mqttData.subscribePassword
            };
            MQTTCloudWriteService(payload, (res) => {
                setSavingSettings(false);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }, (err) => {
                setSavingSettings(false);
                alert("Failed to sync MQTT settings");
            });
        } else if (protocol === 'FTP') {
            const payload = {
                ftpip: ftpData.ftpip,
                username: ftpData.username,
                pass: ftpData.pass,
                port: ftpData.port,
                logfolder: ftpData.logfolder,
                interval: ftpData.interval
            };
            FTTPConfigWriteService(payload, (res) => {
                setSavingSettings(false);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }, (err) => {
                setSavingSettings(false);
                alert("Failed to sync FTP settings");
            });
        } else if (protocol === 'JSON') {
            const payload = {
                options: jsonUrlData.options,
                url: jsonUrlData.url
            };
            JSONURLWriteService(payload, (res) => {
                setSavingSettings(false);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }, (err) => {
                setSavingSettings(false);
                alert("Failed to sync JSON URL settings");
            });
        } else {
            // Use DeviceSettingsWriteService for other protocols
            const payload = { protocol: protocol };
            DeviceSettingsWriteService(payload, (res) => {
                setSavingSettings(false);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }, (err) => {
                setSavingSettings(false);
                console.error("Error saving device settings:", err);
                alert("Failed to sync protocol settings");
            });
        }
    };

    const handleReadSoftware = () => {
        setReadingSoftwareChoice(true);
        NtwkLteReadService((res) => {
            setReadingSoftwareChoice(false);
            const data = res?.data || res;
            if (data && data.value !== undefined) {
                const val = String(data.value);
                const map = { '1': 'FTP', '2': 'JSON', '3': 'MQTT', '4': 'Disable' };
                setProtocol(map[val] || 'JSON');
            }
        }, (err) => {
            setReadingSoftwareChoice(false);
            console.error("Error reading protocol choice:", err);
            alert("Failed to read protocol selection");
        });
    };

    const handleSaveProtocolSelection = () => {
        setSavingSoftwareChoice(true);
        const map = { 'FTP': '1', 'JSON': '2', 'MQTT': '3', 'Disable': '4' };
        const payload = { value: map[protocol] || '2' };
        NtwkLteWriteService(payload, (res) => {
            setSavingSoftwareChoice(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, (err) => {
            setSavingSoftwareChoice(false);
            console.error("Error saving protocol choice:", err);
            alert("Failed to save protocol selection");
        });
    };

    const handleReadProtocolMode = () => {
        setReadingProtocolMode(true);
        NtwkProtocolReadService((res) => {
            setReadingProtocolMode(false);
            const data = res?.data || res;
            if (data && data.value !== undefined) {
                const val = String(data.value);
                setCommMode(val);
                setSubTab(val === '1' ? '4G/LTE' : '');
            }
        }, (err) => {
            setReadingProtocolMode(false);
            console.error("Error reading protocol mode:", err);
            alert("Failed to read communication mode");
        });
    };

    const handleSaveProtocolMode = () => {
        setSavingProtocolMode(true);
        const payload = { value: commMode };
        NtwkProtocolWriteService(payload, (res) => {
            setSavingProtocolMode(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, (err) => {
            setSavingProtocolMode(false);
            handleReadProtocolMode(); // Revert on error
            console.error("Error saving protocol mode:", err);
            alert("Failed to save communication mode");
        });
    };

    const handleMqttFieldChange = (field, value) => {
        setMqttData(prev => ({ ...prev, [field]: value }));
    };

    const handleFtpFieldChange = (field, value) => {
        setFtpData(prev => ({ ...prev, [field]: value }));
    };

    const handleJsonUrlFieldChange = (field, value) => {
        setJsonUrlData(prev => ({ ...prev, [field]: value }));
    };

    // Condition: FTP is not available for WiFi
    const isFtpAvailable = commMode !== 'WiFi';

    // Automatically switch protocol if FTP was selected and becomes unavailable
    useEffect(() => {
        if (!isFtpAvailable && protocol === 'FTP') {
            setProtocol('JSON');
        }
    }, [commMode, isFtpAvailable, protocol]);

    useEffect(() => {
        handleReadProtocolMode();
        handleReadSoftware();
    }, []);

    const renderProtocolForm = () => {
        if (protocol === 'Disable') return (
            <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6, bgcolor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                <TerminalIcon sx={{ fontSize: 32, color: '#94a3b8', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: '#475569', fontWeight: 600 }}>Protocol Disabled</Typography>
            </Box>
        );

        switch (protocol) {
            case 'FTP':
                return (
                    <Grid container spacing={1.5}>
                        {[
                            { label: 'FTP SERVER IP', key: 'ftpip', md: 6 },
                            { label: 'PORT NUMBER', key: 'port', md: 6 },
                            { label: 'USERNAME', key: 'username', md: 6 },
                            { label: 'PASSWORD', key: 'pass', md: 6, type: 'password' },
                            { label: 'LOG FOLDER', key: 'logfolder', md: 12 }
                        ].map((f, idx) => (
                            <Grid item xs={12} md={f.md} key={idx}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 0.5, display: 'block', fontSize: '0.65rem' }}>{f.label}</Typography>
                                <TextField
                                    fullWidth size="small"
                                    value={ftpData[f.key]}
                                    onChange={(e) => handleFtpFieldChange(f.key, e.target.value)}
                                    disabled={f.disabled}
                                    type={f.type === 'password' && !showPassword ? 'password' : 'text'}
                                    InputProps={f.type === 'password' ? {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} size="small" edge="end">
                                                    {showPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    } : undefined}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', fontSize: '0.8rem' } }}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 0.5, display: 'block', fontSize: '0.65rem' }}>POLLING INTERVAL</Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <RadioGroup row value={ftpIntervalUnit} onChange={(e) => setFtpIntervalUnit(e.target.value)}>
                                        <FormControlLabel value="Sec" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Sec</Typography>} />
                                        <FormControlLabel value="Min" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Min</Typography>} />
                                        <FormControlLabel value="Hour" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Hour</Typography>} />
                                    </RadioGroup>
                                    <TextField
                                        size="small"
                                        value={ftpData.interval}
                                        onChange={(e) => handleFtpFieldChange('interval', e.target.value)}
                                        sx={{ width: 60, '& .MuiOutlinedInput-root': { bgcolor: '#fff', fontSize: '0.8rem' } }}
                                    />
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                );
            case 'JSON':
                return (
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>TYPE:</Typography>
                            <Select
                                size="small"
                                value={jsonType}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setJsonType(val);
                                    handleJsonUrlFieldChange('options', val === 'JSON URL' ? '1' : '2');
                                }}
                                sx={{ minWidth: 160, height: 32, fontSize: '0.8rem' }}
                            >
                                <MenuItem value="JSON URL">JSON URL</MenuItem>
                                <MenuItem value="JSON Encryption">Encryption Mode</MenuItem>
                            </Select>
                        </Stack>
                        <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '10px', bgcolor: '#f8fafc' }}>
                            {jsonType === 'JSON Encryption' ? (
                                <Grid container spacing={1.5}>
                                    {['Post URL', 'Port No', 'Username', 'Password', 'Path'].map((l) => (
                                        <React.Fragment key={l}>
                                            <Grid item xs={4}><Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>{l}:</Typography></Grid>
                                            <Grid item xs={8}><TextField fullWidth size="small" type={l === 'Password' ? 'password' : 'text'} sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { fontSize: '0.75rem', height: 32 } }} /></Grid>
                                        </React.Fragment>
                                    ))}
                                    <Grid item xs={4}><Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>Content:</Typography></Grid>
                                    <Grid item xs={8}><TextField fullWidth size="small" defaultValue="application/json" disabled sx={{ bgcolor: '#cbd5e1', '& .MuiOutlinedInput-root': { fontSize: '0.75rem', height: 32 } }} /></Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={1.5}>
                                    {[
                                        { label: 'Post URL', key: 'url' },
                                    ].map((f) => (
                                        <React.Fragment key={f.label}>
                                            <Grid item xs={5}><Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>{f.label}:</Typography></Grid>
                                            <Grid item xs={7}>
                                                <TextField
                                                    fullWidth size="small"
                                                    value={jsonUrlData.url}
                                                    onChange={(e) => handleJsonUrlFieldChange('url', e.target.value)}
                                                    sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { fontSize: '0.75rem', height: 32 } }}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Stack>
                );
            case 'MQTT':
                return (
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            {commMode !== 'WiFi' && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>Profile Type:</Typography>
                                    <Select size="small" value={mqttProfileType} onChange={(e) => setMqttProfileType(e.target.value)} sx={{ minWidth: 140, height: 32, fontSize: '0.8rem' }}>
                                        <MenuItem value="MQTT Broker">MQTT Broker</MenuItem>
                                        {/* <MenuItem value="Things Board">ThingsBoard</MenuItem>
                                        <MenuItem value="AWS">AWS IoT</MenuItem> */}
                                    </Select>
                                </Stack>
                            )}
                            <FormControlLabel control={<Checkbox size="small" checked={enableSSL} onChange={(e) => setEnableSSL(e.target.checked)} sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Enable SSL/TSL</Typography>} />
                        </Stack>
                        <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '10px', bgcolor: '#f8fafc' }}>
                            <Grid container spacing={1.5} alignItems="center">
                                {(mqttProfileType === 'MQTT Broker' || commMode === 'WiFi') && (
                                    <>
                                        {(commMode === 'WiFi' ? [
                                            { label: 'Broker Address', key: 'brokerAddress' },
                                            { label: 'UserName', key: 'userName' },
                                            { label: 'Password', key: 'password', type: 'password' },
                                            { label: 'Port', key: 'port' },
                                            { label: 'Topic', key: 'publishTopic' },
                                            { label: 'Client Id/Tag', key: 'deviceId' }
                                        ] : [
                                            { label: 'Broker Address', key: 'brokerAddress' },
                                            { label: 'UserName', key: 'userName' },
                                            { label: 'Password', key: 'password', type: 'password' },
                                            { label: 'Port', key: 'port' },
                                            { label: 'Publish Topic', key: 'publishTopic' },
                                            { label: 'Subscribe Topic', key: 'subscribeTopic' },
                                            { label: 'Subscribe Password', key: 'subscribePassword' },
                                            { label: 'Device Id/Tag', key: 'deviceId' }
                                        ]).map((f, idx) => (
                                            <React.Fragment key={idx}>
                                                <Grid item xs={5}><Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>{f.label}:</Typography></Grid>
                                                <Grid item xs={7}>
                                                    <TextField
                                                        fullWidth size="small"
                                                        value={mqttData[f.key]}
                                                        onChange={(e) => handleMqttFieldChange(f.key, e.target.value)}
                                                        type={f.type === 'password' && !showPassword ? 'password' : 'text'}
                                                        InputProps={f.type === 'password' ? {
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => setShowPassword(!showPassword)} size="small" edge="end">
                                                                        {showPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        } : undefined}
                                                        sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { fontSize: '0.75rem', height: 32 } }}
                                                    />
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </>
                                )}
                                {mqttProfileType === 'Things Board' && ['Broker Address', 'Token', 'Port'].map(l => (
                                    <React.Fragment key={l}>
                                        <Grid item xs={5}><Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>{l}:</Typography></Grid>
                                        <Grid item xs={7}><TextField fullWidth size="small" sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { fontSize: '0.75rem', height: 32 } }} /></Grid>
                                    </React.Fragment>
                                ))}
                                {mqttProfileType === 'AWS' && ['Broker Address', 'Port', 'Client ID', 'Username', 'Password'].map(l => (
                                    <React.Fragment key={l}>
                                        <Grid item xs={5}><Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>{l}:</Typography></Grid>
                                        <Grid item xs={7}><TextField fullWidth size="small" type={l === 'Password' ? 'password' : 'text'} sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { fontSize: '0.75rem', height: 32 } }} /></Grid>
                                    </React.Fragment>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                );
            default: return null;
        }
    };

    return (
        <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: '8px', background: '#0f172a', color: '#fff' }}><LanIcon sx={{ fontSize: 20 }} /></Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>Connectivity Hub</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Configure hardware and cloud protocols</Typography>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* Hardware Section */}
                <Grid item xs={12} lg={4}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff', height: '100%' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#3b82f6', letterSpacing: '1px' }}>HARDWARE CONFIG</Typography>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Grid container spacing={1.5} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>Communication Type:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        fullWidth size="small"
                                        value={commMode}
                                        onChange={(e) => {
                                            setCommMode(e.target.value);
                                            setSubTab(e.target.value === '1' ? '4G/LTE' : '');
                                        }}
                                        disabled={readingProtocolMode || savingProtocolMode}
                                        sx={{ borderRadius: '8px', fontWeight: 700, height: 36, bgcolor: '#f1f5f9' }}
                                    >
                                        <MenuItem value="0">None (Offline)</MenuItem>
                                        <MenuItem value="1">4G / LTE</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <ButtonGroup fullWidth variant="contained" sx={{ height: 44, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                        <Button
                                            onClick={handleReadProtocolMode}
                                            disabled={readingProtocolMode || savingProtocolMode}
                                            sx={{ bgcolor: '#455a64', color: '#00bcd4', fontWeight: 800, '&:hover': { bgcolor: '#37474f' }, textTransform: 'none', fontSize: '0.95rem' }}
                                        >
                                            {readingProtocolMode ? <CircularProgress size={20} color="inherit" /> : 'Read Mode'}
                                        </Button>
                                        <Button
                                            onClick={handleSaveProtocolMode}
                                            disabled={readingProtocolMode || savingProtocolMode}
                                            sx={{ bgcolor: '#051622', color: '#00f5ff', fontWeight: 800, '&:hover': { bgcolor: '#000' }, textTransform: 'none', fontSize: '0.95rem' }}
                                        >
                                            {savingProtocolMode ? <CircularProgress size={20} color="inherit" /> : 'Save Mode'}
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        </Stack>

                        <Divider sx={{ my: 2.5 }} />

                        {commMode !== '0' && (
                            <Box>
                                <Tabs
                                    value={subTab} onChange={(e, v) => setSubTab(v)}
                                    sx={{ minHeight: 32, mb: 1.5, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, p: 0.5, fontSize: '0.75rem', minHeight: 32, minWidth: 60 } }}
                                >
                                    {commMode === '1' && <Tab label="4G/LTE" value="4G/LTE" />}
                                    {commMode === '1' && <Tab label="APN" value="APN" />}
                                    {commMode === 'WiFi' && <Tab label="WiFi Settings" value="WiFi" />}
                                </Tabs>
                                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                    {subTab === 'APN' ? (
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                                    <RadioGroup row value={simMode} onChange={(e) => setSimMode(e.target.value)}>
                                                        <FormControlLabel value="Single SIM" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Single SIM</Typography>} />
                                                        <FormControlLabel value="Dual SIM" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Dual SIM</Typography>} />
                                                    </RadioGroup>
                                                    <Button
                                                        variant="contained" size="small"
                                                        onClick={handleReadProtocolMode}
                                                        disabled={readingProtocolMode || savingProtocolMode}
                                                        sx={{ bgcolor: '#475569', color: '#00f5ff', '&:hover': { bgcolor: '#334155' }, textTransform: 'none', px: 4, height: 32, fontWeight: 800 }}
                                                    >
                                                        {readingProtocolMode ? <CircularProgress size={16} /> : 'Read'}
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    ) : subTab === 'WiFi' ? (
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                                <RadioGroup row value={wifiIpMode} onChange={(e) => setWifiIpMode(e.target.value)}>
                                                    <FormControlLabel value="DHCP" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 700 }}>DHCP</Typography>} />
                                                    <FormControlLabel value="Static" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 700 }}>Static</Typography>} />
                                                </RadioGroup>
                                                <Button
                                                    variant="contained" size="small"
                                                    sx={{ bgcolor: '#00bcd4', '&:hover': { bgcolor: '#00acc1' }, textTransform: 'none', fontWeight: 800, height: 28, fontSize: '0.75rem' }}
                                                >
                                                    Refresh
                                                </Button>
                                            </Stack>
                                            <Box sx={{ p: 1.5, border: '1px solid #e2e8f0', borderRadius: '8px', bgcolor: '#fff' }}>
                                                <Stack spacing={1}>
                                                    {[
                                                        { label: 'IP:', key: 'ip' },
                                                        { label: 'Subnet:', key: 'subnet' },
                                                        { label: 'Gateway:', key: 'gateway' },
                                                        { label: 'DNS 1:', key: 'dns1' },
                                                        { label: 'DNS 2:', key: 'dns2' },
                                                    ].map(f => (
                                                        <Stack key={f.key} direction="row" spacing={1} alignItems="center">
                                                            <Typography variant="caption" sx={{ minWidth: 70, textAlign: 'right', fontWeight: 600, color: '#64748b' }}>{f.label}</Typography>
                                                            <TextField fullWidth size="small" disabled={wifiIpMode === 'DHCP'} sx={{ '& .MuiOutlinedInput-root': { height: 26, fontSize: '0.75rem' } }} />
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    ) : subTab === '4G/LTE' ? (
                                        <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>4G/LTE Settings Content</Typography>
                                    ) : null}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Software Section */}
                <Grid item xs={12} lg={8}>
                    {commMode !== '0' ? (
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#6366f1', letterSpacing: '1px' }}>SOFTWARE CONFIG</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Protocol Seleciton</Typography>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <RadioGroup row value={protocol} onChange={(e) => setProtocol(e.target.value)}>
                                        {(isFtpAvailable ? ['FTP', 'JSON', 'MQTT', 'Disable'] : ['JSON', 'MQTT', 'Disable']).map(p => (
                                            <FormControlLabel key={p} value={p} control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ fontWeight: 700 }}>{p}</Typography>} />
                                        ))}
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <ButtonGroup fullWidth variant="contained" sx={{ height: 36, borderRadius: '8px', overflow: 'hidden', boxShadow: 'none' }}>
                                        <Button
                                            onClick={handleReadSoftware}
                                            disabled={readingSoftwareChoice || savingSoftwareChoice}
                                            sx={{ bgcolor: '#455a64', color: '#00bcd4', fontWeight: 800, fontSize: '0.75rem', textTransform: 'none' }}
                                        >
                                            {readingSoftwareChoice ? <CircularProgress size={16} color="inherit" /> : 'Read'}
                                        </Button>
                                        <Button
                                            onClick={handleSaveProtocolSelection}
                                            disabled={readingSoftwareChoice || savingSoftwareChoice}
                                            sx={{ bgcolor: '#051622', color: '#00f5ff', fontWeight: 800, fontSize: '0.75rem', textTransform: 'none' }}
                                        >
                                            {savingSoftwareChoice ? <CircularProgress size={16} color="inherit" /> : 'Save'}
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Tabs
                                    value={protocol === 'Disable' ? false : protocol} onChange={(e, v) => setProtocol(v)}
                                    sx={{ minHeight: 36, mb: 2, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', minHeight: 36, mr: 2, p: 0 } }}
                                >
                                    {isFtpAvailable && <Tab label="FTP Transfer" value="FTP" disabled={protocol === 'Disable'} />}
                                    <Tab label="JSON Payload" value="JSON" disabled={protocol === 'Disable'} />
                                    <Tab label="MQTT Cloud" value="MQTT" disabled={protocol === 'Disable'} />
                                </Tabs>

                                <Box sx={{ minHeight: 400 }}>
                                    {renderProtocolForm()}
                                </Box>
                            </Box>

                            <Stack direction="row" justifyContent="center">
                                <ButtonGroup variant="contained" sx={{ height: 48, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', border: '2px solid #00f5ff' }}>
                                    <Button
                                        onClick={handleReadSettings}
                                        disabled={readingSettings || savingSettings || protocol === 'Disable'}
                                        sx={{ bgcolor: '#455a64', color: '#00bcd4', px: 6, fontWeight: 800, fontSize: '1rem', textTransform: 'none', '&:hover': { bgcolor: '#37474f' } }}
                                    >
                                        {readingSettings ? <CircularProgress size={20} color="inherit" /> : 'Read Settings'}
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={readingSettings || savingSettings || protocol === 'Disable'}
                                        sx={{ bgcolor: '#0f172a', color: '#00f5ff', px: 6, fontWeight: 800, fontSize: '1rem', textTransform: 'none', '&:hover': { bgcolor: '#000' } }}
                                    >
                                        {savingSettings ? <CircularProgress size={20} color="inherit" /> : 'Write Settings'}
                                    </Button>
                                </ButtonGroup>
                            </Stack>
                        </Paper>
                    ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: alpha('#f1f5f9', 0.5), borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                            <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                Enable a communication mode to configure protocols
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>

            <Zoom in={isSaved}>
                <Paper sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', px: 3, py: 1, borderRadius: '20px', bgcolor: '#10b981', color: '#fff', display: 'flex', gap: 1, alignItems: 'center', zIndex: 3000 }}>
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Updated Successfully</Typography>
                </Paper>
            </Zoom>
        </Box>
    );
};

export default ConnectivitySettings;
