import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Divider,
  Chip,
  IconButton,
  alpha
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DeviceDebugResultService } from '../../services/LoginPageService';
import NotificationBar from '../notification/ServiceNotificationBar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

function DeviceStatusList({
  open,
  setOpen,
  deviceData = {},
}) {
  const [diagnosticData, setDiagnosticData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  useEffect(() => {
    if (open && deviceData?.id) {
      fetchDiagnostics();
    }
  }, [open, deviceData]);

  const fetchDiagnostics = () => {
    setIsLoading(true);
    DeviceDebugResultService(
      { id: deviceData.id },
      (res) => {
        setIsLoading(false);
        setDiagnosticData(res.data || []);
      },
      (status, message) => {
        setIsLoading(false);
        setNotification({
          status: true,
          type: 'error',
          message: message || 'Failed to fetch diagnostic data',
        });
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    setDiagnosticData([]);
  };

  const getStatusColor = (errorCode) => {
    if (!errorCode || errorCode === '0x00') return '#4caf50';
    if (errorCode.startsWith('0xE')) return '#d32f2f'; // Error
    return '#ed6c02'; // Warning
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{ p: 3, backgroundColor: '#fcfcfd' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: '10px',
                backgroundColor: alpha('#051622', 0.05),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AssessmentIcon sx={{ color: '#051622', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#101828', lineHeight: 1.2 }}>
                Diagnostic Telemetry
              </Typography>
              <Typography variant="caption" sx={{ color: '#667085', fontWeight: 500 }}>
                {deviceData?.deviceName || 'Unnamed Device'} • Serial: {deviceData?.deviceSerialNo || 'N/A'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#98a2b3' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress size={32} thickness={5} sx={{ color: '#051622' }} />
            <Typography variant="body2" sx={{ color: '#667085', fontWeight: 500 }}>
              Querying device status...
            </Typography>
          </Box>
        ) : diagnosticData.length > 0 ? (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid #eaecf0',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#f9fafb', color: '#475467', fontWeight: 600, py: 1.5 }}>
                    Error Code
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#f9fafb', color: '#475467', fontWeight: 600, py: 1.5 }}>
                    Value
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#f9fafb', color: '#475467', fontWeight: 600, py: 1.5 }}>
                    Health
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#f9fafb', color: '#475467', fontWeight: 600, py: 1.5 }}>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diagnosticData.map((item, index) => {
                  const color = getStatusColor(item.errorCode);
                  const isHealthy = !item.errorCode || item.errorCode === '0x00';

                  return (
                    <TableRow key={index} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#344054', fontFamily: 'monospace' }}>
                        {item.errorCode || '0x00'}
                      </TableCell>
                      <TableCell sx={{ color: '#475467' }}>
                        {item.value || '0'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isHealthy ? 'Healthy' : 'Alert'}
                          size="small"
                          sx={{
                            height: 24,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: alpha(color, 0.08),
                            color: color,
                            border: `1px solid ${alpha(color, 0.2)}`
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#667085', fontSize: '0.875rem' }}>
                        {item.description || 'No additional logs available'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ py: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: alpha('#4caf50', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
            >
              <AssessmentIcon sx={{ color: '#4caf50' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#101828' }}>
              Systems Ready
            </Typography>
            <Typography variant="body2" sx={{ color: '#667085', maxWidth: 300 }}>
              No diagnostic flags or errors detected for this device in the last heartbeat.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <Box sx={{ p: 2.5, px: 4, display: 'flex', justifyContent: 'flex-end', gap: 1.5, backgroundColor: '#fcfcfd' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            px: 3,
            color: '#344054',
            borderColor: '#d0d5dd',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#f9fafb', borderColor: '#d0d5dd' }
          }}
        >
          Close
        </Button>
        <Button
          onClick={fetchDiagnostics}
          variant="contained"
          startIcon={<RefreshIcon sx={{ fontSize: '18px !important' }} />}
          sx={{
            borderRadius: '8px',
            px: 3,
            backgroundColor: '#051622',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#183b52', boxShadow: 'none' }
          }}
        >
          Run Analysis
        </Button>
      </Box>

      <NotificationBar
        openNotification={notification.status}
        type={notification.type}
        notificationContent={notification.message}
        handleClose={() =>
          setNotification({ status: false, type: '', message: '' })
        }
      />
    </Dialog>
  );
}

export default DeviceStatusList;
