import React, { useState, useMemo, useCallback } from 'react';
import {
    Box, Typography, Button, Paper, Stack,
    Checkbox as MuiCheckbox, Select, MenuItem, TextField,
    FormControlLabel, alpha,
    Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
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

const DifferentPollingInterval = () => {
    const [enabled, setEnabled] = useState(false);

    const [rows, setRows] = useState(
        Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            slaveId: i < 5 ? '1' : '',
            tagName: `R${301 + i}`,
            registerAddress: i < 5 ? '1' : '',
            registerType: i < 5 ? 'Input Register' : '',
            offset: i < 5 ? '0' : '',
            conversion: i < 5 ? 'Raw Hex' : '',
            length: i < 5 ? '1' : '',
            enabled: false,
            interval: i < 5 ? '1' : ''
        }))
    );

    const handleProcessRowUpdate = useCallback((newRow) => {
        // TagName Validation: Max 4 chars
        if (newRow.tagName && newRow.tagName.length > 4) {
            alert('Tag Name cannot exceed 4 characters (e.g., R1S1)');
            return rows.find(r => r.id === newRow.id);
        }
        setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
        return newRow;
    }, [rows]);

    const columns = useMemo(() => [
        { field: 'id', headerName: 'SL', width: 60, align: 'center', headerAlign: 'center' },
        { field: 'slaveId', headerName: 'Slave ID', width: 90, editable: true },
        { field: 'tagName', headerName: 'TagName', flex: 1, editable: true },
        { field: 'registerAddress', headerName: 'Register Address', flex: 1, editable: true },
        {
            field: 'registerType',
            headerName: 'Register Type',
            flex: 1.2,
            editable: true,
            type: 'singleSelect',
            valueOptions: REGISTER_TYPES
        },
        { field: 'offset', headerName: 'Offset', width: 80, editable: true },
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
            field: 'enabled',
            headerName: 'Enable',
            width: 80,
            type: 'boolean',
            editable: true,
            align: 'center',
            headerAlign: 'center'
        },
        { field: 'interval', headerName: 'Interval', width: 90, editable: true },
    ], []);

    const btnSx = {
        textTransform: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '0.82rem', px: 2,
    };

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, backgroundColor: '#f8fafc' }}>
            {/* Page Title */}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#051622', mb: 0.5 }}>
                    Different Polling Interval
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Configure individual polling intervals per slave register
                </Typography>
            </Box>

            {/* Control Card */}
            <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #eef2f6', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Card Header */}
                <Box sx={{
                    px: 3, py: 2, backgroundColor: '#051622',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 2
                }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                            Different Polling Interval Slave
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#fff', 0.2), mx: 0.5 }} />
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
                            label={<Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>Enable All</Typography>}
                        />
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained" size="small"
                            startIcon={<RefreshIcon fontSize="small" />}
                            sx={{ ...btnSx, backgroundColor: '#00838f', '&:hover': { backgroundColor: '#006064' } }}
                        >
                            Refresh
                        </Button>
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
            </Paper>
        </Box>
    );
};

export default DifferentPollingInterval;
