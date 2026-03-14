import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box, Typography, Paper, Button, Stack, TextField,
    FormControlLabel, Checkbox, Zoom, alpha, Radio, RadioGroup,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress,
    Divider,
    Select,
    MenuItem
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { AnalogInputSettingsService, AnalogInputSettingsReadService } from '../../../../../services/LoginPageService';

const buildDefaultAnalogChannels = () =>
    Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        resolution: '16 bit',
        enabled: false,
        mode: '0-10V',
        tagName: `AN${i + 1}`
    }));

const buildDefaultExtensionChannels = () =>
    Array.from({ length: 8 }, (_, i) => {
        const id = i + 5;
        return {
            id,
            resolution: '16 bit',
            mode: id <= 8 ? '4-20V' : '0-20V',
            tagName: `AN${id}`
        };
    });




const buildDefaultScalingChannels = () =>
    Array.from({ length: 12 }, (_, i) => {
        const id = i + 1;
        let min = 0;
        let max = 10;
        if (id >= 5 && id <= 8) {
            min = 4;
            max = 20;
        } else if (id >= 9 && id <= 12) {
            min = 0;
            max = 20;
        }
        return { id, min, max };
    });


/* ── Main Component ──────────────────────────────────────────────── */
const AnalogSettings = () => {
    const [analogChannels, setAnalogChannels] = useState(buildDefaultAnalogChannels);
    const [extensionChannels, setExtensionChannels] = useState(buildDefaultExtensionChannels);
    const [scalingChannels, setScalingChannels] = useState(buildDefaultScalingChannels);

    const [selectedAnalog, setSelectedAnalog] = useState(1);
    const [selectedExtension, setSelectedExtension] = useState(10);
    const [selectedScaling, setSelectedScaling] = useState(1);

    const [pollingInterval, setPollingInterval] = useState('');
    const [pollingUnit, setPollingUnit] = useState('Hour');
    const [saveLog, setSaveLog] = useState(false);
    const [showExtension, setShowExtension] = useState(false);
    const [enableScaling, setEnableScaling] = useState(false);

    const [reading, setReading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);


    const isBusy = reading || saving;

    const handleRead = useCallback(() => {
        setReading(true);
        AnalogInputSettingsReadService((data) => {
            setReading(false);
            if (data && data.channels && Array.isArray(data.channels)) {
                const fetched = data.channels;

                // Map Channels 1-4
                const analog = fetched.filter(ch => parseInt(ch.chnl) <= 4).map(ch => ({
                    id: parseInt(ch.chnl),
                    resolution: '16 bit',
                    enabled: ch.status === "02",
                    mode: ch.volt === "01" ? '4-20mA' : '0-10V',
                    tagName: ch.tag || `AN${ch.chnl}`
                }));

                // Map Channels 5-12
                const extension = fetched.filter(ch => parseInt(ch.chnl) >= 5 && parseInt(ch.chnl) <= 12).map(ch => ({
                    id: parseInt(ch.chnl),
                    resolution: '16 bit',
                    mode: (parseInt(ch.chnl) <= 8 ? '4-20V' : '0-20V'),
                    tagName: ch.tag || `AN${ch.chnl}`
                }));

                setAnalogChannels(analog.length ? analog : buildDefaultAnalogChannels());
                setExtensionChannels(extension.length ? extension : buildDefaultExtensionChannels());

                if (data.extension) setShowExtension(data.extension === "02");
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

        const combinedChannels = [
            ...analogChannels.map(ch => ({
                chnl: ch.id.toString().padStart(2, '0'),
                status: ch.enabled ? "02" : "01",
                volt: ch.mode === "4-20mA" ? "01" : "02",
                tag: ch.tagName
            })),
            ...extensionChannels.map(ch => ({
                chnl: ch.id.toString().padStart(2, '0'),
                tag: ch.tagName
            }))
        ];

        const payload = {
            channels: combinedChannels,
            extension: showExtension ? "02" : "01"
        };

        AnalogInputSettingsService(payload, () => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }, (err) => {
            setSaving(false);
            console.error("Save failed:", err);
        });
    }, [analogChannels, extensionChannels, showExtension]);


    const updateAnalog = (id, field, value) => {
        setAnalogChannels(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: value } : ch));
    };

    const updateExtension = (id, field, value) => {
        setExtensionChannels(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: value } : ch));
    };

    const updateScaling = (id, field, value) => {
        setScalingChannels(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: value } : ch));
    };

    const TableHeader = ({ cols }) => (
        <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell sx={{ width: 40, borderRight: '1px solid #e0e0e0', p: 0, textAlign: 'center' }} />
                {cols.map(c => (
                    <TableCell key={c} sx={{ fontWeight: 700, color: '#00bcd4', fontSize: '0.7rem', py: 1, px: 1, borderRight: '1px solid #e0e0e0', textTransform: 'uppercase' }}>
                        {c}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );



    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: '#f5f5f5', minHeight: '100%', opacity: isBusy ? 0.8 : 1 }}>

            {/* Top Config Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <RadioGroup row value={pollingUnit} onChange={(e) => setPollingUnit(e.target.value)}>
                        <FormControlLabel value="Sec" control={<Radio size="small" disabled={isBusy} />} label={<Typography variant="body2">Sec</Typography>} />
                        <FormControlLabel value="Min" control={<Radio size="small" disabled={isBusy} />} label={<Typography variant="body2">Min</Typography>} />
                        <FormControlLabel value="Hour" control={<Radio size="small" disabled={isBusy} />} label={<Typography variant="body2">Hour</Typography>} />
                    </RadioGroup>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Analog Polling Interval:</Typography>
                    <TextField
                        size="small"
                        disabled={isBusy}
                        value={pollingInterval}
                        onChange={(e) => setPollingInterval(e.target.value)}
                        sx={{ width: 140, backgroundColor: '#fff' }}
                    />
                    <Typography variant="body2" color="text.secondary">({pollingUnit.toLowerCase()})</Typography>
                </Stack>

                <FormControlLabel
                    control={<Checkbox size="small" checked={saveLog} disabled={isBusy} onChange={(e) => setSaveLog(e.target.checked)} />}
                    label={<Typography variant="body2">Save Log ( Saves to SD Card)</Typography>}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Button
                        variant="contained"
                        onClick={handleRead}
                        disabled={isBusy}
                        sx={{
                            backgroundColor: '#455a64', color: '#00bcd4', textTransform: 'none', fontWeight: 800, fontSize: '1.2rem',
                            px: 6, py: 1, borderRadius: '4px', '&:hover': { backgroundColor: '#37474f' }
                        }}
                    >
                        {reading ? <Stack direction="row" spacing={1}><CircularProgress size={20} color="inherit" /><span>Reading...</span></Stack> : 'Read'}
                    </Button>
                </Box>
            </Box>

            <Divider />

            {/* Main Content Areas */}
            <Stack direction="row" spacing={4} sx={{ alignItems: 'flex-start' }}>

                {/* Left Column: Analog + Extension */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Analog Channels Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                        <Table size="small">
                            <TableHeader cols={['Channel', 'Resolution', 'Enable/Disable', 'Mode', 'Tag Name']} />
                            <TableBody>
                                {analogChannels.map(ch => (
                                    <TableRow
                                        key={ch.id}
                                        onClick={() => setSelectedAnalog(ch.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedAnalog === ch.id ? alpha('#00bcd4', 0.1) : 'transparent',
                                            '&:hover': { backgroundColor: alpha('#00bcd4', 0.05) }
                                        }}
                                    >
                                        <TableCell sx={{ borderRight: '1px solid #e0e0e0', color: '#00bcd4', fontSize: '10px', textAlign: 'center' }}>
                                            {selectedAnalog === ch.id ? '▶' : ''}
                                        </TableCell>
                                        <TableCell sx={{ color: '#051622', fontWeight: 600, borderRight: '1px solid #e0e0e0' }}>{ch.id}</TableCell>
                                        <TableCell sx={{ color: '#051622', borderRight: '1px solid #e0e0e0' }}>{ch.resolution}</TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                            <Checkbox
                                                size="small"
                                                disabled={isBusy}
                                                checked={ch.enabled}
                                                onChange={(e) => updateAnalog(ch.id, 'enabled', e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                                sx={{ color: '#051622' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                                            <Select
                                                size="small"
                                                variant="standard"
                                                disabled={isBusy}
                                                value={ch.mode}
                                                onChange={(e) => updateAnalog(ch.id, 'mode', e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                sx={{ fontSize: '0.85rem', color: '#051622', minWidth: 80 }}
                                                disableUnderline
                                            >
                                                <MenuItem value="0-10V">0-10V</MenuItem>
                                                <MenuItem value="4-20mA">4-20mA</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                variant="standard"
                                                disabled={isBusy}
                                                value={ch.tagName}
                                                onChange={(e) => updateAnalog(ch.id, 'tagName', e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                InputProps={{ disableUnderline: true }}
                                                inputProps={{ style: { fontSize: '0.85rem', color: '#051622', fontWeight: 600 }, maxLength: 8 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Extension ADC Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControlLabel
                            control={<Checkbox size="small" disabled={isBusy} checked={showExtension} onChange={(e) => setShowExtension(e.target.checked)} />}
                            label={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Extension ADC</Typography>}
                        />
                        {showExtension && (
                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ccc', borderRadius: '4px', mb: 2 }}>
                                <Table size="small">
                                    <TableHeader cols={['Channel', 'Resolution', 'Mode', 'Tag Name']} />
                                    <TableBody>
                                        {extensionChannels.map(ch => (
                                            <TableRow
                                                key={ch.id}
                                                onClick={() => setSelectedExtension(ch.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    height: 32,
                                                    backgroundColor: selectedExtension === ch.id ? alpha('#00bcd4', 0.1) : 'transparent',
                                                    '&:hover': { backgroundColor: alpha('#00bcd4', 0.05) }
                                                }}
                                            >
                                                <TableCell sx={{ borderRight: '1px solid #e0e0e0', color: '#00bcd4', fontSize: '10px', textAlign: 'center', p: 0 }}>
                                                    {selectedExtension === ch.id ? '▶' : ''}
                                                </TableCell>
                                                <TableCell sx={{ color: '#051622', fontWeight: 600, borderRight: '1px solid #e0e0e0', py: 0.5 }}>{ch.id}</TableCell>
                                                <TableCell sx={{ color: '#051622', borderRight: '1px solid #e0e0e0', py: 0.5, fontSize: '0.75rem' }}>{ch.resolution}</TableCell>
                                                <TableCell sx={{ color: '#051622', borderRight: '1px solid #e0e0e0', py: 0.5, fontSize: '0.75rem' }}>{ch.mode}</TableCell>
                                                <TableCell sx={{ py: 0 }}>
                                                    <TextField
                                                        size="small"
                                                        variant="standard"
                                                        disabled={isBusy}
                                                        value={ch.tagName}
                                                        onChange={(e) => updateExtension(ch.id, 'tagName', e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        InputProps={{ disableUnderline: true }}
                                                        inputProps={{ style: { fontSize: '0.75rem', color: '#051622', fontWeight: 600, padding: '4px 0' }, maxLength: 8 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        )}
                    </Box>

                    {/* Left Save Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={isBusy}
                            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                            sx={{
                                backgroundColor: '#455a64', color: '#00bcd4', textTransform: 'none', fontWeight: 800, fontSize: '1.2rem',
                                px: 5, py: 0.8, borderRadius: '4px', '&:hover': { backgroundColor: '#37474f' }
                            }}
                        >
                            Save
                        </Button>
                        <Zoom in={saved}>
                            <CheckCircleIcon sx={{ color: '#22c55e' }} />
                        </Zoom>
                    </Box>
                </Box>

                {/* Right Column: Scaling */}
                <Box sx={{ flex: 0.7, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                        control={<Checkbox size="small" disabled={isBusy} checked={enableScaling} onChange={(e) => setEnableScaling(e.target.checked)} />}
                        label={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Enable Scaling</Typography>}
                    />

                    {enableScaling && (
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ccc', borderRadius: '4px', height: 600, overflow: 'auto' }}>
                            <Table size="small" stickyHeader>
                                <TableHeader cols={['Channel', 'Min', 'Max']} />


                                <TableBody>
                                    {scalingChannels.map(ch => (
                                        <TableRow
                                            key={ch.id}
                                            onClick={() => setSelectedScaling(ch.id)}
                                            sx={{
                                                cursor: 'pointer',
                                                backgroundColor: selectedScaling === ch.id ? alpha('#00bcd4', 0.1) : 'transparent',
                                                '&:hover': { backgroundColor: alpha('#00bcd4', 0.05) }
                                            }}
                                        >
                                            <TableCell sx={{ borderRight: '1px solid #e0e0e0', color: '#00bcd4', fontSize: '10px', textAlign: 'center' }}>
                                                {selectedScaling === ch.id ? '▶' : ''}
                                            </TableCell>
                                            <TableCell sx={{ color: '#051622', fontWeight: 600, borderRight: '1px solid #e0e0e0' }}>{ch.id}</TableCell>
                                            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    disabled={isBusy}
                                                    type="number"
                                                    value={ch.min}
                                                    onChange={(e) => updateScaling(ch.id, 'min', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    InputProps={{ disableUnderline: true }}
                                                    inputProps={{ style: { fontSize: '0.85rem', color: '#051622', textAlign: 'center' } }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    disabled={isBusy}
                                                    type="number"
                                                    value={ch.max}
                                                    onChange={(e) => updateScaling(ch.id, 'max', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    InputProps={{ disableUnderline: true }}
                                                    inputProps={{ style: { fontSize: '0.85rem', color: '#051622', textAlign: 'center' } }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        <Button
                            variant="contained"
                            disabled={!enableScaling || isBusy}
                            onClick={handleSave}
                            sx={{
                                backgroundColor: '#455a64', color: '#00bcd4', textTransform: 'none', fontWeight: 800, fontSize: '1.2rem',
                                px: 5, py: 0.8, borderRadius: '4px', '&:hover': { backgroundColor: '#37474f' }
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default AnalogSettings;


// import React, { useState, useCallback, useMemo } from 'react';
// import {
//     Box, Typography, Paper, Button, Stack, Select, MenuItem,
//     TextField, FormControlLabel, Checkbox, Tooltip, IconButton,
//     Chip, Zoom, Dialog, DialogTitle, DialogContent, DialogActions,
//     alpha, Divider, InputAdornment
// } from '@mui/material';
// import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
// import SaveIcon from '@mui/icons-material/Save';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AvTimerIcon from '@mui/icons-material/AvTimer';
// import ShowChartIcon from '@mui/icons-material/ShowChart';
// import RestartAltIcon from '@mui/icons-material/RestartAlt';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import TuneIcon from '@mui/icons-material/Tune';

// /* ── Default channel data ────────────────────────────────────────── */
// const buildDefaultChannels = () =>
//     Array.from({ length: 12 }, (_, i) => {
//         const ch = i + 1;
//         const is4to20 = ch <= 8;
//         return {
//             id: ch,
//             sl: ch,
//             mode: is4to20 ? '4-20mA' : '0-10V',
//             tagName: `AN${ch}`,
//             min: is4to20 ? (ch <= 4 ? 0 : 4) : 0,
//             max: is4to20 ? (ch <= 4 ? 10 : 20) : 24,
//             multiplication: 1,
//             division: 1,
//         };
//     });

// const MODE_OPTIONS = ['4-20mA', '0-10V', '0-5V', '1-5V'];

// /* ── Mode badge colour map ───────────────────────────────────────── */
// const modeColor = (mode) => ({
//     '4-20mA': { bg: '#e0f2fe', color: '#0369a1' },
//     '0-10V': { bg: '#dcfce7', color: '#166534' },
//     '0-5V': { bg: '#fef3c7', color: '#92400e' },
//     '1-5V': { bg: '#f3e8ff', color: '#6b21a8' },
// }[mode] || { bg: '#f1f5f9', color: '#475569' });

// /* ── Polling Interval Dialog ─────────────────────────────────────── */
// const PollingDialog = ({ open, value, onClose, onChange }) => (
//     <Dialog
//         open={open}
//         onClose={onClose}
//         PaperProps={{
//             sx: {
//                 borderRadius: '20px', width: 380, overflow: 'hidden',
//                 background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
//                 boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
//             }
//         }}
//     >
//         <Box sx={{ background: 'linear-gradient(135deg, #051622 0%, #0a2840 100%)', px: 3, py: 2.5 }}>
//             <Stack direction="row" spacing={1.5} alignItems="center">
//                 <Box sx={{
//                     p: 1, borderRadius: '10px',
//                     background: alpha('#00bcd4', 0.2),
//                     display: 'flex'
//                 }}>
//                     <AccessTimeIcon sx={{ color: '#00bcd4', fontSize: 20 }} />
//                 </Box>
//                 <Box>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff' }}>
//                         Polling Interval
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
//                         Analog channel sampling rate
//                     </Typography>
//                 </Box>
//             </Stack>
//         </Box>
//         <DialogContent sx={{ pt: 3 }}>
//             <Typography variant="caption" sx={{ fontWeight: 700, color: '#475467', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1, display: 'block' }}>
//                 Interval (milliseconds)
//             </Typography>
//             <TextField
//                 fullWidth
//                 type="number"
//                 value={value}
//                 onChange={(e) => onChange(Math.max(100, Number(e.target.value)))}
//                 inputProps={{ min: 100, step: 100 }}
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <AccessTimeIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
//                         </InputAdornment>
//                     ),
//                     endAdornment: <InputAdornment position="end"><Typography variant="caption" color="text.secondary">ms</Typography></InputAdornment>
//                 }}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: '10px',
//                         '& fieldset': { borderColor: '#e0e0e0' },
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                     }
//                 }}
//             />
//             <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
//                 {[500, 1000, 2000, 5000].map(v => (
//                     <Chip
//                         key={v}
//                         label={`${v}ms`}
//                         size="small"
//                         onClick={() => onChange(v)}
//                         sx={{
//                             cursor: 'pointer',
//                             backgroundColor: value === v ? '#051622' : '#f1f5f9',
//                             color: value === v ? '#fff' : '#475467',
//                             fontWeight: 600,
//                             '&:hover': { backgroundColor: value === v ? '#183b52' : '#e2e8f0' }
//                         }}
//                     />
//                 ))}
//             </Stack>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
//             <Button onClick={onClose} sx={{ textTransform: 'none', color: 'text.secondary', borderRadius: '8px' }}>
//                 Cancel
//             </Button>
//             <Button
//                 variant="contained"
//                 onClick={onClose}
//                 sx={{
//                     textTransform: 'none', borderRadius: '10px', fontWeight: 700, px: 3,
//                     background: 'linear-gradient(135deg, #051622 0%, #183b52 100%)',
//                     '&:hover': { background: 'linear-gradient(135deg, #183b52 0%, #0a2840 100%)' }
//                 }}
//             >
//                 Apply
//             </Button>
//         </DialogActions>
//     </Dialog>
// );

// /* ── Main Component ──────────────────────────────────────────────── */
// const AnalogSettings = () => {
//     const [channels, setChannels] = useState(buildDefaultChannels);
//     const [enableScaling, setEnableScaling] = useState(false);
//     const [pollingInterval, setPollingInterval] = useState(1000);
//     const [pollingOpen, setPollingOpen] = useState(false);
//     const [saving, setSaving] = useState(false);
//     const [saved, setSaved] = useState(false);

//     const processRowUpdate = useCallback((newRow) => {
//         // TagName Validation: Max 4 chars
//         if (newRow.tagName && newRow.tagName.length > 4) {
//             alert('Tag Name cannot exceed 4 characters (e.g., AN1)');
//             return channels.find(c => c.id === newRow.id); // Revert to old value
//         }
//         setChannels((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
//         return newRow;
//     }, [channels]);

//     const handleReset = useCallback(() => {
//         setChannels(buildDefaultChannels());
//     }, []);

//     const handleSave = useCallback(() => {
//         setSaving(true);
//         setTimeout(() => {
//             setSaving(false);
//             setSaved(true);
//             setTimeout(() => setSaved(false), 2500);
//         }, 900);
//     }, []);

//     const stats = useMemo(() => ({
//         total: channels.length,
//         mA: channels.filter(c => c.mode === '4-20mA').length,
//         v10: channels.filter(c => c.mode === '0-10V').length,
//         other: channels.filter(c => !['4-20mA', '0-10V'].includes(c.mode)).length,
//     }), [channels]);

//     const columns = useMemo(() => [
//         {
//             field: 'sl',
//             headerName: 'SL',
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//             headerClassName: 'super-app-theme--header'
//         },
//         {
//             field: 'mode',
//             headerName: 'Mode',
//             flex: 1,
//             editable: true,
//             type: 'singleSelect',
//             valueOptions: MODE_OPTIONS,
//             headerAlign: 'center',
//             headerClassName: 'super-app-theme--header',
//             renderCell: (params) => {
//                 const mc = modeColor(params.value);
//                 return (
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', height: '100%', justifyContent: 'center' }}>
//                         <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: mc.color, flexShrink: 0 }} />
//                         <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: mc.color }}>{params.value}</Typography>
//                     </Box>
//                 );
//             }
//         },
//         {
//             field: 'tagName',
//             headerName: 'Tag Name',
//             flex: 1,
//             minWidth: 120,
//             editable: true,
//             headerAlign: 'center',
//             align: 'center',
//             headerClassName: 'super-app-theme--header',
//             preProcessEditCellProps: (params) => {
//                 const hasError = params.props.value && params.props.value.length > 4;
//                 if (hasError) {
//                     alert('Tag Name cannot exceed 4 characters');
//                 }
//                 return { ...params.props, error: hasError };
//             },
//         },
//         {
//             field: 'min',
//             headerName: 'Min',
//             flex: 1,
//             minWidth: 80,
//             editable: true,
//             type: 'number',
//             headerAlign: 'center',
//             align: 'center',
//             headerClassName: 'super-app-theme--header',
//         },
//         {
//             field: 'max',
//             headerName: 'Max',
//             flex: 1,
//             minWidth: 80,
//             editable: true,
//             type: 'number',
//             headerAlign: 'center',
//             align: 'center',
//             headerClassName: 'super-app-theme--header',
//         },
//         {
//             field: 'multiplication',
//             headerName: 'Multiplication',
//             flex: 1,
//             minWidth: 100,
//             editable: true,
//             type: 'number',
//             headerAlign: 'center',
//             align: 'center',
//             headerClassName: 'super-app-theme--header',
//         },
//         {
//             field: 'division',
//             headerName: 'Division',
//             flex: 1,
//             minWidth: 80,
//             editable: true,
//             type: 'number',
//             headerAlign: 'center',
//             align: 'center',
//             headerClassName: 'super-app-theme--header',
//         }
//     ], []);

//     return (
//         <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3, minHeight: '100%', backgroundColor: '#f8fafc' }}>

//             {/* ── Page Header ─────────────────────────────────────── */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Box sx={{
//                         p: 1.5, borderRadius: '14px',
//                         background: 'linear-gradient(135deg, #051622 0%, #183b52 100%)',
//                         boxShadow: '0 4px 15px rgba(5,22,34,0.25)',
//                         display: 'flex'
//                     }}>
//                         <ShowChartIcon sx={{ color: '#00bcd4', fontSize: 26 }} />
//                     </Box>
//                     <Box>
//                         <Typography variant="h5" sx={{ fontWeight: 800, color: '#051622', letterSpacing: '-0.3px' }}>
//                             Analog I/O Settings
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                             Configure analog input channels — mode, scaling, and tag mapping
//                         </Typography>
//                     </Box>
//                 </Box>

//                 {/* Polling Interval Button */}
//                 <Button
//                     variant="contained"
//                     startIcon={<AvTimerIcon />}
//                     onClick={() => setPollingOpen(true)}
//                     sx={{
//                         background: 'linear-gradient(135deg, #051622 0%, #183b52 100%)',
//                         color: '#00bcd4',
//                         textTransform: 'none',
//                         fontWeight: 700,
//                         borderRadius: '12px',
//                         px: 2.5,
//                         py: 1,
//                         boxShadow: '0 4px 15px rgba(5,22,34,0.3)',
//                         '&:hover': {
//                             background: 'linear-gradient(135deg, #183b52 0%, #0a2840 100%)',
//                             boxShadow: '0 6px 20px rgba(5,22,34,0.4)',
//                             transform: 'translateY(-1px)',
//                         },
//                         transition: 'all 0.2s ease',
//                     }}
//                 >
//                     Polling Interval
//                     <Chip
//                         label={`${pollingInterval}ms`}
//                         size="small"
//                         sx={{
//                             ml: 1, height: 20, fontSize: '0.7rem',
//                             backgroundColor: alpha('#00bcd4', 0.2),
//                             color: '#00bcd4', fontWeight: 700
//                         }}
//                     />
//                 </Button>
//             </Box>

//             {/* ── Summary Stats ────────────────────────────────────── */}
//             <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
//                 {[
//                     { label: 'Total Channels', value: stats.total, color: '#051622' },
//                     { label: '4-20mA', value: stats.mA, color: '#0369a1' },
//                     { label: '0-10V', value: stats.v10, color: '#166534' },
//                     { label: 'Others', value: stats.other, color: '#6b21a8' },
//                 ].map(s => (
//                     <Paper key={s.label} elevation={0} sx={{
//                         px: 2.5, py: 1.5, borderRadius: '12px',
//                         border: '1px solid #eef2f6', backgroundColor: '#fff',
//                         display: 'flex', alignItems: 'center', gap: 1.5,
//                         boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
//                     }}>
//                         <Typography variant="h6" sx={{ fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
//                         <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
//                     </Paper>
//                 ))}

//                 <Box sx={{ flexGrow: 1 }} />

//                 {/* Enable Scaling */}
//                 <Paper elevation={0} sx={{
//                     px: 2, py: 1, borderRadius: '12px',
//                     border: enableScaling ? '1.5px solid #00bcd4' : '1px solid #eef2f6',
//                     backgroundColor: enableScaling ? alpha('#00bcd4', 0.04) : '#fff',
//                     transition: 'all 0.25s ease',
//                     display: 'flex', alignItems: 'center'
//                 }}>
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 checked={enableScaling}
//                                 onChange={(e) => setEnableScaling(e.target.checked)}
//                                 icon={<CheckBoxOutlineBlankIcon sx={{ color: '#94a3b8', fontSize: 22 }} />}
//                                 checkedIcon={<CheckBoxIcon sx={{ color: '#00bcd4', fontSize: 22 }} />}
//                                 sx={{ p: 0.5 }}
//                             />
//                         }
//                         label={
//                             <Stack direction="row" spacing={1} alignItems="center">
//                                 <TuneIcon sx={{ fontSize: 16, color: enableScaling ? '#00bcd4' : '#94a3b8' }} />
//                                 <Typography variant="body2" sx={{ fontWeight: 700, color: enableScaling ? '#051622' : '#64748b' }}>
//                                     Enable Scaling
//                                 </Typography>
//                             </Stack>
//                         }
//                         sx={{ m: 0 }}
//                     />
//                 </Paper>
//             </Stack>

//             {/* ── Channel Table with DataGrid ────────────────────────── */}
//             <Paper
//                 elevation={0}
//                 sx={{
//                     borderRadius: '16px',
//                     border: '1px solid #eef2f6',
//                     overflow: 'hidden',
//                     boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
//                     backgroundColor: '#fff',
//                     height: 500,
//                     '& .super-app-theme--header': {
//                         backgroundColor: '#051622',
//                         color: '#00bcd4',
//                         fontWeight: 700,
//                         textTransform: 'uppercase',
//                         letterSpacing: '0.6px',
//                         fontSize: '0.72rem'
//                     },
//                 }}
//             >
//                 <DataGrid
//                     rows={channels}
//                     columns={columns}
//                     processRowUpdate={processRowUpdate}
//                     onProcessRowUpdateError={(error) => console.error(error)}
//                     pageSizeOptions={[5, 10, 25, 50]}
//                     initialState={{
//                         pagination: {
//                             paginationModel: { pageSize: 10 },
//                         },
//                     }}
//                     sx={{
//                         border: 'none',
//                         '& .MuiDataGrid-cell:focus': {
//                             outline: 'none',
//                         },
//                         '& .MuiDataGrid-row:nth-of-type(even)': {
//                             backgroundColor: '#fafbfc',
//                         },
//                         '& .MuiDataGrid-row:hover': {
//                             backgroundColor: alpha('#00bcd4', 0.04),
//                         },
//                         '& .MuiDataGrid-columnSeparator': {
//                             display: 'none',
//                         },
//                     }}
//                 />
//             </Paper>

//             {/* ── Footer Actions ───────────────────────────────────── */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//                 <Button
//                     variant="contained"
//                     onClick={handleSave}
//                     disabled={saving}
//                     startIcon={saving ? null : <SaveIcon />}
//                     sx={{
//                         background: saving
//                             ? undefined
//                             : 'linear-gradient(135deg, #051622 0%, #183b52 100%)',
//                         color: '#fff',
//                         textTransform: 'none',
//                         fontWeight: 700,
//                         borderRadius: '12px',
//                         px: 4, py: 1.2,
//                         fontSize: '0.9rem',
//                         boxShadow: '0 4px 15px rgba(5,22,34,0.3)',
//                         '&:hover': {
//                             background: 'linear-gradient(135deg, #183b52 0%, #0a2840 100%)',
//                             boxShadow: '0 6px 20px rgba(5,22,34,0.45)',
//                             transform: 'translateY(-1px)',
//                         },
//                         '&:disabled': { opacity: 0.65 },
//                         transition: 'all 0.2s ease',
//                     }}
//                 >
//                     {saving ? 'Saving…' : 'Save Settings'}
//                 </Button>

//                 <Tooltip title="Reset all channels to factory defaults">
//                     <Button
//                         variant="outlined"
//                         onClick={handleReset}
//                         startIcon={<RestartAltIcon />}
//                         sx={{
//                             textTransform: 'none', fontWeight: 600, borderRadius: '12px',
//                             borderColor: '#e2e8f0', color: '#475467',
//                             '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' }
//                         }}
//                     >
//                         Reset to Default
//                     </Button>
//                 </Tooltip>

//                 <Zoom in={saved}>
//                     <Stack direction="row" spacing={1} alignItems="center" sx={{
//                         color: 'success.main', backgroundColor: alpha('#22c55e', 0.1),
//                         px: 2, py: 0.8, borderRadius: '10px',
//                         border: '1px solid', borderColor: alpha('#22c55e', 0.3)
//                     }}>
//                         <CheckCircleIcon fontSize="small" />
//                         <Typography variant="body2" sx={{ fontWeight: 700 }}>
//                             Analog settings saved!
//                         </Typography>
//                     </Stack>
//                 </Zoom>
//             </Box>

//             {/* Polling Interval Dialog */}
//             <PollingDialog
//                 open={pollingOpen}
//                 value={pollingInterval}
//                 onClose={() => setPollingOpen(false)}
//                 onChange={setPollingInterval}
//             />
//         </Box>
//     );
// };

// export default AnalogSettings;


