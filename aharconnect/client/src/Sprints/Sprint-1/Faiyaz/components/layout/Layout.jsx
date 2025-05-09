import React from 'react';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
