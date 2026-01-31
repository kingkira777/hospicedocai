import { PageContainer } from "@toolpad/core";
import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Button, Autocomplete, TextField,
  Chip, LinearProgress, Stack, styled, Divider, Avatar
} from '@mui/material';
import {
  CheckCircle, Error, Info, Warning, Add, UploadFile, AutoAwesome, 
  CalendarMonth, LocalHospital, Badge
} from '@mui/icons-material';

// --- Styled Components ---
const SidebarCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
}));

const StatusDot = styled(Box)<{ color: string }>(({ color }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  display: 'inline-block',
  marginRight: 8,
}));

// --- Mock Data ---
const patients = [
  { id: 'HF-19788', name: 'Martinez L.', diagnosis: 'COPD with Chronic Respiratory Failure', dateRange: '09/01/25 – 11/30/25', mac: 'NGS', bp: 'BP 2' },
  { id: 'HF-20455', name: 'Smith J.', diagnosis: 'Congestive Heart Failure', dateRange: '10/01/25 – 12/31/25', mac: 'CGS', bp: 'BP 1' },
];

const CasesPage = () => {
    const [selectedPatient, setSelectedPatient] = useState(patients[0]);
    return (
        <PageContainer>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 5 }}>
                {/* 1. Top Navigation Bar */}
                <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', px: 3, py: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Autocomplete
                        options={patients}
                        getOptionLabel={(option) => `${option.name} (${option.id})`}
                        value={selectedPatient}
                        onChange={(_, newValue) => newValue && setSelectedPatient(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Switch Patient" size="small" variant="standard" />
                        )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }} textAlign="right">
                        <Stack direction="row" spacing={2}>
                        <Button startIcon={<UploadFile />} variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            Upload Packet
                        </Button>
                        <Button startIcon={<Add />} variant="contained" color="primary" sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            New ADR Case
                        </Button>
                        </Stack>
                    </Grid>
                    </Grid>
                </Box>

                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    {/* 2. Header & AI Score Section */}
                    <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">CASE DETAIL & AI REVIEW</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Eligibility support score, missing elements, weak documentation, and tasks.
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Typography variant="h4" fontWeight="bold">{selectedPatient.name}</Typography>
                        <Chip label={selectedPatient.id} size="small" variant="outlined" />
                        <Chip 
                            icon={<AutoAwesome sx={{ fontSize: '1rem !important' }} />} 
                            label="AI Suggestions Enabled" 
                            color="primary" 
                            variant="outlined" 
                            sx={{ ml: 'auto', borderRadius: '12px' }} 
                        />
                        </Stack>
                        <Stack direction="row" spacing={3} color="text.secondary">
                        <Stack direction="row" spacing={0.5} alignItems="center"><LocalHospital fontSize="small" /> <Typography variant="caption">{selectedPatient.diagnosis}</Typography></Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center"><CalendarMonth fontSize="small" /> <Typography variant="caption">{selectedPatient.dateRange}</Typography></Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center"><Badge fontSize="small" /> <Typography variant="caption">MAC: {selectedPatient.mac}</Typography></Stack>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }} textAlign="right">
                        <Typography variant="overline" color="text.secondary">ELIGIBILITY SUPPORT</Typography>
                        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography variant="h2" fontWeight="bold" sx={{ mr: 2 }}>74</Typography>
                        <Chip label="Moderate Risk" color="warning" variant="outlined" sx={{ fontWeight: 'bold' }} />
                        </Box>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>Documentation tasks complete: 79%</Typography>
                        <LinearProgress variant="determinate" value={79} sx={{ height: 8, borderRadius: 5, mt: 1, bgcolor: '#e0e0e0' }} />
                    </Grid>
                    </Grid>

                    {/* 3. Main Content Grid */}
                    <Grid container spacing={3}>
                    {/* Left Column: Documentation Checklist */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <SidebarCard>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold">DOCUMENTATION CHECKLIST</Typography>
                            <Chip label="DOCS NEED WORK" color="error" variant="outlined" size="small" sx={{ color: 'red', borderColor: 'red' }} />
                        </Stack>
                        
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Complete (3)</Typography>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            {['Election of Benefit', 'Initial & BP2 Certification', 'F2F visit documentation'].map(item => (
                            <Stack key={item} direction="row" spacing={1} alignItems="center">
                                <CheckCircle color="success" sx={{ fontSize: 18 }} />
                                <Typography variant="body2">{item}</Typography>
                            </Stack>
                            ))}
                        </Stack>

                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Weak / Non-specific (2)</Typography>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1}>
                            <StatusDot color="orange" />
                            <Typography variant="body2">Limited detail on prior hospitalizations vs hospice choice</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                            <StatusDot color="orange" />
                            <Typography variant="body2">Few examples of dyspnea at rest</Typography>
                            </Stack>
                        </Stack>

                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Missing (1)</Typography>
                        <Stack direction="row" spacing={1}>
                            <StatusDot color="red" />
                            <Typography variant="body2">Objective O2 saturation trend over last 90 days</Typography>
                        </Stack>

                        <Divider sx={{ my: 3 }} />
                        <Typography variant="caption" color="text.secondary">
                            This checklist is built from hospice LCD-style rules: required forms, timing, and key clinical elements for the diagnosis.
                        </Typography>
                        </SidebarCard>
                    </Grid>

                    {/* Right Column: AI Risk Insights */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <SidebarCard sx={{ border: '2px solid #e3f2fd' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold">AI RISK INSIGHTS & TASKS</Typography>
                            <Chip label="ADVISORY ONLY" variant="outlined" size="small" sx={{ color: 'orange', borderColor: 'orange' }} />
                        </Stack>

                        <Stack spacing={3}>
                            <Box>
                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                <Info color="primary" />
                                <Box>
                                <Typography variant="body2" fontWeight="bold">Strong F2F, moderate narrative.</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    The F2F note is specific, but the recert narrative could better emphasize how COPD severity affects function & prognosis.
                                </Typography>
                                </Box>
                            </Stack>
                            </Box>

                            <Box>
                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                <Warning sx={{ color: '#ff9800' }} />
                                <Box>
                                <Typography variant="body2" fontWeight="bold">No O2 / ABG trend documented.</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Add O2 requirements and (if available) ABGs to strengthen evidence of chronic respiratory failure.
                                </Typography>
                                </Box>
                            </Stack>
                            </Box>
                        </Stack>

                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>Tasks to Strengthen the Case</Typography>
                        <Stack spacing={2}>
                            {[
                            { role: 'RN Case Manager', task: 'RN: Add summary of O2 use, exacerbations, and ED visits' },
                            { role: 'Medical Director', task: 'MD: Refine recert narrative to highlight increasing O2 requirement' }
                            ].map((item, idx) => (
                            <Box key={idx} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '8px' }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>{item.task}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label={item.role} size="small" variant="outlined" />
                                <Chip label="Pending" size="small" sx={{ bgcolor: '#fff3e0', color: '#ef6c00' }} />
                                </Stack>
                            </Box>
                            ))}
                        </Stack>
                        </SidebarCard>
                    </Grid>
                    </Grid>
                </Container>
                </Box>
        </PageContainer>
    );
};

export default CasesPage;