import { PageContainer } from "@toolpad/core"
import React, { useEffect, useState } from 'react';
import { 
    Box, Typography, Grid, Card, CardContent, Button, Stack, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    LinearProgress, Chip, SelectChangeEvent, Select, MenuItem,FormControl, 
    InputLabel, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Warning, Person, ExpandMore, Assistant} from "@mui/icons-material";
import DocumentListSidebar from "../../components/adr/DocumentListSidebar";
import { useSession } from "../../SessionContext";
import api from "../../utils/axios";
import { ShowAlert } from '../../utils/sweetAlert';
import { REQUIRED_DOCUMENTS } from "../../constant/documents";

const ADRPage = () => {
    const { session } = useSession();
    const [selectedId, setSelectedId] = useState('0');
    const [patientList, setPatientList]:any = useState([]);
    const [analysisData, setAnalysisData]:any = useState({});
    const [patientFiles, setPatientFiles]:any = useState([]);
    const [requiredFiles, setRequiredFiles]:any = useState(0);
    const [loading, setLoading] = useState(false);


    const FetchPatientAnalysisData = async () => {
        try {
            if(selectedId === '0') {
                ShowAlert({ title: 'Patient Not Selected', text: 'Please select a patient', icon: 'warning', isToast: true });
                return
            };
            setLoading(true);
            const { data } = await api.post(`/analysis/adr-analyze/${selectedId}`, {
                userId: session?.user?.id
            });
            console.log("Fetched patient analysis data:", data);
            setAnalysisData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error in FetchPatientAnalysisData:", error);
        }
    };

    const FetchSavedAdrData = async () => {
        try {
            if(selectedId === '0') return;
            const { data } = await api.post(`/analysis/adr-data/${selectedId}`);
            console.log("Fetched saved ADR data:", data);
            if(data === null || data === 'null') return;
            setAnalysisData(data);
        } catch (error) {
            console.error("Error in FetchSavedAdrData:", error);
        }
    };

    const FetchFilesByPatient = async () => {
        try {
            const { data } = await api.post(`/file/by-patient/${selectedId}`);
            console.log("Fetched file by patient:", data);
            const files = data.map((file: any) => file.category);
            const filteredFiles = files.filter((file: any) => REQUIRED_DOCUMENTS.includes(file));
            setRequiredFiles(filteredFiles.length);
            setPatientFiles(files);
        } catch (error) {
            console.error("Error in FetchFileByPatient:", error);
        }
    };


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

    useEffect(() => {
        FetchFilesByPatient();
        FetchSavedAdrData();
    }, [selectedId]);


    const handlePatientChange = (event: SelectChangeEvent) => {
        setSelectedId(event.target.value);
    };


    return (
        <PageContainer title={''}>

            <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
                {/* Patient Selector Header */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 250, bgcolor: 'white' }}>
                    <InputLabel id="patient-select-label">Select Patient</InputLabel>
                    <Select 
                        sx={{ backgroundColor: 'background.default' }}
                        labelId="patient-select-label"
                        value={selectedId}
                        label="Select Patient"
                        onChange={handlePatientChange}
                    >
                        {
                            patientList.map((patient: any) => (
                                <MenuItem key={patient?.id} value={patient?.id}>{patient?.name} ({patient?.id})</MenuItem>
                            ))
                        }
                    </Select>
                    </FormControl>
                    <Chip icon={<Person />} label={`ID: ${selectedId}`} variant="outlined" />
                    <Button 
                        loading={loading}
                        loadingPosition="start"
                        onClick={FetchPatientAnalysisData} 
                        variant="outlined" 
                        size="small"
                        // disabled={requiredFiles < 7} 
                        startIcon={<Assistant />}>{(requiredFiles < 7 ? 'Incomplete Required Documents' : 'Generate AI Assistant')}
                    </Button>
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
                                    <Typography variant="h5" fontWeight="bold">
                                        {patientList.filter((x: any) => x.id === selectedId)[0]?.name}
                                        <Typography component="span" color="text.secondary" variant="h6">({patientList.filter((x: any) => x.id === selectedId)[0]?.id})</Typography>
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {analysisData.patient_details?.age}y • {analysisData.patient_details?.address}
                                    </Typography>
                                    
                                    <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
                                        <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, flex: 1 }}>
                                            <Typography variant="caption" fontWeight="bold">Diagnosis</Typography>
                                            <Typography variant="body2" color="primary" fontWeight="bold">
                                                {analysisData.patient_details?.diagnosis}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, flex: 1 }}>
                                            <Typography variant="caption" fontWeight="bold">Eligibility</Typography>
                                            <Typography variant="body2" color={analysisData.patient_details?.eligibility === 'Yes' ? 'success' : 'error'} fontWeight="bold">
                                                {analysisData.patient_details?.eligibility}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                        <Button variant="contained" size="small">Export ADR Packet</Button>
                                        <Button variant="outlined" size="small">Generate Table</Button>
                                    </Stack> */}
                                </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'Background.default' }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle2" fontWeight="bold">ADR Risk Score</Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {analysisData.overall_score}
                                        </Typography>
                                    </Stack>
                                    <Chip icon={<Warning />} 
                                        label={(analysisData.overall_score > 50) ? "High Risk" : "Low Risk"} 
                                        color={(analysisData.overall_score > 50) ? "error" : "success"} 
                                        size="small" 
                                        sx={{ mb: 2 }} />
                                    <LinearProgress variant="determinate" 
                                        value={analysisData.overall_score | 0} 
                                        color={(analysisData.overall_score > 50) ? "error" : "success"  } 
                                        sx={{ height: 8, borderRadius: 5, mb: 2 }} />
                                    
                                    <Grid container spacing={1}>
                                        {
                                            <Grid size={{ xs:4}}>
                                                <Typography variant="caption" display="block" color="text.secondary">Medical Necessity</Typography>
                                                <Typography variant="body2" fontWeight="bold">{analysisData.categories?.medical_necessity.rating}</Typography>
                                            </Grid>
                                        }
                                        {
                                            <Grid size={{ xs:4}}>
                                                <Typography variant="caption" display="block" color="text.secondary">Governance</Typography>
                                                <Typography variant="body2" fontWeight="bold">{analysisData.categories?.governance.rating}</Typography>
                                            </Grid>
                                        }
                                        {
                                            <Grid size={{ xs:4}}>
                                                <Typography variant="caption" display="block" color="text.secondary">Fraud/Misrep</Typography>
                                                <Typography variant="body2" fontWeight="bold">{analysisData.categories?.fraud_misrepresentation.rating}</Typography>
                                            </Grid>
                                        }
                                    </Grid>
                                </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Symptom Summary Card */}
                        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'Background.default' }}>
                            <CardContent>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Symptom Summary (ADR lens):</Typography>
                                <Typography variant="body2" component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                                {
                                    analysisData.symptoms_summary?.map((s:any, i:any) => <li key={i}>{s}</li>)
                                }
                                {/* <li>Dyspnea at rest and minimal exertion; SpO2 persistently ≤90%</li>
                                <li>Increased fatigue; reduced intake with progressive nutritional decline</li>
                                <li>PRN bronchodilator use increased; no sustained improvement noted</li> */}
                                </Typography>
                            </CardContent>
                        </Card>
                        
                        {/* Category Table */}
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                                <Typography variant="subtitle1" fontWeight="bold">Categories</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                <TableHead>
                                    <TableRow>
                                    <TableCell><strong>Category</strong></TableCell>
                                    <TableCell><strong>Score</strong></TableCell>
                                    <TableCell><strong>Rating</strong></TableCell>
                                    <TableCell><strong>Findings</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>Medical Necessity</strong></TableCell>
                                        <TableCell>{analysisData.categories?.medical_necessity.score}</TableCell>
                                        <TableCell>{analysisData.categories?.medical_necessity.rating}</TableCell>
                                        <TableCell>
                                            <Typography variant="caption" component="ul" sx={{ pl: 2 }}>
                                                {analysisData.categories?.medical_necessity.findings.map((h:any, i:any) => <li key={i}>{h}</li>)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Governance</strong></TableCell>
                                        <TableCell>{analysisData.categories?.governance.score}</TableCell>
                                        <TableCell>{analysisData.categories?.governance.rating}</TableCell>
                                        <TableCell>
                                            <Typography variant="caption" component="ul" sx={{ pl: 2 }}>
                                                {analysisData.categories?.governance.findings.map((h:any, i:any) => <li key={i}>{h}</li>)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Fraud/Misrep</strong></TableCell>
                                        <TableCell>{analysisData.categories?.fraud_misrepresentation.score}</TableCell>
                                        <TableCell>{analysisData.categories?.fraud_misrepresentation.rating}</TableCell>
                                        <TableCell>
                                            <Typography variant="caption" component="ul" sx={{ pl: 2 }}>
                                                {analysisData.categories?.fraud_misrepresentation.findings.map((h:any, i:any) => <li key={i}>{h}</li>)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>



                        {/* Evidence Table */}
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                                <Typography variant="subtitle1" fontWeight="bold">Benefit Period Evidence</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                <TableHead>
                                    <TableRow>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Weight</strong></TableCell>
                                    <TableCell><strong>BP / HR</strong></TableCell>
                                    <TableCell><strong>SpO2</strong></TableCell>
                                    <TableCell><strong>Pain</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        analysisData.benefit_period_evidence?.map((row:any, index:any) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.date}</TableCell>
                                                <TableCell>{row.weight}</TableCell>
                                                <TableCell>{row.bp_hr}</TableCell>
                                                <TableCell>{row.spo2}</TableCell>
                                                <TableCell>{row.pain}</TableCell>
                                            </TableRow> 
                                        ))
                                    }
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>

                        {/* Document Presence & Highlights Table */}
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid #eee' }}>
                            <Typography variant="subtitle1" fontWeight="bold">RN Admission / MD / IDG Presence</Typography>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                            <TableHead>
                                <TableRow>
                                <TableCell><strong>Document</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Highlights</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {analysisData.document_highlights?.map((row:any, index:any) => (
                                <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 'bold', verticalAlign: 'top' }}>{row.document}</TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>{row.date}</TableCell>
                                    <TableCell>
                                    <Typography variant="caption" component="ul" sx={{ pl: 2 }}>
                                        {row.highlights.map((h:any, i:any) => <li key={i}>{h}</li>)}
                                    </Typography>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                        </Card>

            


                         {/* 3. ADR Audit Topics (New Section) */}
                        <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">ADR Audit Topics (1-15)</Typography>
                            {/* <Chip label={
                                    analysisData.audit_topics?.map((topic:any) => topic.status === 'PASS').length+' PASS, '
                                    +analysisData.audit_topics?.map((topic:any) => topic.status === 'FAIL').length+' FAIL.'
                                    +analysisData.audit_topics?.map((topic:any) => topic.status === 'NEEDS WORK').length+' NEEDS WORK.'
                                } 
                                variant="outlined" 
                                size="small" 
                                color="primary" /> */}
                        </Stack>
                        {analysisData.audit_topics?.map((topic:any) => (
                            <Accordion key={topic.id} variant="outlined" sx={{ mb: 1, borderRadius: '8px !important' }}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>{topic.id}. {topic.topic_name}</Typography>
                                <Chip label={topic.status} size="small" color={topic.status === 'PASS' ? 'success' : 'warning'} sx={{ fontWeight: 'bold' }} />
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="caption" display="block" color="text.secondary" gutterBottom>FINDING:</Typography>
                                <Typography variant="caption" component="ul" sx={{ pl: 2 }}>
                                    {topic.finding.map((h:any, i:any) => <li key={i}>{h}</li>)}
                                </Typography>
                                <Typography variant="caption" display="block" color="primary" fontWeight="bold">RECOMMENDATION:</Typography>
                                <Typography variant="caption" component="ul" sx={{ pl: 2 }}>
                                    {topic.recommendation.map((h:any, i:any) => <li key={i}>{h}</li>)}
                                </Typography>
                            </AccordionDetails>
                            </Accordion>
                        ))}
                        </Box>

                    </Stack>
                    </Grid>

                    {/* RIGHT: Document Checklist Sidebar */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <DocumentListSidebar files={patientFiles} />
                    </Grid>

                </Grid>
            </Box>
        </PageContainer>
    )
}

export default ADRPage;