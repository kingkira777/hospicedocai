import React, { useEffect, useState } from 'react';
import { PageContainer } from '@toolpad/core';
import { 
  Container, Grid, Paper, Typography, MenuItem, 
  FormControl, InputLabel, Select, Box, Divider, Chip, CircularProgress, Button
} from '@mui/material';
import { AutoAwesome, CheckCircleOutline, WarningAmber } from '@mui/icons-material';
import api from '../../utils/axios';
import { useSession } from '../../SessionContext';


const MedicalNotesAnalysisApp = () => {
    const { session } = useSession();
    const [selectedPatient, setSelectedPatient] = useState('');
    const [patientList, setPatientList]:any = useState([]);
    const [selectedNote, setSelectedNote] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [documents, setDocuments] = useState([] as any[]);

    const [selectedNoteText, setSelectedNoteText] = useState('');

    
    const [analysis, setAnalysis]:any = useState(null);


    const CheckNoteData = async () => {
        try {
            const payload = {
                patientId: selectedPatient,
                note: selectedNoteText
            }
            console.log(payload);
            const { data } = await api.post(`/note/find`,payload);
            console.log(`Retrieved note data:`,data);
            // setAnalysis(finalResults.analysis_results[0]);
            const analysisData = (data !== null) ? JSON.parse(data.data) : null;
            setAnalysis(analysisData)
        } catch (error) {
            console.error("Error in CheckNoteData:", error);
        }
    };


    const FetchPatientSelectList = async () => {
        try {
            const { data } = await api.get(`/patient/list-select?companyId=${session?.user?.companyId}`);
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
            const { data } = await api.post(`/file/by-patient/${selectedPatient}`);
            console.log("Fetched file by patient:", data);
            setDocuments(data);
        } catch (error) {
            console.error("Error in FetchFileByPatient:", error);
        }
    };

    useEffect(() => {
        FetchPatientSelectList();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            FetchFileByPatient();
        }
    }, [selectedPatient]);


    useEffect(() => {
        if(selectedNoteText != ''){
            CheckNoteData();
        }
    }, [selectedNoteText]);

    // Get The Selected Note Text
    useEffect(() => {
        const note = documents.find((doc: any) => doc.id === selectedNote);
        if(selectedPatient && (note && note.fileName)){
            setSelectedNoteText(note.fileName);
        }
    }, [selectedPatient, selectedNote]);


    // Save Analysis Data
    useEffect(() => {
        if (analysis && analysis !== undefined) {
            handleSaveUpdateNotes();
        }
    }, [analysis]);


    const handleGenerateAI = async () => {
        try {
            setIsGenerating(true);
            const { data } = await api.post(`/note/analyze-medical-paper/${selectedNote}`);
            console.log(data);
            const { finalResults } = data;
            setAnalysis(finalResults.analysis_results[0]);
            handleSaveUpdateNotes();
            setIsGenerating(false);   
        } catch (error) {
            console.error("Error in handleGenerateAI:", error);
            setIsGenerating(false);   
        }
    };

    const handleSaveUpdateNotes = async () => {
        try {
            const payload = {
                patientId: selectedPatient,
                note: selectedNoteText,
                data : JSON.stringify(analysis),
                userId: session?.user?.id
            };
            console.log(payload);
            const { data } = await api.post(`/note/create`, payload);
            console.log(data);
        } catch (error) {
            console.error("Error in handleSaveUpdateNotes:", error);
        }
    };
    

    return (
        <PageContainer title=''>
        <Container maxWidth="lg">
            <Paper sx={{ p: 3, minHeight: '450px', position: 'relative' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            RN Notes Analysis
        </Typography>

        <Grid container spacing={3}>
            {/* Output Panel */}
            <Grid size={{xs: 12, md: 8}}>
                <Paper sx={{ p: 3, minHeight: '400px' }}>
                    <Typography variant="h6" gutterBottom>Analysis Output</Typography>
                    <Divider sx={{ mb: 2 }} />

                    {!selectedNote || !analysis? (
                    <Box sx={{ textAlign: 'center', mt: 10, color: 'text.secondary' }}>
                        <Typography>Please select a patient and a specific note to begin analysis.</Typography>
                    </Box>
                    ) : 

                    analysis?.non_rn_notes === "" ?  (
                    <Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'right' }}>
                            <Chip 
                                label={"Risk Level: "+ analysis?.risk?.level} 
                                color={analysis?.risk?.level === 'High' ? 'error' : analysis?.risk?.level === 'Medium' ? 'warning' : 'success'} 
                                variant="outlined" />
                        </Box>

                        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight='bold'>Risk Justification</Typography>
                            <Typography variant="body2">{analysis?.risk?.justification}</Typography>
                        </Paper>
                        
                        <Typography variant="subtitle1" fontWeight="bold">Summary</Typography>
                        <ul>
                            <li><Typography variant="body2"> <strong>Documented:</strong> {analysis?.summary?.is_documented ? 'Yes' : 'No'}</Typography></li>
                            <li><Typography variant="body2"> <strong>Visit Date:</strong> {analysis?.summary?.visit_date}</Typography></li>
                            <li><Typography variant="body2"> <strong>Clinical Signature:</strong> {analysis?.summary?.clinician_signature_present ? 'Yes' : 'No'}</Typography></li>
                        </ul>
                        
                        <Typography variant="subtitle1" fontWeight="bold">Physical Assessment</Typography>
                        <ul>
                            <li><Typography variant="body2"> <strong>Vitals:</strong> {analysis?.physical_assessment?.vitals}</Typography></li>
                            <li><Typography variant="body2"> <strong>Cardiac Findings:</strong> {analysis?.physical_assessment?.cardiac_findings}</Typography></li>
                            <li><Typography variant="body2"> <strong>Skin/Wound Notes:</strong> {analysis?.physical_assessment?.skin_wound_notes}</Typography></li>
                        </ul>
                        
                        <Typography variant="subtitle1" fontWeight="bold">Indicators of Decline</Typography>
                        <ol>
                            {
                                analysis?.indicators_of_decline?.map((indicator:any, index:number) => (
                                    <li key={index}>
                                        <Typography variant="body2">{indicator}</Typography>
                                    </li>
                                ))
                            }
                        </ol>

                        <Typography variant="subtitle1" fontWeight="bold">Suggested Care Plan Updates</Typography>
                        <ol>
                            {
                                analysis?.suggested_care_plan_updates?.map((indicator:any, index:number) => (
                                    <li key={index}>
                                        <Typography variant="body2">{indicator}</Typography>
                                    </li>
                                ))
                            }
                        </ol>

                        <Typography variant="subtitle1" fontWeight="bold">Hallucination Check</Typography>
                        <Typography variant="body2">{analysis?.hallucination_check}</Typography>

                        <Typography variant="subtitle1" fontWeight="bold">Narrative</Typography>
                        <Typography variant="body2">{analysis?.narrative}</Typography>

                        <Typography variant="subtitle1" fontWeight="bold">Strengthen the Case</Typography>
                        <Typography variant="body2">{analysis?.strengthen_the_case}</Typography>

                        <Typography variant="subtitle1" fontWeight="bold" color='error'>Missing</Typography>
                        <Typography variant="body2">{analysis?.missing}</Typography>
                    </Box>
                    ) : (
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">{analysis?.file_name}</Typography>
                            
                            <Typography variant="subtitle1" fontWeight="bold">Summary</Typography>
                            <Typography variant="body2">{analysis?.non_rn_notes}</Typography>
                        </Box>
                    )
                }
                </Paper>
            </Grid>


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
                        {patientList.map((p:any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={!selectedPatient}>
                    <InputLabel>Select RN Note</InputLabel>
                    <Select
                        value={selectedNote}
                        label="Select RN Note"
                        onChange={(e) => setSelectedNote(e.target.value)}
                    >
                        {documents.map(n => <MenuItem key={n.id} value={n.id}>{n.fileName}</MenuItem>)}
                    </Select>
                    </FormControl>
                    
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                        disabled={!selectedNote || isGenerating}
                        onClick={handleGenerateAI}
                        sx={{ borderRadius: '20px', px: 3 }}
                    >
                    {isGenerating ? 'Analyzing...' : 'Generate AI Assistant'}
                    </Button>
                </Paper>
            </Grid>
        </Grid>
        </Paper>
        </Container>
        </PageContainer>
    );
};

export default MedicalNotesAnalysisApp;