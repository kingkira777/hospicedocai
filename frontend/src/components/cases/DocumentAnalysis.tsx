import React, { useState } from 'react';
import { 
  Container, Grid, Paper, Typography, MenuItem, 
  FormControl, InputLabel, Select, Box, Divider, Chip, CircularProgress 
} from '@mui/material';

export interface Patient {
  id: string;
  name: string;
  dob: string;
}

export interface RNNote {
  id: string;
  date: string;
  content: string;
  author: string;
}

export interface AnalysisResult {
  summary: string;
  keyInsights: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

const MedicalAnalysisApp: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Mock data - in a real app, these would come from an API
  const patients: Patient[] = [{ id: '1', name: 'John Doe', dob: '1985-05-12' }];
  const notes: RNNote[] = [{ id: 'n1', date: '2026-02-09', content: 'Patient reports mild chest pain...', author: 'Sarah Smith, RN' }];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Medical Notes Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Selection Panel */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Patient</InputLabel>
              <Select
                value={selectedPatient}
                label="Select Patient"
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                {patients.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!selectedPatient}>
              <InputLabel>Select RN Note</InputLabel>
              <Select
                value={selectedNote}
                label="Select RN Note"
                onChange={(e) => setSelectedNote(e.target.value)}
              >
                {notes.map(n => <MenuItem key={n.id} value={n.id}>{n.date} - {n.author}</MenuItem>)}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Output Panel */}
        <Grid size={{xs: 12, md: 8}}>
          <Paper sx={{ p: 3, minHeight: '400px' }}>
            <Typography variant="h6" gutterBottom>Analysis Output</Typography>
            <Divider sx={{ mb: 2 }} />

            {!selectedNote ? (
              <Box sx={{ textAlign: 'center', mt: 10, color: 'text.secondary' }}>
                <Typography>Please select a patient and a specific note to begin analysis.</Typography>
              </Box>
            ) : (
              <Box>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="Risk Level: High" color="error" variant="outlined" />
                  <Typography variant="caption" color="text.secondary">Analyzed via Med-AI v2.1</Typography>
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold">Summary</Typography>
                <Typography variant="body2" paragraph>
                  The patient is exhibiting symptoms consistent with acute distress. Key indicators suggest immediate follow-up on cardiovascular stability.
                </Typography>

                <Typography variant="subtitle1" fontWeight="bold">Key Insights</Typography>
                <ul>
                  <li><Typography variant="body2">Persistent hypertension noted in last 3 readings.</Typography></li>
                  <li><Typography variant="body2">Sensitivity to prescribed analgesic reported.</Typography></li>
                </ul>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MedicalAnalysisApp;