import * as React from 'react';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Button, Container, Typography, Stack, createTheme } from '@mui/material';

const HomeSection = () => {
    return (
        <Box
            sx={{
                bgcolor: '#FFFF', // The vibrant yellow/gold from your reference
                pt: { xs: 8, md: 15 },
                pb: { xs: 8, md: 15 },
                textAlign: 'center',
                //borderBottomLeftRadius: { md: '100px 20px' }, // Subtle curve for appeal
                //borderBottomRightRadius: { md: '100px 20px' },
            }}
        >
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
          Elevate Your Hospice Compliance Strategy with Predictive ADR Risk Monitoring.
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ mb: 5, mt: 3, fontWeight: 500, lineHeight: 1.6, opacity: 0.9, px: { md: 10 } }}
        >
          Integrate diagnostic hierarchy analysis, extended-stay scrutiny, and decline 
          validation into one intelligent review system designed to reduce denials and protect.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
            HIPAA-Compliant & Secure
          </Typography>
          <Typography variant="caption" display="block" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
            HospiceIQ is built with healthcare-grade security standards, including HIPAA-compliant 
            safeguards, encrypted data transmission, and strict access controls.
          </Typography>
        </Box>
      </Container>
    </Box>
    );
}

export default  HomeSection