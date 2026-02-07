import React, { useState, ChangeEvent, useEffect } from 'react';
import { 
  Box, 
  Button, 
  MenuItem, 
  TextField, 
  Typography, 
  Paper, 
  Stack,
  IconButton,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { DOCUMENT_CHECKLIST } from '../../constant/documents';
import { useSession } from '../../SessionContext';
import api from '../../utils/axios';
import { ShowAlert } from '../../utils/sweetAlert';
type Category = typeof DOCUMENT_CHECKLIST[number];


type Props = {
    patientList: any;
    selectedPatient: any;
    setSelectedPatient: any;
    setSelectedCategory: any;
    onSuccess: any;
}



const FileUploadComponent = ({patientList, selectedPatient, setSelectedPatient, setSelectedCategory, onSuccess} : Props) => {

  const { session } = useSession();
  const [category, setCategory] = useState<Category | ''>('');
  const [file, setFile] = useState<File | null>(null);


  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedPatient.id || !file || !category) return;
      // Logic to send to your backend
      console.log(`Selected patient: ${selectedPatient?.id}`);
      console.log('Uploading:', file.name, 'under category:', category);
      const formData = new FormData();
      formData.append('name', category);
      formData.append('patientId',  selectedPatient?.id || '');
      formData.append('userId', session?.user.id || '');
      formData.append('file', file);
      try {
          const { data } = await api.post('/file/upload', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          console.log('Upload response:', data);
          ShowAlert({title: 'Success', text: 'File uploaded successfully', icon: 'success', isToast: true});
          setFile(null);
          onSuccess(data);
      } catch (error:any) {
          console.error('Error uploading file:', error.message.toString());
          ShowAlert({title: 'Error', text: 'Failed to upload file or File is already uploaded', icon: 'error', isToast: true});
      }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 5, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Document Upload
      </Typography>

      <Stack spacing={3}>

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
                        <Search color="action" />
                    </InputAdornment>
                    ),
                }}
                />
            )}
        />

        {/* Category Selection */}
        <TextField
          select
          label="Document Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          fullWidth
        >
          {DOCUMENT_CHECKLIST.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {/* File Input */}
        <Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ height: '56px' }}
          >
            {file ? 'Change File' : 'Select File'}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
          </Button>
          
          {file && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
              <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
                {file.name}
              </Typography>
              <IconButton size="small" onClick={() => setFile(null)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          disabled={!file || !category}
          onClick={handleUpload}
          size="large"
          fullWidth
        >
          Upload Document
        </Button>
      </Stack>
    </Paper>
  );
};

export default FileUploadComponent;