import { PageContainer } from "@toolpad/core";
import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Divider, 
  List, ListItem, ListItemIcon, ListItemText, Chip, Stack, TextField, Autocomplete,
  Card, CardHeader, Avatar, Accordion, AccordionSummary, AccordionDetails, Skeleton
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Analytics, Assignment, PersonSearch, ExpandMore} from "@mui/icons-material";
import api from "../../utils/axios";
import { useSession } from "../../SessionContext";

export interface PatientAnalysis {
  id: string;
  name: string;
  socDate: string;
  fileNo: string;
  // ... rest of the fields from the previous result schema
}

export interface DiagnosisResult {
  patientInfo: {
    name: string;
    socDate: string;
    fileNo: string;
  };
  admission: {
    diagnosis: string;
    secondary: string;
    comorbidities: string;
  };
  recertification: {
    diagnosis: string;
    secondary: string;
    comorbidities: string;
  };
  findings: string[];
  recommendations: string[];
  losRisk: {
    days: string;
    findings: string[];
  };
}


// Sample data representing your AI results database
const PATIENT_DATABASE: PatientAnalysis[] = [
  { id: '1', name: "John Doe", socDate: "2023-10-12", fileNo: "ADR-9921", /* ... data */ },
  { id: '2', name: "Jane Smith", socDate: "2024-01-05", fileNo: "ADR-4432", /* ... data */ },
];

// Example Data (This would come from your AI Assistant Result)
const mockResult: DiagnosisResult = {
  patientInfo: { name: "John Doe", socDate: "2023-10-12", fileNo: "ADR-9921" },
  admission: { 
    diagnosis: "Congestive Heart Failure", 
    secondary: "Hypertension", 
    comorbidities: "Type 2 Diabetes" 
  },
  recertification: { 
    diagnosis: "End-stage Renal Disease", 
    secondary: "CHF", 
    comorbidities: "Peripheral Neuropathy" 
  },
  findings: ["Significant decline in cardiac output", "Weight increase of 5lbs in 48 hours"],
  recommendations: ["Adjust diuretics", "Update POC for frequent monitoring"],
  losRisk: { days: "180 Days", findings: ["History of frequent hospitalizations"] }
};

// Assuming this data is returned from your AI Assistant logic
const PATIENT_DATA_STORE: any[] = [
  {
    id: '1',
    name: "John Doe",
    socDate: "2023-10-12",
    fileNo: "ADR-9921",
    admission: { diagnosis: "CHF", secondary: "HTN", comorbidities: "Diabetes" },
    recertification: { diagnosis: "End-stage Renal", secondary: "CHF", comorbidities: "Neuropathy" },
    findings: ["Decline in cardiac output", "Weight increase observed"],
    recommendations: ["Adjust diuretics", "Increase monitoring"],
    losRisk: { days: "180 Days", findings: ["Frequent hospitalizations"] }
  },
  {
    id: '2',
    name: "John Smith",
    socDate: "2024-10-12",
    fileNo: "ADR-9922",
    admission: { diagnosis: "CHF", secondary: "HTN", comorbidities: "Diabetes" },
    recertification: { diagnosis: "End-stage Renal", secondary: "CHF", comorbidities: "Neuropathy" },
    findings: ["Decline in cardiac output", "Weight increase observed"],
    recommendations: ["Adjust diuretics", "Increase monitoring"],
    losRisk: { days: "180 Days", findings: ["Frequent hospitalizations"] }
  },
  // Add more mock data as needed...
];

