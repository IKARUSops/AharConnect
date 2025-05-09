import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Stack, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              AharConnect
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connecting food lovers with the best restaurants and event spaces in town. Experience the perfect blend of dining and celebration.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/restaurants" color="inherit" underline="hover">
                Restaurants
              </Link>
              <Link component={RouterLink} to="/event-spaces" color="inherit" underline="hover">
                Event Spaces
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                About Us
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                Contact
              </Link>
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Support
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/faq" color="inherit" underline="hover">
                FAQ
              </Link>
              <Link component={RouterLink} to="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link component={RouterLink} to="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
              <Link component={RouterLink} to="/help" color="inherit" underline="hover">
                Help Center
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  123 Food Street, Culinary District, NY 10001
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  support@aharconnect.com
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} AharConnect. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link component={RouterLink} to="/privacy" color="inherit" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link component={RouterLink} to="/terms" color="inherit" underline="hover" variant="body2">
              Terms of Service
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 