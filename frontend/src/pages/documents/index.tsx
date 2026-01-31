import { PageContainer } from "@toolpad/core";
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  styled,
  Autocomplete,
  TextField,
  InputAdornment,
  Container
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import DocumentSection from "../../components/documents/DocumentSection";
import api from "../../utils/axios";
import { useSession } from "../../SessionContext";
import dayjs from "dayjs";


const DocumentsPage = () => {
  const { session } = useSession();
  const [selectedPatient, setSelectedPatient] = useState(null as any);
  const [patientList, setPatientList] = useState([]);
  const [files, setFiles] = useState([] as any[]);

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

  const FetchFileByPatient = async (patientId: number) => {
    try {
      const { data } = await api.get(`/file/by-patient/${patientId}`);
      console.log("Fetched file by patient:", data);
      setFiles(data);
    } catch (error) {
      console.error("Error in FetchFileByPatient:", error);
    }
  };


  useEffect(() => {
    if(selectedPatient){
      FetchFileByPatient(selectedPatient.id);
    }
  }, [selectedPatient]);


  useEffect(() => {
    FetchPatientSelectList();
  }, []);


  return (
    <PageContainer>
        <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        {/* 1. SELECT PATIENT HEADER */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1a3e72' }}>
                Patient Record Access
              </Typography>
              <Autocomplete
                options={patientList}
                getOptionLabel={(option) => `${option.name} (${option.id})`}
                value={selectedPatient}
                onChange={(event, newValue) => {
                  if (newValue) setSelectedPatient(newValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Search and Select Patient" 
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Dynamic Patient Info Header based on selection */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ borderLeft: { md: '1px solid #ddd' }, pl: { md: 4 } }}>
              <Box>
                <Typography variant="body2" color="textSecondary">Current Patient:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {selectedPatient?.name} <Typography component="span" color="textSecondary">({selectedPatient?.id})</Typography>
                </Typography>
                <Typography variant="body2">
                  <b>Date of Birth:</b> {(!selectedPatient)? '' : new Date(selectedPatient?.dateOfBirth).toLocaleDateString()} <br />
                  <b>Gender:</b> {selectedPatient?.gender?.charAt(0).toUpperCase() + selectedPatient?.gender?.slice(1)}  <br />
                  <b>SOC:</b> {(!selectedPatient)? '' : new Date(selectedPatient?.startOfCare).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 2. DOCUMENT SECTIONS (As per original image) */}
        {
          (selectedPatient)? (
            <>
              <DocumentSection patientId={selectedPatient.id} files={files} title="Election & Certifications" fileTexts={['Election of Benefit', 'Initial Certification', 'Recertification']} />
              <DocumentSection patientId={selectedPatient.id} files={files} title="Face-to-Face Encounter" fileTexts={['F2F Encounter', 'F2F Addendum']} />
              <DocumentSection patientId={selectedPatient.id} files={files} title="Clinical Assessments" fileTexts={['RN Initial Assessment', 'Social Worker Initial Assessment', 'Chaplain Initial Assessment','Physician / Referring Notes']} />
              <DocumentSection patientId={selectedPatient.id} files={files} title="IDG & Care Delivery" fileTexts={['Plan of Care', 'IDG Notes', 'Visit Notes', 'Phone Notes']} />
              <DocumentSection patientId={selectedPatient.id} files={files} title="Medications & Diagnostics" fileTexts={['Medication List / MAR', 'Labs / Imaging']} />
            </>
          ) : (
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1a3e72' }}>
              Please select a patient to view and upload documents.
            </Typography>
          )
        }

        
      </Container>

    </PageContainer>
  );
};

export default DocumentsPage;