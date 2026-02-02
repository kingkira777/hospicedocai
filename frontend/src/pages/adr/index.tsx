import { PageContainer } from "@toolpad/core"
import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, Stack, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    LinearProgress, Divider, List, ListItem, ListItemIcon, ListItemText, Checkbox, Chip,
    SelectChangeEvent, Select, MenuItem,FormControl, InputLabel
} from '@mui/material';
import { Warning, CheckCircle, Description, Person} from "@mui/icons-material";
// --- ADR Audit Document Checklist ---
const auditDocs = [
  "Election of Benefit", "Initial Certification", "Recertification",
  "F2F Encounter", "RN Initial Assessment", "Physician Notes",
  "Plan of Care", "IDG Notes", "Visit Notes", "Medication List / MAR"
];


// --- Mock Database of Patients ---
const patientsDb = {
  "P-1002": {
    name: "James Walker",
    details: "79y • M • San Bernardino, CA • SNF (Q5002)",
    diagnosis: "I50.9 (CHF)",
    risk: 74,
    status: "FAIL",
    vitals: { date: "2026-01-05", weight: "170 lbs", bp: "128/76", hr: "78", spo2: "95%" }
  },
  "P-1005": {
    name: "Sarah Jenkins",
    details: "82y • F • Riverside, CA • Home Health",
    diagnosis: "G30.9 (Alzheimer's)",
    risk: 42,
    status: "PASS",
    vitals: { date: "2026-01-20", weight: "135 lbs", bp: "118/70", hr: "72", spo2: "98%" }
  }
};

const ADRPage = () => {
    const [selectedId, setSelectedId] = useState('P-1002');
    const [checked, setChecked] = useState<string[]>(['Plan of Care', 'Visit Notes']);

    const patient = patientsDb[selectedId as keyof typeof patientsDb];

    const handlePatientChange = (event: SelectChangeEvent) => {
        setSelectedId(event.target.value);
    };

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) newChecked.push(value);
        else newChecked.splice(currentIndex, 1);
        setChecked(newChecked);
    };


    return (
        <PageContainer>

            <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
                {/* Patient Selector Header */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 250, bgcolor: 'white' }}>
                    <InputLabel id="patient-select-label">Select Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        value={selectedId}
                        label="Select Patient"
                        onChange={handlePatientChange}
                    >
                        <MenuItem value="P-1002">James Walker (P-1002)</MenuItem>
                        <MenuItem value="P-1005">Sarah Jenkins (P-1005)</MenuItem>
                    </Select>
                    </FormControl>
                    <Chip icon={<Person />} label={`ID: ${selectedId}`} variant="outlined" />
                </Box>
                <Grid container spacing={3}>
                    
                    {/* LEFT: Dashboard Content */}
                    <Grid size={{ xs: 12, md: 9 }}>
                    <Stack spacing={3}>
                        
                        {/* Patient & Risk Summary */}
                        <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" fontWeight="bold">James Walker <Typography component="span" color="text.secondary" variant="h6">(P-1002)</Typography></Typography>
                                <Typography variant="body2" color="text.secondary">79y • M • San Bernardino, CA • SNF (Q5002)</Typography>
                                
                                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, flex: 1 }}>
                                    <Typography variant="caption" fontWeight="bold">Diagnosis</Typography>
                                    <Typography variant="body2" color="primary" fontWeight="bold">I50.9 (CHF)</Typography>
                                </Box>
                                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, flex: 1 }}>
                                    <Typography variant="caption" fontWeight="bold">Eligibility</Typography>
                                    <Typography variant="body2" color="error" fontWeight="bold">FAIL</Typography>
                                </Box>
                                </Stack>

                                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                <Button variant="contained" size="small">Export ADR Packet</Button>
                                <Button variant="outlined" size="small">Generate Table</Button>
                                </Stack>
                            </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#fff' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight="bold">ADR Risk Score</Typography>
                                <Typography variant="h4" fontWeight="bold">74</Typography>
                                </Stack>
                                <Chip icon={<Warning />} label="CRITICAL" color="error" size="small" sx={{ mb: 2 }} />
                                <LinearProgress variant="determinate" value={74} color="error" sx={{ height: 8, borderRadius: 5, mb: 2 }} />
                                
                                <Grid container spacing={1}>
                                {['Medical Necessity', 'Governance', 'Fraud/Misrep'].map((item) => (
                                    <Grid size={{ xs:4}} key={item}>
                                    <Typography variant="caption" display="block" color="text.secondary">{item}</Typography>
                                    <Typography variant="body2" fontWeight="bold">High</Typography>
                                    </Grid>
                                ))}
                                </Grid>
                            </CardContent>
                            </Card>
                        </Grid>
                        </Grid>

                        {/* Evidence Table */}
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                            <Typography variant="subtitle1" fontWeight="bold">Benefit Period Evidence</Typography>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                            <TableHead sx={{ bgcolor: '#fcfcfc' }}>
                                <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Weight</TableCell>
                                <TableCell>BP / HR</TableCell>
                                <TableCell>SpO2</TableCell>
                                <TableCell>Pain</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                <TableCell>2026-01-05</TableCell>
                                <TableCell>170 lbs</TableCell>
                                <TableCell>128/76 | 78</TableCell>
                                <TableCell>95%</TableCell>
                                <TableCell>2</TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                        </Card>

                    </Stack>
                    </Grid>

                    {/* RIGHT: Document Checklist Sidebar */}
                    <Grid size={{ xs: 12, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2, position: 'sticky', top: 20 }}>
                        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Audit Document Checklist</Typography>
                        </Box>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {auditDocs.map((value) => (
                            <ListItem key={value} disablePadding>
                            <ListItemIcon sx={{ minWidth: 40, pl: 2 }}>
                                <Checkbox
                                edge="start"
                                checked={checked.indexOf(value) !== -1}
                                tabIndex={-1}
                                disableRipple
                                onClick={handleToggle(value)}
                                />
                            </ListItemIcon>
                            <ListItemText 
                                primary={value} 
                                primaryTypographyProps={{ variant: 'body2', fontWeight: checked.includes(value) ? 'bold' : 'normal' }} 
                            />
                            {checked.includes(value) && <CheckCircle color="success" sx={{ fontSize: 16, mr: 2 }} />}
                            </ListItem>
                        ))}
                        </List>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                        <Button fullWidth variant="contained" startIcon={<Description />}>
                            Upload Missing
                        </Button>
                        </Box>
                    </Card>
                    </Grid>

                </Grid>
                </Box>
        </PageContainer>
    )
}

export default ADRPage;