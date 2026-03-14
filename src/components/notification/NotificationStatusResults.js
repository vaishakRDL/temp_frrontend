import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Card, CardContent, Typography, Chip, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { customerShowList, notificationDataList, notificationFilterList } from '../../services/LoginPageService';
import { NotificationStatusToolbar } from './NotificationStatusToolbar';

const NotificationStatusResults = () => {
    // ... columns definition
    // (keeping columns as they are)
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'customerName',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', mr: 1, bgcolor: '#3f51b5' }}>
                        {params.value ? params.value[0] : 'C'}
                    </Avatar>
                    <Typography variant="body2">{params.value}</Typography>
                </Box>
            )
        },
        {
            field: 'message',
            headerName: 'Message Content',
            flex: 2,
            headerAlign: 'left',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            // renderCell: (params) => {
            //     if (!params.value) return '';
            //     const date = new Date(params.value);
            //     return (
            //         <Chip
            //             label={date.toLocaleString()}
            //             size="small"
            //             variant="outlined"
            //             sx={{ fontSize: '0.75rem', borderColor: 'rgba(0,0,0,0.1)' }}
            //         />
            //     );
            // },
        },
    ];

    const [notificationList, setNotificationList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [selectedFilterCustomer, setSelectedFilterCustomer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if (selectedFilterCustomer) {
            notificationFilterList(
                { customerId: selectedFilterCustomer },
                (data) => {
                    setNotificationList(data.data || []);
                    setIsLoading(false);
                },
                (err) => {
                    console.error(err);
                    setIsLoading(false);
                }
            );
        } else {
            notificationDataList(
                (data) => {
                    setNotificationList(data.data || []);
                    setIsLoading(false);
                },
                (err) => {
                    console.error(err);
                    setIsLoading(false);
                }
            );
        }

        customerShowList(
            (data) => setCustomerList(data.data || []),
            (err) => console.error(err)
        );
    }, [refreshData, selectedFilterCustomer]);

    // Removed the client-side filter since we're using the API now
    const displayNotifications = notificationList;

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
                <GridToolbarExport sx={{ color: '#666', fontWeight: 600, textTransform: 'none' }} />

                <FormControl variant="outlined" size="small" sx={{ minWidth: 250 }}>
                    <InputLabel id="customer-filter-label" sx={{ fontSize: '0.85rem' }}>Filter by Customer</InputLabel>
                    <Select
                        labelId="customer-filter-label"
                        value={selectedFilterCustomer}
                        label="Filter by Customer"
                        onChange={(e) => setSelectedFilterCustomer(e.target.value)}
                        sx={{
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.2)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3f51b5' }
                        }}
                    >
                        <MenuItem value="">Show All Customers</MenuItem>
                        {customerList.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id || customer.customerName} sx={{ fontSize: '0.85rem' }}>
                                {customer.customerName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </GridToolbarContainer>
        );
    }

    return (
        <Box sx={{ width: '100%', pb: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <HistoryIcon sx={{ mr: 1.5, color: '#333', fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Notification History
                </Typography>
            </Box>
            <NotificationStatusToolbar setRefreshData={setRefreshData} />

            <Card
                sx={{
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    mb: 4
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={notificationList}
                            columns={columns}
                            pageSize={10}
                            loading={isLoading}
                            rowsPerPageOptions={[10, 20, 50]}
                            disableSelectionOnClick
                            components={{ Toolbar: CustomToolbar }}
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-main': {
                                    borderRadius: '24px',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#fafafa',
                                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                                    minHeight: '60px !important',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid rgba(0,0,0,0.02)',
                                    padding: '12px 16px',
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: 'none',
                                    bgcolor: '#fafafa',
                                },
                                '& .MuiDataGrid-iconSeparator': {
                                    display: 'none',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'rgba(63, 81, 181, 0.02)',
                                }
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>

        </Box>
    );
};

export default NotificationStatusResults;
