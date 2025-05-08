import React from 'react';
import { Box, Stack, Typography, Card, Grid } from '@mui/material';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import CustomNavbar from '../../common-components/CustomNavbar';

export default function Dashboard(props) {
  return (
    <AppTheme {...props}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomNavbar />
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome to your restaurant management dashboard
                </Typography>
              </Card>
            </Grid>
            
            {/* Summary Cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6">Total Orders</Typography>
                <Typography variant="h4">0</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6">Today's Revenue</Typography>
                <Typography variant="h4">$0</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6">Active Menu Items</Typography>
                <Typography variant="h4">0</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AppTheme>
  );
}