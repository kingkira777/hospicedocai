import { PageContainer } from "@toolpad/core";
import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Autocomplete, TextField,
  Chip, Stack, styled, Divider
} from '@mui/material';
import {
    Info, Warning
} from '@mui/icons-material';

import DocumentChecklist from "../../components/cases/DocumentChecklist";
import ChatBox from "../../components/cases/ChatBox";
import api from "../../utils/axios";
import { useSession } from "../../SessionContext";
import MedicalAnalysisApp from "../../components/cases/DocumentAnalysis";

const SidebarCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
}));



const CasesPage = () => {
    const { session } = useSession();
    const [selectedPatient, setSelectedPatient] = useState(null as any);
    const [patientList, setPatientList] = useState([]);
    const [documents, setDocuments] = useState([] as any[]);


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

    const FetchFileByPatient = async () => {
        try {
            const { data } = await api.get(`/file/by-patient/${selectedPatient.id}`);
            console.log("Fetched file by patient:", data);
            setDocuments(data);
        } catch (error) {
            console.error("Error in FetchFileByPatient:", error);
        }
    };
    
    useEffect(() => {
        if(selectedPatient){
            FetchFileByPatient();
        }
    }, [selectedPatient]);

    useEffect(() => {
        FetchPatientSelectList();
    }, []);



    return (
        <PageContainer>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 5 }}>
                {/* 1. Top Navigation Bar */}
                <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', px: 3, py: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Autocomplete
                            options={patientList}
                            getOptionLabel={(option) => `${option?.name} (${option?.id})`}
                            value={selectedPatient}
                            onChange={(_, newValue) => newValue && setSelectedPatient(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Switch Patient" size="small" variant="standard" />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }} textAlign="right">
                        {/* <Typography variant="overline" color="text.secondary">ELIGIBILITY SUPPORT</Typography>
                        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                            <Typography variant="h2" fontWeight="bold" sx={{ mr: 2 }}>74</Typography>
                            <Chip label="Moderate Risk" color="warning" variant="outlined" sx={{ fontWeight: 'bold' }} />
                        </Box> */}
                    </Grid>
                    </Grid>
                </Box>

                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    {/* 3. Main Content Grid */}
                    <Grid container spacing={3}>
                        {/* Left Column: Documentation Checklist */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <DocumentChecklist documents={documents} />
                        </Grid>

                        {/* Right Column: AI Risk Insights */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <ChatBox patientId={selectedPatient?.id} />
                            {/* <SidebarCard sx={{ border: '2px solid #e3f2fd' }}>
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
                            </SidebarCard> */}
                        </Grid>
                    </Grid>
                </Container>
                </Box>
                
                      <Divider />
                      <MedicalAnalysisApp />
        </PageContainer>
    );
};

export default CasesPage;