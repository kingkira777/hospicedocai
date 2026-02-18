import * as React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Paper, 
  Avatar, 
  Container 
} from '@mui/material';
// Icons matching your categories
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LanguageIcon from '@mui/icons-material/Language';
import PieChartIcon from '@mui/icons-material/PieChart';
import StorageIcon from '@mui/icons-material/Storage';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PaidIcon from '@mui/icons-material/Paid';
import SearchIcon from '@mui/icons-material/Search';

const SOLUTIONS_DATA = [
  { title: 'Admission Strengthening', desc: 'Streamline patient intake with intelligent validation and eligibility checks.', icon: <SecurityIcon /> },
  { title: 'Recertification Solidification', desc: 'Automate documentation to support extended care and eligibility claims.', icon: <AssignmentIcon /> },
  { title: 'Extended Stay Oversight', desc: 'Automate documentation long for extended term length and review.', icon: <LanguageIcon /> },
  { title: 'Diagnosis & Coding Integrity', desc: 'Ensure accurate ICD-10 coding and more.', icon: <PsychologyIcon /> },
  { title: 'Secure Storage', desc: 'Highly secure environment for accessibility and privacy.', icon: <StorageIcon /> },
  { title: 'Low Cost', desc: 'Identify savings and optimize for regular monitoring.', icon: <PaidIcon /> },
  { title: 'Compliance & Audit Defense', desc: 'Prepare for IDG coverage with daily safeguards.', icon: <SearchIcon /> },
  { title: 'Strategic Analysis', desc: 'Text for the final solution block as seen in the grid.', icon: <PieChartIcon /> },
];

const  SolutionsSection = () => {
  return (
    <Box sx={{ bgcolor: '#F4F7FF', py: 20 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#090E34', mb: 2 }}>
            Our Solutions for Hospice Compliance
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Integrate diagnostic hierarchy analysis, structured data, and decline validation into one 
            intelligent review system to reduce denials and protect health information (PHI).
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {SOLUTIONS_DATA.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#4480FF',
                    width: 56,
                    height: 56,
                    mb: 3,
                    fontSize: 28,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1.1rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default SolutionsSection