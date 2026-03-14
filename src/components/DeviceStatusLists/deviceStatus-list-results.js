import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Button, Tooltip, Chip, alpha } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { deviceStatusListShow, SearchDevicesFetchService } from '../../services/LoginPageService';
import NotificationBar from '../notification/ServiceNotificationBar';
import { Box, Card, CardContent } from '@mui/material';
import { DeviceStatusListToolbar } from './deviceStatus-list-toolbar';
import DeviceStatusList from './deviceStatusList';

export function DeviceStatusListResults() {
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceList, setDeviceList] = useState([]);
  const [isLoading, setGridLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [notification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  const columns = [
    {
      field: 'custId',
      headerName: 'Customer ID',
      width: 120,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      width: 180,
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'deviceCategoryName',
      headerName: 'Category',
      width: 150,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'serialNo',
      headerName: 'Serial No',
      width: 180,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'lastTelemetry',
      headerName: 'Last Telemetry',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'deviceStatus',
      headerName: 'Status',
      width: 130,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => {
        const isOnline = params.value === 'Online';
        return (
          <Chip
            label={params.value || 'Offline'}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: isOnline ? alpha('#4caf50', 0.1) : alpha('#f44336', 0.1),
              color: isOnline ? '#2e7d32' : '#d32f2f',
              border: `1px solid ${isOnline ? alpha('#4caf50', 0.2) : alpha('#f44336', 0.2)}`,
            }}
          />
        );
      }
    },
    {
      field: 'deviceIp',
      headerName: 'IP Address',
      width: 150,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      width: 150,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Button
          startIcon={<AssessmentIcon />}
          onClick={() => {
            setSelectedDevice(params.row);
            setOpen(true);
          }}
          color="primary"
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            borderRadius: '6px',
            boxShadow: 'none',
            backgroundColor: '#051622',
            '&:hover': {
              backgroundColor: '#183b52',
              boxShadow: 'none',
            },
          }}
        >
          Diagnostic
        </Button>
      ),
    },
  ];

  const handleShowSuccess = (dataObject) => {
    setGridLoading(false);
    setDeviceList(dataObject.data || []);
  };

  const handleShowException = (errorStatus, errorMessage) => {
    setGridLoading(false);
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage || 'Failed to fetch devices',
    });
  };

  useEffect(() => {
    setGridLoading(true);
    deviceStatusListShow(
      { customerId: selectedCustomer === 'all' ? null : selectedCustomer },
      handleShowSuccess,
      handleShowException
    );
  }, [refreshData, selectedCustomer]);

  const filteredRows = useMemo(() => {
    return deviceList.filter((row) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        row.serialNo?.toLowerCase().includes(searchStr) ||
        row.ipAddress?.toLowerCase().includes(searchStr) ||
        row.customerName?.toLowerCase().includes(searchStr)
      );
    });
  }, [deviceList, searchTerm]);

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 120px)', p: 3, backgroundColor: '#f5f7f9' }}>
      <Card sx={{
        height: '100%',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #eef2f6'
      }}>
        <CardContent sx={{
          height: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <DeviceStatusListToolbar
            onCustomerChange={(value) => setSelectedCustomer(value)}
            onSearchChange={(value) => setSearchTerm(value)}
            setRefreshData={setRefreshData}
          />

          <Box sx={{
            flexGrow: 1,
            width: '100%',
            '& .super-app-theme--header': {
              backgroundColor: '#f8f9fa',
              color: '#475467',
              fontWeight: 600,
            },
          }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              loading={isLoading}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              getRowId={(row) => row.id || row.deviceSerialNo}
              sx={{
                border: 'none',
                [`& .${gridClasses.cell}`]: {
                  borderBottom: '1px solid #f0f2f5',
                },
                [`& .${gridClasses.columnHeader}`]: {
                  borderBottom: '1px solid #f0f2f5',
                },
                [`& .${gridClasses.row}:hover`]: {
                  backgroundColor: '#f9fafb',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: 'none',
                },
              }}
            />
          </Box>

          <DeviceStatusList
            open={open}
            setOpen={setOpen}
            deviceData={selectedDevice}
          />

          <NotificationBar
            handleClose={handleClose}
            notificationContent={notification.message}
            openNotification={notification.status}
            type={notification.type}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
