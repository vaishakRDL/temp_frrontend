import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { roleCustomerList } from '../../services/LoginPageService';

export function DeviceStatusListToolbar({ onCustomerChange, setRefreshData, onSearchChange }) {
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    roleCustomerList(
      (res) => {
        setCustomerList(res.data || []);
      },
      () => { }
    );
  }, []);

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setSelectedCustomer(value);
    onCustomerChange(value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleRefresh = () => {
    setRefreshData(prev => !prev);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#051622', mr: 2 }}>
            Device Status
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', borderLeft: '2px solid #e0e0e0', pl: 2 }}>
            Monitor and manage telemetry from your deployed devices
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} sx={{ color: '#051622' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by Serial No or IP..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: { backgroundColor: 'white' }
            }}
            sx={{ maxWidth: 400 }}
          />
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <TextField
              select
              size="small"
              label="Customer"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              sx={{ minWidth: 200, backgroundColor: 'white' }}
            >
              <MenuItem value="all">All Customers</MenuItem>
              {customerList.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.customerName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
