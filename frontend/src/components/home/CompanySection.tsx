import * as React from 'react';
import { Box, Typography, Container, Grid, Link, Stack } from '@mui/material';

const COMPANY_INFO = {
  aboutUs: "We are a multidisciplinary team of hospice clinicians and operational leaders who combined decades of frontline experience to create a smarter way to manage risk, documentation, and compliance. Our platform is designed specifically for U.S. hospice organizations, translating real-world expertise into practical AI-powered solutions.",
  highlights: [
    "Purpose-built",
    "Experience-driven",
    "Designed specifically for U.S. hospice operations.",
    "Developed from decades of frontline expertise"
  ],
  contacts: ["support@hospiceIQ.com", "sales@hospiceIQ.com"]
};

const CompanySection = ()  =>{
  return (
    <Box id="company" sx={{ bgcolor: '#F4F7FF', py: 12 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          
          {/* Left Column: Labels */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={15}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>About Us</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>About HospiceIQ</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Contact Us</Typography>
            </Stack>
          </Grid>

          {/* Right Column: Descriptions */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Stack spacing={6}>
              {/* About Us Description */}
              <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>
                {COMPANY_INFO.aboutUs}
              </Typography>

              {/* Highlights Section */}
              <Box>
                {COMPANY_INFO.highlights.map((item, i) => (
                  <Typography key={i} variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500, mb: 0.5 }}>
                    “{item}”
                  </Typography>
                ))}
              </Box>

              {/* Contact Links */}
              <Stack spacing={0.5}>
                {COMPANY_INFO.contacts.map((email) => (
                  <Link 
                    key={email} 
                    href={`mailto:${email}`} 
                    sx={{ 
                      color: 'primary.main', 
                      textDecoration: 'underline', 
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  >
                    {email}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Footer Security Note */}
        <Box sx={{ mt: 15, textAlign: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
            HIPAA-Compliant & Secure
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', maxWidth: 800, mx: 'auto', opacity: 0.9 }}>
            HospiceIQ is built with healthcare-grade security standards, including HIPAA-compliant safeguards, 
            encrypted data transmission, and strict access controls to protect protected health information (PHI).
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default  CompanySection