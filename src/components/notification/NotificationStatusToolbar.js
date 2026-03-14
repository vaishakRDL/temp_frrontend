import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, MenuItem, FormControl, InputLabel, Select, Card, CardContent, Grid, Typography, InputAdornment, Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import { customerShowList, SendNotificationService } from '../../services/LoginPageService';
import NotificationBar from './ServiceNotificationBar';

export const NotificationStatusToolbar = ({ setRefreshData }) => {
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [message, setMessage] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'success',
        message: '',
    });

    useEffect(() => {
        customerShowList(
            (data) => setCustomerList(data.data),
            (err) => console.error(err)
        );
    }, []);

    const handleSend = () => {
        if (!selectedCustomer || !message) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Please select a customer and enter a message.',
            });
            return;
        }

        const payload = {
            customerId: selectedCustomer,
            message: message,
            // sentAt: new Date().toISOString(),
        };

        SendNotificationService(payload,
            (data) => {
                setNotification({
                    status: true,
                    type: 'success',
                    message: 'Notification sent successfully!',
                });
                setMessage('');
                setSelectedCustomer('');
                setRefreshData((old) => !old);
            },
            (err, msg) => {
                setNotification({
                    status: true,
                    type: 'error',
                    message: msg || 'Failed to send notification.',
                });
            }
        );
    };

    const handleCloseNotification = () => {
        setNotification({ ...openNotification, status: false });
    };

    return (
        <Box>
            <Card
                style={{
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                    color: '#fff',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
                    borderRadius: '16px',
                    overflow: 'visible',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* <Box display="flex" alignItems="center" mb={3}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <SendIcon />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                            Broadcaster
                        </Typography>
                    </Box> */}
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth variant="filled" sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                '& .MuiFilledInput-root': {
                                    color: '#fff',
                                    '&:before': { borderBottom: 'none' },
                                    '&:after': { borderBottom: '2px solid #3f51b5' }
                                }
                            }}>
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Target Customer</InputLabel>
                                <Select
                                    value={selectedCustomer}
                                    label="Target Customer"
                                    onChange={(e) => setSelectedCustomer(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                                        </InputAdornment>
                                    }
                                >
                                    {customerList.map((customer) => (
                                        <MenuItem key={customer.id} value={customer.id}>
                                            {customer.customerName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="filled"
                                label="Your Message"
                                placeholder="Type notification content here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MessageIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        color: '#fff',
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '8px',
                                        '&:before': { borderBottom: 'none' },
                                        '&:after': { borderBottom: '2px solid #3f51b5' }
                                    }
                                }}
                                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.6)' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={handleSend}
                                sx={{
                                    height: '56px',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px 0 hsla(212, 100%, 50%, 0.39)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(0, 118, 255, 0.23)',
                                    }
                                }}
                            >
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleCloseNotification}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>
    );
};