const RiskAnalysisApp = () => {
    const { session  } = useSession();
    const [selectedPatients, setSelectedPatients]:any = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [patientList, setPatientList] = useState([]);

    
    const FetchPatientSelectList = async () => {
        try {
            const { data } = await api.get(`/patient/list-select?companyId=${session?.user?.companyId}`);
            console.log("Fetched patient select list:", data);
            const formData:any = [];
            for(const patient of data){
                const xData = {
                    id: patient.id,
                    name: patient.firstName + ' ' + patient.lastName,
                    gender : patient.gender,
                    dateOfBirth: patient.dateOfBirth,
                    startOfCare: patient.startOfCare,
                };
                formData.push(xData);
            }
            setPatientList(formData);
        } catch (error) {
            console.error("Error in FetchPatientSelectList:", error);
        }
    };

    useEffect(() => {
        FetchPatientSelectList();
    }, []);

    const handleSelectionChange = async (event: any, newValue: any) => {
        try {
            if(newValue.id === undefined) return;
            setIsLoading(true);
            const { data } = await api.post(`/analysis/denial-risk/${newValue.id}`);   
            console.log("Fetched patient analysis data:", data);
            setSelectedPatients(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error in handleSelectionChange:", error);
            setIsLoading(false);
        }
    };


    return (
        <PageContainer title="">
           <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: 'auto', width: '100%' }}>
      
            {/* SELECTION BAR */}
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 2, width: '100%' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <PersonSearch color="primary" sx={{ display: { xs: 'none', md: 'block' } }} />
                <Autocomplete
                    fullWidth
                    options={patientList}
                    getOptionLabel={(option:any) => option.name}
                    onChange={handleSelectionChange}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" label="Select Patients for Review" placeholder="Start typing name..." />
                    )}
                    renderTags={(tagValue) =>
                    tagValue.map((option, index) => (
                        <Chip label={option.name} size="small" color="primary" key={index} />
                    ))
                    }
                />
                </Stack>
            </Paper>

            {/* LOADING STATE - Skeleton UI mirroring your template */}
            {isLoading && (
                <Paper variant="outlined" sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ width: '30%' }}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '60%' }} />
                    </Box>
                </Stack>
                <Grid container spacing={3}>
                    <Grid size={{xs: 6}}><Skeleton variant="rectangular" height={100} /></Grid>
                    <Grid size={{xs: 6}}><Skeleton variant="rectangular" height={100} /></Grid>
                    <Grid size={{xs: 12}}><Skeleton variant="rectangular" height={150} /></Grid>
                    <Grid size={{xs: 12}}><Skeleton variant="rectangular" height={80} /></Grid>
                </Grid>
                </Paper>
            )}

            {/* RESULTS LIST */}
            {!isLoading && selectedPatients &&(
                <Accordion key={0} defaultExpanded sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, border: '1px solid #e0e0e0' }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, fontSize: '0.9rem' }}>{selectedPatients.patientInfo.name}</Avatar>
                        <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{selectedPatients.patientInfo.name}</Typography>
                        <Typography variant="caption" color="text.secondary">File: {selectedPatients.patientInfo.fileName} | Visit Date: {selectedPatients.patientInfo.visitDate}</Typography>
                        </Box>
                    </Stack>
                    </AccordionSummary>
                    
                    <AccordionDetails sx={{ borderTop: '1px solid #f0f0f0', pt: 3 }}>
                    <Grid container spacing={3}>
                        
                        {/* 1. Comparison Section */}
                        <Grid size={{xs: 12, md: 6}} >
                        <Typography variant="overline" color="text.secondary">Admission Summary</Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                            <Typography variant="body2"><strong>Diagnosis:</strong> {selectedPatients.admission.diagnosis}</Typography>
                            <Typography variant="body2"><strong>Secondary:</strong> {selectedPatients.admission.secondary}</Typography>
                            <Typography variant="body2"><strong>Comorbidities:</strong> {selectedPatients.admission.comorbidities}</Typography>
                        </Paper>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}} >
                        <Typography variant="overline" color="text.secondary">Recertification Summary</Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                            <Typography variant="body2"><strong>Diagnosis:</strong> {selectedPatients.recertification.diagnosis}</Typography>
                            <Typography variant="body2"><strong>Secondary:</strong> {selectedPatients.recertification.secondary}</Typography>
                            <Typography variant="body2"><strong>Comorbidities:</strong> {selectedPatients.recertification.comorbidities}</Typography>
                        </Paper>
                        </Grid>

                        {/* 2. Actionable Findings & Recommendations */}
                        <Grid size={{xs: 12, md: 6}} >
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <WarningAmberIcon sx={{ fontSize: 18, mr: 1, color: 'orange' }} /> Clinical Findings
                        </Typography>
                        <List dense sx={{ bgcolor: '#fff9f0', borderRadius: 1 }}>
                            {selectedPatients.findings.map((f: string, i: number) => (
                            <ListItem key={i}><ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={`• ${f}`} /></ListItem>
                            ))}
                        </List>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}} >
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <AssignmentTurnedInIcon sx={{ fontSize: 18, mr: 1, color: 'green' }} /> Recommendations
                        </Typography>
                        <List dense sx={{ bgcolor: '#f0f9f0', borderRadius: 1 }}>
                            {selectedPatients.recommendations.map((r: string, i: number) => (
                            <ListItem key={i}><ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={`• ${r}`} /></ListItem>
                            ))}
                        </List>
                        </Grid>

                        {/* 3. LOS Risk Section */}
                        <Grid size={{xs: 12}} >
                        <Paper sx={{ p: 2, bgcolor: '#fff5f5', borderLeft: '5px solid #d32f2f' }}>
                            <Typography variant="subtitle2" color="#d32f2f" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocalHospitalIcon sx={{ mr: 1, fontSize: 18 }} /> LOS RISK STRATIFICATION
                            </Typography>
                            <Typography variant="body2"><strong>Risk:</strong> {selectedPatients.losRisk.days}</Typography>
                            <Typography variant="caption" color="text.secondary">{selectedPatients.losRisk.findings.join(', ')}</Typography>
                        </Paper>
                        </Grid>

                    </Grid>
                    </AccordionDetails>
                </Accordion>
                )}
            </Box>
        </PageContainer>
    );
}

export default RiskAnalysisApp  

