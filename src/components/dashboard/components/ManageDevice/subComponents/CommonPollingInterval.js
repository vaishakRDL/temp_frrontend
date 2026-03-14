import React, { useState } from 'react';
import {
    Box, Typography, Button, Stack, TextField, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox as MuiCheckbox, Select, MenuItem, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, FormControlLabel, alpha, Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const REGISTER_TYPES = ['Input Register', 'Holding Register', 'Coil'];
const CONVERSION_OPTIONS = [
    'Raw Hex',
    'Integer',
    'Double',
    'Float: Big Endian',
    'Float: Little Endian',
    '64 bit UINT',
    'Mid-little Float',
    'Mid-big Float'
];

const SlaveConfigView = ({ slave, onBack, onSave }) => {
    const [rows, setRows] = useState([
        { id: 1, tagName: 'Temperature', address: '40001', type: 'holding_register', offset: '0', conversion: 'Integer', length: '2', enabled: true },
        { id: 2, tagName: 'Humidity', address: '40002', type: 'holding_register', offset: '2', conversion: 'Float: Big Endian', length: '4', enabled: true },
        { id: 3, tagName: 'Pressure', address: '40003', type: 'input_register', offset: '6', conversion: 'Double', length: '8', enabled: false },
        { id: 4, tagName: '', address: '', type: '', offset: '', conversion: 'Integer', length: '2', enabled: true },
        { id: 5, tagName: '', address: '', type: '', offset: '', conversion: 'Integer', length: '2', enabled: true },
        { id: 6, tagName: '', address: '', type: '', offset: '', conversion: 'Integer', length: '2', enabled: true },
    ]);

    const columns = [
        { field: 'id', headerName: 'SL', width: 60, align: 'center', headerAlign: 'center' },
        { field: 'tagName', headerName: 'TagName', flex: 1.5, editable: true },
        { field: 'address', headerName: 'Register Address', flex: 1.2, editable: true },
        {
            field: 'type', headerName: 'Register Type', flex: 1.2, editable: true,
            type: 'singleSelect',
            valueOptions: REGISTER_TYPES.map(t => ({ value: t.toLowerCase().replace(' ', '_'), label: t }))
        },
        { field: 'offset', headerName: 'Offset', flex: 1, editable: true },
        {
            field: 'conversion', headerName: 'Conversion', flex: 1.5, editable: true,
            type: 'singleSelect',
            valueOptions: CONVERSION_OPTIONS
        },
        { field: 'length', headerName: 'Length', flex: 1, editable: true },
        {
            field: 'enabled', headerName: 'Enable', flex: 0.8,
            headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                const handleChange = (event) => {
                    const newValue = event.target.checked;
                    setRows((prevRows) =>
                        prevRows.map((row) =>
                            row.id === params.id ? { ...row, enabled: newValue } : row
                        )
                    );
                };
                return (
                    <MuiCheckbox
                        checked={params.value}
                        onChange={handleChange}
                        onClick={(e) => e.stopPropagation()}
                        icon={<CheckBoxOutlineBlankIcon sx={{ color: '#051622', fontSize: 20 }} />}
                        checkedIcon={<CheckBoxIcon sx={{ color: '#051622', fontSize: 20 }} />}
                    />
                );
            }
        },
    ];


    const processRowUpdate = (newRow) => {
        // TagName Validation: Max 4 chars
        if (newRow.tagName && newRow.tagName.length > 4) {
            alert('Tag Name cannot exceed 4 characters (e.g., R1S1)');
            return rows.find(r => r.id === newRow.id); // Revert to old value
        }
        const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
        setRows(updatedRows);
        return newRow;
    };

    const btnSx = {
        textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', px: 2,
        backgroundColor: '#051622', '&:hover': { backgroundColor: '#183b52' }
    };

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: '#f8fafc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Back to List">
                        <IconButton onClick={onBack} sx={{ color: '#051622', backgroundColor: alpha('#051622', 0.05), '&:hover': { backgroundColor: alpha('#051622', 0.1) } }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622' }}>{slave.deviceName}</Typography>
                        <Typography variant="body2" color="text.secondary">Configure Modbus registers for Slave ID: {slave.slaveId}</Typography>
                    </Box>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #eef2f6', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{
                    px: 3, py: 2, backgroundColor: '#051622',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {/* <TextField
                            label="Slave ID"
                            value={slave.slaveId}
                            disabled
                            size="small"
                            sx={{
                                width: 100,
                                '& .MuiInputBase-root': { color: '#fff' },
                                '& .MuiInputLabel-root': { color: alpha('#fff', 0.7) },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#fff', 0.3) }
                            }}
                        /> */}
                        <FormControlLabel
                            control={
                                <MuiCheckbox
                                    defaultChecked
                                    icon={<CheckBoxOutlineBlankIcon sx={{ color: alpha('#fff', 0.6), fontSize: 22 }} />}
                                    checkedIcon={<CheckBoxIcon sx={{ color: '#fff', fontSize: 22 }} />}
                                    sx={{ p: 0.5 }}
                                />
                            }
                            label={<Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>Enable Slave</Typography>}
                        />
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" size="small" startIcon={<RefreshIcon fontSize="small" />}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', color: '#fff', borderColor: alpha('#fff', 0.4), '&:hover': { borderColor: '#fff', backgroundColor: alpha('#fff', 0.08) } }}>
                            Refresh
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<AvTimerIcon fontSize="small" />}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', color: '#fff', borderColor: alpha('#fff', 0.4), '&:hover': { borderColor: '#fff', backgroundColor: alpha('#fff', 0.08) } }}>
                            Polling Interval
                        </Button>
                        <Button variant="contained" size="small" startIcon={<SaveIcon fontSize="small" />}
                            onClick={() => onSave(rows)}
                            sx={{ backgroundColor: alpha('#fff', 0.9), color: '#051622', textTransform: 'none', fontWeight: 700, borderRadius: '8px', '&:hover': { backgroundColor: '#fff' } }}>
                            Save
                        </Button>
                    </Stack>
                </Box>

                <Box sx={{ flexGrow: 1, backgroundColor: '#fff' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={(error) => console.error(error)}
                        density="compact"
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#051622',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                            },
                            '& .MuiDataGrid-columnHeader': { backgroundColor: '#051622', color: '#fff' },
                            '& .MuiDataGrid-columnSeparator': { display: 'none' },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f0f2f5',
                                fontSize: '0.85rem',
                            },
                            '& .MuiDataGrid-row:hover': { backgroundColor: alpha('#051622', 0.03) },
                            '& .MuiCheckbox-root': {
                                color: '#051622',
                                '&.Mui-checked': { color: '#051622' }
                            }
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

const CommonPollingInterval = () => {
    const [slaves, setSlaves] = useState([]);
    const [activeSlave, setActiveSlave] = useState(null);
    const [slaveSearchTerm, setSlaveSearchTerm] = useState('');
    const [isAddSlaveDialogOpen, setIsAddSlaveDialogOpen] = useState(false);
    const [newSlaveData, setNewSlaveData] = useState({ slaveId: '', deviceName: '' });

    const handleAddSlave = () => {
        if (newSlaveData.slaveId && newSlaveData.deviceName) {
            setSlaves(prev => [...prev, { ...newSlaveData, id: Date.now().toString() }]);
            setNewSlaveData({ slaveId: '', deviceName: '' });
            setIsAddSlaveDialogOpen(false);
        }
    };

    const columns = [
        { field: 'slaveId', headerName: 'Slave ID', flex: 1, headerAlign: 'center', align: 'center', editable: true },
        { field: 'deviceName', headerName: 'Device Name', flex: 2, headerAlign: 'center', align: 'center', editable: true },
        {
            field: 'actions', headerName: 'Configuration', flex: 1,
            headerAlign: 'center', align: 'center', sortable: false,
            renderCell: (params) => (
                <Button
                    variant="contained" size="small"
                    startIcon={<SettingsIcon fontSize="small" />}
                    onClick={() => setActiveSlave(params.row)}
                    sx={{ textTransform: 'none', borderRadius: '8px', backgroundColor: '#051622', px: 2, '&:hover': { backgroundColor: '#183b52' } }}
                >
                    Configure
                </Button>
            )
        }
    ];

    const processSlaveUpdate = (newRow) => {
        const updatedSlaves = slaves.map((s) => (s.id === newRow.id ? newRow : s));
        setSlaves(updatedSlaves);
        return newRow;
    };


    const filteredSlaves = slaves.filter(s =>
        s.deviceName.toLowerCase().includes(slaveSearchTerm.toLowerCase()) ||
        s.slaveId.toLowerCase().includes(slaveSearchTerm.toLowerCase())
    );

    if (activeSlave) {
        return <SlaveConfigView slave={activeSlave} onBack={() => setActiveSlave(null)} onSave={() => setActiveSlave(null)} />;
    }

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, backgroundColor: '#f8fafc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622' }}>Common Polling Interval</Typography>
                    <Typography variant="body2" color="text.secondary">Manage and configure your RTU Slaves efficiently</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setIsAddSlaveDialogOpen(true)}
                    sx={{ backgroundColor: '#051622', borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, '&:hover': { backgroundColor: '#183b52' } }}
                >
                    Add Slave
                </Button>
            </Box>

            <TextField
                fullWidth size="small"
                placeholder="Search by Slave ID or Device Name..."
                value={slaveSearchTerm}
                onChange={(e) => setSlaveSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                    sx: { borderRadius: '10px', backgroundColor: '#fff' }
                }}
                sx={{ maxWidth: 450 }}
            />


            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 1.5, backgroundColor: '#051622', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>Slave List</Typography>
                </Box>
                <Box sx={{ flexGrow: 1, backgroundColor: '#fff' }}>
                    <DataGrid
                        rows={filteredSlaves}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        checkboxSelection
                        disableSelectionOnClick
                        processRowUpdate={processSlaveUpdate}
                        experimentalFeatures={{ newEditingApi: true }}
                        onProcessRowUpdateError={(error) => console.error(error)}
                        density="comfortable"
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f8f9fa',
                                color: '#475467',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                            },
                            '& .MuiDataGrid-columnSeparator': { display: 'none' },
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f2f5' },
                            '& .MuiDataGrid-row:hover': { backgroundColor: alpha('#051622', 0.02) },
                            '& .MuiCheckbox-root': {
                                color: '#051622',
                                '&.Mui-checked': { color: '#051622' }
                            }
                        }}
                    />
                </Box>
            </Paper>

            {/* Add Slave Dialog */}
            <Dialog open={isAddSlaveDialogOpen} onClose={() => setIsAddSlaveDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, width: 400 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#051622' }}>Add New Slave</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Slave ID" placeholder="Enter Slave ID (e.g., 1)"
                            value={newSlaveData.slaveId}
                            onChange={(e) => setNewSlaveData(prev => ({ ...prev, slaveId: e.target.value }))} />
                        <TextField fullWidth label="Device Name" placeholder="Enter Device Name (e.g., DEVICE 1)"
                            value={newSlaveData.deviceName}
                            onChange={(e) => setNewSlaveData(prev => ({ ...prev, deviceName: e.target.value }))} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsAddSlaveDialogOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddSlave}
                        sx={{ backgroundColor: '#051622', px: 4, borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#183b52' } }}>
                        Add Slave
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommonPollingInterval;
