import React, { useState, useMemo, useCallback } from 'react';
import {
    Box, Typography, Button, Paper, Stack,
    Checkbox as MuiCheckbox, Select, MenuItem, TextField,
    FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Divider, alpha
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import RefreshIcon from '@mui/icons-material/Refresh';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

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
const MAX_SLAVES = 30;

const CommonRegisterGroup = () => {
    const [enabled, setEnabled] = useState(false);
    const [slaves, setSlaves] = useState([{ id: 1, slaveId: '1' }]);
    const [numSlaves, setNumSlaves] = useState(1);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    // DataGrid state
    const [rows, setRows] = useState(
        Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            tagName: i === 0 ? 'kk' : '',
            registerAddress: i === 0 ? '20' : '',
            registerType: i === 0 ? 'Input Register' : '',
            offset: i === 0 ? '0' : '',
            conversion: i === 0 ? 'Double' : '',
            length: i === 0 ? '2' : '',
            enabled: i === 0
        }))
    );

    const handleProcessRowUpdate = useCallback((newRow) => {
        // TagName Validation: Max 4 chars
        if (newRow.tagName && newRow.tagName.length > 4) {
            alert('Tag Name cannot exceed 4 characters (e.g., R1S1)');
            return rows.find(r => r.id === newRow.id); // Revert to old value
        }
        setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
        return newRow;
    }, [rows]);

    const columns = useMemo(() => [
        { field: 'id', headerName: 'SL', width: 60, align: 'center', headerAlign: 'center' },
        { field: 'tagName', headerName: 'TagName', flex: 1, editable: true },
        { field: 'registerAddress', headerName: 'Register Address', flex: 1, editable: true },
        {
            field: 'registerType',
            headerName: 'Register Type',
            flex: 1,
            editable: true,
            type: 'singleSelect',
            valueOptions: REGISTER_TYPES
        },
        { field: 'offset', headerName: 'Offset', flex: 0.8, editable: true },
        {
            field: 'conversion',
            headerName: 'Conversion',
            flex: 1,
            editable: true,
            type: 'singleSelect',
            valueOptions: CONVERSION_OPTIONS
        },
        { field: 'length', headerName: 'Length', flex: 0.8, editable: true },
        {
            field: 'enabled',
            headerName: 'Enable',
            width: 80,
            editable: true,
            align: 'center',
            headerAlign: 'center',
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
    ], [setRows]);

    const handleNumSlavesChange = (val) => {
        const num = Math.max(1, Math.min(MAX_SLAVES, Number(val)));
        setNumSlaves(num);
        const updated = Array.from({ length: num }, (_, i) => (
            slaves[i] || { id: i + 1, slaveId: String(i + 1) }
        ));
        setSlaves(updated);
    };

    const handleAddSlave = () => {
        if (slaves.length >= MAX_SLAVES) return;
        const next = slaves.length + 1;
        const updated = [...slaves, { id: next, slaveId: String(next) }];
        setSlaves(updated);
        setNumSlaves(updated.length);
    };

    const btnSx = {
        textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', px: 2,
        backgroundColor: '#051622', '&:hover': { backgroundColor: '#183b52' }
    };

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, backgroundColor: '#f8fafc' }}>
            {/* Page Title */}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622', mb: 0.5 }}>Common Register Group</Typography>
                <Typography variant="body2" color="text.secondary">Configure shared Modbus register mappings for grouped slaves</Typography>
            </Box>

            {/* Control Card */}
            <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #eef2f6', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Card Header */}
                <Box sx={{
                    px: 3, py: 2, backgroundColor: '#051622',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 2
                }}>
                    {/* Left: Enable toggle */}
                    <FormControlLabel
                        control={
                            <MuiCheckbox
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                icon={<CheckBoxOutlineBlankIcon sx={{ color: alpha('#fff', 0.6), fontSize: 22 }} />}
                                checkedIcon={<CheckBoxIcon sx={{ color: '#fff', fontSize: 22 }} />}
                                sx={{ p: 0.5 }}
                            />
                        }
                        label={<Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>Enable Slave Group</Typography>}
                    />

                    {/* Right: Action buttons */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button variant="outlined" size="small" startIcon={<AddCircleIcon fontSize="small" />}
                            onClick={() => setAddDialogOpen(true)}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', color: '#fff', borderColor: alpha('#fff', 0.4), '&:hover': { borderColor: '#fff', backgroundColor: alpha('#fff', 0.08) } }}>
                            Add Slave
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<DeveloperBoardIcon fontSize="small" />}
                            onClick={() => setViewDialogOpen(true)}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', color: '#fff', borderColor: alpha('#fff', 0.4), '&:hover': { borderColor: '#fff', backgroundColor: alpha('#fff', 0.08) } }}>
                            View Slave
                        </Button>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#fff', 0.2), mx: 0.5 }} />
                        <Button variant="contained" size="small" startIcon={<RefreshIcon fontSize="small" />}
                            sx={{ ...btnSx, backgroundColor: alpha('#fff', 0.12), '&:hover': { backgroundColor: alpha('#fff', 0.2) } }}>
                            Refresh
                        </Button>
                        <Button variant="contained" size="small" startIcon={<AvTimerIcon fontSize="small" />}
                            sx={{ ...btnSx, backgroundColor: alpha('#fff', 0.12), '&:hover': { backgroundColor: alpha('#fff', 0.2) } }}>
                            Polling Interval
                        </Button>
                        <Button variant="contained" size="small" startIcon={<SaveIcon fontSize="small" />}
                            sx={{ ...btnSx, backgroundColor: alpha('#fff', 0.9), color: '#051622', '&:hover': { backgroundColor: '#fff' } }}>
                            Save
                        </Button>
                    </Stack>
                </Box>

                {/* DataGrid Implementation */}
                <Box sx={{ flexGrow: 1, width: '100%', bgcolor: '#fff' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        pagination
                        checkboxSelection
                        disableSelectionOnClick
                        processRowUpdate={handleProcessRowUpdate}
                        experimentalFeatures={{ newEditingApi: true }}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#051622',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                            },
                            '& .MuiDataGrid-columnSeparator': {
                                display: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f0f2f5',
                                fontSize: '0.85rem',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: alpha('#051622', 0.03),
                            },
                            '& .MuiCheckbox-root': {
                                color: '#051622',
                                '&.Mui-checked': { color: '#051622' }
                            }
                        }}
                    />
                </Box>
            </Paper>

            {/* Adjacency Dialogs (Slave Management) */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', width: 400, overflow: 'hidden' } }}>
                <DialogTitle sx={{ backgroundColor: '#051622', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Slave Manager</Typography>
                    <IconButton onClick={() => setAddDialogOpen(false)} sx={{ color: '#fff', '&:hover': { backgroundColor: alpha('#fff', 0.1) } }}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#051622', whiteSpace: 'nowrap' }}>No. of Slaves:</Typography>
                        <TextField type="number" size="small" value={numSlaves}
                            onChange={(e) => handleNumSlavesChange(e.target.value)}
                            inputProps={{ min: 1, max: MAX_SLAVES }}
                            sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
                    <Button variant="outlined" onClick={() => setAddDialogOpen(false)}
                        sx={{ textTransform: 'none', borderRadius: '8px', color: 'text.secondary', borderColor: '#e0e0e0', px: 3 }}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleAddSlave}
                        startIcon={<AddCircleIcon />}
                        sx={{ ...btnSx }}>
                        Add Slave ({slaves.length}/30)
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', width: 380, overflow: 'hidden' } }}>
                <DialogTitle sx={{ backgroundColor: '#051622', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>View Slaves</Typography>
                    <IconButton onClick={() => setViewDialogOpen(false)} sx={{ color: '#fff', '&:hover': { backgroundColor: alpha('#fff', 0.1) } }}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {slaves.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">No slaves added yet.</Typography>
                        </Box>
                    ) : (
                        slaves.map((s, idx) => (
                            <Box key={s.id} sx={{ py: 1, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Slave #{s.id}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>ID: {s.slaveId}</Typography>
                            </Box>
                        ))
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button fullWidth variant="contained" onClick={() => setViewDialogOpen(false)} sx={{ ...btnSx }}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommonRegisterGroup;
