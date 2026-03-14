import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { unallocateddeviceListShow, UnallocatedDeviceMapping } from '../../services/LoginPageService';
import NotificationBar from '../notification/ServiceNotificationBar';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const UnallocatedMappingList = ({ locationDetails }) => {
    const [deviceList, setDeviceList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectAll, setSelectAll] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        fetchUnallocatedDevices();
    }, []);

    const fetchUnallocatedDevices = () => {
        setIsLoading(true);
        unallocateddeviceListShow((dataObject) => {
            setIsLoading(false);
            setDeviceList(dataObject?.data || []);
        }, () => setIsLoading(false));
    };

    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        setDeviceList(prev => prev.map(row => ({ ...row, selected: checked })));
    };

    const handleCheckboxChange = (id, checked) => {
        setDeviceList(prev => prev.map(row => row.id === id ? { ...row, selected: checked } : row));
    };

    const showNotification = (type, message) => {
        setNotification({ status: true, type, message });
    };

    const handleMapToSite = () => {
        const selectedDevices = deviceList.filter(d => d.selected);
        if (selectedDevices.length === 0) {
            showNotification('error', 'Please select at least one device');
            return;
        }

        if (!locationDetails.locationId) {
            showNotification('error', 'Please select a Location in the selectors above');
            return;
        }

        setIsLoading(true);
        const payload = {
            locationId: locationDetails.locationId,
            deviceIds: selectedDevices.map(d => d.id)
        };

        UnallocatedDeviceMapping(payload, () => {
            setIsLoading(false);
            showNotification('success', `Successfully mapped ${selectedDevices.length} devices to site`);
            fetchUnallocatedDevices();
        }, (error, msg) => {
            setIsLoading(false);
            showNotification('error', `Failed to map devices: ${msg}`);
        });
    };

    const columns = [
        {
            field: 'selected',
            headerName: '',
            width: 90,
            renderHeader: () => (
                <Checkbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    icon={<CheckBoxOutlineBlankIcon sx={{ color: '#fff' }} />}
                    checkedIcon={<CheckBoxIcon sx={{ color: '#fff' }} />}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.selected}
                    onChange={(e) => handleCheckboxChange(params.row.id, e.target.checked)}
                    icon={<CheckBoxOutlineBlankIcon sx={{ color: '#000' }} />}
                    checkedIcon={<CheckBoxIcon sx={{ color: '#000' }} />}
                />
            ),
        },
        { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center' },
        { field: 'deviceName', headerName: 'Device Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'deviceCategoryName', headerName: 'Category', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'deviceTag', headerName: 'Device Tag', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'deviceStatus', headerName: 'Status', width: 120, headerAlign: 'center', align: 'center' },
    ];

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleMapToSite}
                    disabled={isLoading || !deviceList.some(d => d.selected)}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        backgroundColor: '#212121',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#212121', // same as default
                        }
                    }}
                >
                    Map to Selected Location
                </Button>
            </Box>
            <DataGrid
                rows={deviceList}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                loading={isLoading}
                disableSelectionOnClick
                // sx={{
                //     border: 'none',
                //     '& .MuiDataGrid-columnHeaders': {
                //         backgroundColor: '#f5f5f5',
                //         color: '#333',
                //         fontWeight: 600,
                //     },
                //     '& .MuiDataGrid-cell': { borderBottom: '1px solid #eee' },
                // }}
                sx={{
                    border: 'none',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    '& .MuiDataGrid-columnHeaders': {
                        background: 'linear-gradient(90deg, #1a1a1a, #333)',
                        color: '#fff',
                        fontWeight: 600,
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(0,0,0,0.04)',
                        py: '8px',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none',
                    },
                    // Apply colors based on deviceStatus
                    '& .enabled': {
                        backgroundColor: 'rgba(76, 175, 80, 0.08)',
                        '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.12)',
                        },
                    },
                    '& .disabled': {
                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                        '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.12)',
                        },
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.5px',
                    }
                }}
            />
            <NotificationBar
                handleClose={() => setNotification({ ...openNotification, status: false })}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>
    );
};

export default UnallocatedMappingList;
