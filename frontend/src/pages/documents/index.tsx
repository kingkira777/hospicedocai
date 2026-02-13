import { PageContainer } from "@toolpad/core";
import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Container,
  Divider,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';

import FileUploadComponent from "../../components/documents/FileUploadComponent";
import FileList from "../../components/documents/FileList";
import api from "../../utils/axios";
import { useSession } from "../../SessionContext";
import { ShowConfirm, ShowAlert } from "../../utils/sweetAlert";
import MedicalAnalysisApp from "../../components/cases/DocumentAnalysis";
import { DOCUMENT_CHECKLIST } from "../../constant/documents";


type Category = typeof DOCUMENT_CHECKLIST[number];

const DocumentsPage = () => {
  const { session } = useSession();
  const [selectedPatient, setSelectedPatient] = useState(null as any);
  const [patientList, setPatientList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([] as any[]);
  const [category, setCategory] = useState('');

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
      const { data } = await api.post(`/file/by-patient/${patientId}`,{
        category: selectedCategory
      });
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
  }, [selectedPatient, selectedCategory]);


  useEffect(() => {
    FetchPatientSelectList();
  }, []);

  const OnSuccess = (data: any) => {
    FetchFileByPatient(selectedPatient.id);
  }

  
  const DeleteFile = async (id: number) => {
      ShowConfirm({
          title: 'Are you sure?',
          text: 'You will not be able to recover this file!',
          icon: 'question',
          fn: async (result : any) => {
            if(result.isConfirmed){
                try {
                    const { data } = await api.post(`/file/delete/${id}`);
                    ShowAlert({title: 'Deleted!', text: 'File has been deleted.', icon: 'success', isToast: true});
                    FetchFileByPatient(selectedPatient.id);
                } catch (error) {
                    console.error("Error in FetchFileByPatient:", error);
                    ShowAlert({title: 'Error', text: 'Failed to delete file.', icon: 'error', isToast: true});
                }
            }
          }
      });
  };

  return (
    <PageContainer>

        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} sx={{ borderLeft: { md: '1px solid #ddd' }, pl: { md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              {/* Category Selection */}
                <TextField
                  select
                  label="Document Category"
                  value={category}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  {DOCUMENT_CHECKLIST.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <FileList title={selectedCategory} files={files} deleteFile={DeleteFile} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FileUploadComponent 
                patientList={patientList} 
                selectedPatient={selectedPatient} 
                setSelectedPatient={setSelectedPatient} 
                onSuccess={OnSuccess}
              />
            </Grid>
          </Grid>
      </Container>
    </PageContainer>
  );
};

export default DocumentsPage;