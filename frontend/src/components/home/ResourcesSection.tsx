import * as React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon 
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const RESOURCE_LISTS = {
  keyFeatures: [
    "Admission Strengthening",
    "Recertification Solidification",
    "Extended Stay Oversight",
    "Diagnosis & Coding Integrity",
    "Comorbidity Optimization",
    "Compliance & Audit",
    "Defense IDG Operational",
    "Escalation Prompts"
  ],
  tools: [
    "Education",
    "Operational tools",
    "Compliance protection",
    "Templates",
    "Target training",
    "Downloadable assets"
  ]
};

const ResourcesSection = () => {
  return (
    <Box id="resources">
      {/* Header Area - Soft Light Blue */}
      <Box sx={{ bgcolor: '#F4F7FF', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#090E34', mb: 2 }}>
            Empowering Your Team with Expert Resources
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Access our comprehensive suite of educational tools and operational assets designed 
            to streamline your compliance and protect your hospice operations.
          </Typography>
        </Container>
      </Box>

      {/* Content Area - Vibrant Gold */}
      <Box sx={{ bgcolor: '#F4F7FF', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} justifyContent="center">
            
            {/* Key Features List */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#090E34' }}>
                Key Features
              </Typography>
              <List sx={{ p: 0 }}>
                {RESOURCE_LISTS.keyFeatures.map((text) => (
                  <ListItem key={text} sx={{ p: 0, mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CircleIcon sx={{ fontSize: 8, color: '#090E34' }} />
                    </ListItemIcon>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {text}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Additional Assets List */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#090E34' }}>
                Operational Assets
              </Typography>
              <List sx={{ p: 0 }}>
                {RESOURCE_LISTS.tools.map((text) => (
                  <ListItem key={text} sx={{ p: 0, mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CircleIcon sx={{ fontSize: 8, color: '#090E34' }} />
                    </ListItemIcon>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {text}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default ResourcesSection