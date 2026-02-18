import { 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Stack, 
  MenuItem, 
  Paper 
} from '@mui/material';

const RequestDemoSection = () => {
  return (
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="flex-start">
          
          {/* Left Side: Overview Text */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1 }}>
              Overview
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                bgcolor: '#FFB800', 
                display: 'inline-block', 
                px: 1, 
                mb: 4 
              }}
            >
              Get a Demo
            </Typography>
            
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 3 }}>
              Experience HospiceIQ transforms hospice compliance from reactive denial 
              management to proactive defensibility intelligence.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              Discover how hospice organizations reduce audit risk, prevent escalation, 
              and protect Medicare revenue before documentation is submitted.
            </Typography>
          </Grid>

          {/* Right Side: Request Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                bgcolor: '#8E44AD', // Deep purple from the reference image
                color: 'white', 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4 
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                Request a demonstration
              </Typography>
              
              <Stack spacing={2}>
                <TextField 
                  fullWidth 
                  label="Work email *" 
                  variant="filled" 
                  sx={{ bgcolor: 'white', borderRadius: 1 }} 
                />
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField fullWidth label="First name *" variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                  <TextField fullWidth label="Last name *" variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField fullWidth label="Company *" variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                  <TextField fullWidth label="Job title *" variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField fullWidth label="Phone number *" variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                  <TextField fullWidth select label="Country *" variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }}>
                    <MenuItem value="US">United States</MenuItem>
                  </TextField>
                </Stack>

                <TextField fullWidth select label="What are you interested in?" variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }}>
                  <MenuItem value="compliance">Compliance Monitoring</MenuItem>
                  <MenuItem value="audit">Audit Defense</MenuItem>
                </TextField>

                <TextField 
                  fullWidth 
                  multiline 
                  rows={2} 
                  label="What's on your mind?" 
                  variant="filled" 
                  sx={{ bgcolor: 'white', borderRadius: 1 }} 
                />

                <Typography variant="caption" sx={{ opacity: 0.8, mt: 2 }}>
                  By submitting this form, you are agreeing that HospiceIQ may store and process your 
                  personal data described in the Privacy Policy.
                </Typography>

                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#8E44AD', 
                    fontWeight: 800,
                    '&:hover': { bgcolor: '#f0f0f0' }
                  }}
                >
                  Submit Request
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
  );
}
export default RequestDemoSection