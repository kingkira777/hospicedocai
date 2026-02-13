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
import { useSession } from '../../SessionContext';
import api from '../../utils/axios';
import { ShowAlert } from '../../utils/sweetAlert';


type Props = {
    patientList: any;
    selectedPatient: any;
    setSelectedPatient: any;
    onSuccess: any;
}



const FileUploadComponent = ({patientList, selectedPatient, setSelectedPatient, onSuccess} : Props) => {

  const { session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (!selectedPatient.id || files.length === 0) return;
    //   // Logic to send to your backend
      console.log(`Selected patient: ${selectedPatient?.id}`);
      const formData = new FormData();
      formData.append('patientId',  selectedPatient?.id || '');
      formData.append('userId', session?.user.id || '');
      files.forEach((file) => {
        formData.append('files', file);
      });
      try {
          setIsLoading(true);
          const { data } = await api.post('/file/upload', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          console.log('Upload response:', data);
          ShowAlert({title: 'Success', text: 'File uploaded successfully', icon: 'success', isToast: true});
          setFiles([]);
          onSuccess(data);
          setIsLoading(false);
      } catch (error:any) {
          console.error('Error uploading file:', error.message.toString());
          ShowAlert({title: 'Error', text: 'Failed to upload file or File is already uploaded', icon: 'error', isToast: true});
      }
  };

  const RemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
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

        {/* File Input */}
        <Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ height: '56px' }}
          >
            {files.length > 0 ? 'Change Files' : 'Select Files'}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.png"
              multiple
            />
          </Button>
          
          {files && files.length > 0 && (
            files.map((file, index) => (
              <Box key={index} sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'Bakcground.default', p: 1, borderRadius: 1 }}>
              <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
                {file.name}
              </Typography>
              <IconButton size="small" onClick={() => RemoveFile(index)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            ))
          )}
        </Box>

        {/* Submit Button */}
        <Button
          loading={isLoading}
          variant="contained"
          disabled={files.length === 0}
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