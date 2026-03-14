import React, { useState, useMemo, useCallback } from 'react';
import {
    Box, Typography, Button, Paper, Stack,
    Checkbox as MuiCheckbox, Select, MenuItem, TextField, alpha, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const REGISTER_TYPES = ['Input Register', 'Holding Register', 'Coil', 'Discrete Input'];
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

const ModbusTcpMaster = () => {
    const [rows, setRows] = useState(
        Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            slaveId: i === 0 ? '1' : (i === 9 ? '0' : ''),
            tagName: `TG${String(i + 1).padStart(2, '0')}`,
            slaveIp: i === 0 ? '111.111.111.111' : '',
            socket: i === 0 ? '1' : '',
            slavePort: i === 0 ? '502' : '',
            startAddress: i === 0 ? '1' : '',
            offset: i === 0 ? '0' : '',
            type: i === 0 ? 'Input Register' : '',
            conversion: i === 0 ? 'Raw Hex' : '',
            length: i === 0 ? '1' : '',
            status: false
        }))
    );

    const handleProcessRowUpdate = useCallback((newRow) => {
        // Validation logic
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (newRow.tagName && newRow.tagName.length > 4) {
            alert('Tag Name cannot exceed 4 characters (e.g., R1S1)');
            return rows.find(r => r.id === newRow.id);
        }

        if (newRow.slaveIp && !ipRegex.test(newRow.slaveIp)) {
            alert('Invalid Slave IP address (e.g., 255.255.255.255)');
            return rows.find(r => r.id === newRow.id);
        }

        setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
        return newRow;
    }, [rows]);

    const columns = useMemo(() => [
        { field: 'id', headerName: 'SL', width: 60, align: 'center', headerAlign: 'center' },
        { field: 'slaveId', headerName: 'Slave ID', width: 90, editable: true },
        { field: 'tagName', headerName: 'TagName', flex: 1, editable: true },
        { field: 'slaveIp', headerName: 'Slave IP', flex: 1.2, editable: true },
        { field: 'socket', headerName: 'Socket', width: 80, editable: true },
        { field: 'slavePort', headerName: 'Port', width: 80, editable: true },
        { field: 'startAddress', headerName: 'Start Addr', width: 100, editable: true },
        { field: 'offset', headerName: 'Offset', width: 80, editable: true },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1.2,
            editable: true,
            type: 'singleSelect',
            valueOptions: REGISTER_TYPES
        },
        {
            field: 'conversion',
            headerName: 'Conversion',
            flex: 1.2,
            editable: true,
            type: 'singleSelect',
            valueOptions: CONVERSION_OPTIONS
        },
        { field: 'length', headerName: 'Length', width: 80, editable: true },
        {
            field: 'status',
            headerName: 'Status',
            width: 80,
            type: 'boolean',
            editable: true,
            align: 'center',
            headerAlign: 'center'
        },
    ], []);

    const btnSx = {
        textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', px: 2,
    };

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, backgroundColor: '#f8fafc' }}>
            {/* Page Title */}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622', mb: 0.5 }}>
                    Modbus TCP (Master)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Configure TCP slave register mappings over Ethernet/WiFi
                </Typography>
            </Box>

            {/* Control Card */}
            <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #eef2f6', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Card Header */}
                <Box sx={{
                    px: 3, py: 2, backgroundColor: '#051622',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    flexWrap: 'wrap', gap: 1.5
                }}>
                    <Button
                        variant="contained" size="small"
                        startIcon={<RefreshIcon fontSize="small" />}
                        sx={{ ...btnSx, backgroundColor: '#00838f', '&:hover': { backgroundColor: '#006064' } }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained" size="small"
                        startIcon={<AvTimerIcon fontSize="small" />}
                        sx={{ ...btnSx, backgroundColor: '#00838f', '&:hover': { backgroundColor: '#006064' } }}
                    >
                        Polling Interval
                    </Button>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#fff', 0.2), mx: 0.5 }} />
                    <Button
                        variant="contained" size="small"
                        startIcon={<SaveIcon fontSize="small" />}
                        sx={{
                            ...btnSx, backgroundColor: alpha('#fff', 0.9), color: '#051622',
                            '&:hover': { backgroundColor: '#fff' }
                        }}
                    >
                        Save
                    </Button>
                </Box>

                {/* DataGrid Implementation */}
                <Box sx={{ flexGrow: 1, width: '100%', bgcolor: '#fff' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        pagination
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
                        }}
                    />
                </Box>

                {/* Note Footer */}
                <Box sx={{
                    px: 3, py: 1.5,
                    borderTop: '1px solid #eef2f6',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: '#1565c0' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1565c0' }}>Note: &nbsp;</Typography>
                    <Typography variant="caption" sx={{ color: '#1565c0' }}>
                        Device and Slave Should be in Same Network!
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default ModbusTcpMaster;
