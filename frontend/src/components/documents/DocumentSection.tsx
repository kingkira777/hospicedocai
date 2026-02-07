import { useEffect, useMemo, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  styled,
  createTheme,
  ThemeProvider, 
  useMediaQuery
} from '@mui/material';

import api from '../../utils/axios';
import { useSession } from '../../SessionContext';
import { ShowAlert } from '../../utils/sweetAlert';

const SectionContainer = styled(Paper)(({ theme }) => ({
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: '8px',
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.background.default 
        : '#fbfcfe',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
}));

type DocumentSectionProps = {
    patientId?: string;
    title: string;
    fileTexts: string[];
    files?: any[];
};

const DocumentSection = ({ title, fileTexts, files, patientId }: DocumentSectionProps) => {
    const { session } = useSession();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [uploadText, setUploadText] = useState({
        index : '',
        name : 'No file chosen'
    });


    useEffect(() => {
        setUploadText({
            index : '',
            name : 'No file chosen'
        });
    }, [fileTexts]);

    const theme = useMemo(
        () =>
        createTheme({
            palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            background: {
                default: prefersDarkMode ? '#121212' : '#f0f4f8',
                paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
            },
            },
        }),
        [prefersDarkMode],
    );

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file && patientId) {
            console.log(`Uploaded file for ${fileTexts[index]}:`, file);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', fileTexts[index]);
            formData.append('patientId',  patientId || '');
            formData.append('userId', session?.user.id || '');

            try {
                const { data } = await api.post('/file/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Upload response:', data);
                setUploadText({
                    index: index.toString(),
                    name: `File uploaded: ${data.originalName}`
                });
                ShowAlert({title: 'Success', text: 'File uploaded successfully', icon: 'success', isToast: true});
            } catch (error) {
                ShowAlert({title: 'Error', text: 'Failed to upload file', icon: 'error', isToast: true});
            }
        }
    };

    return (
        <SectionContainer>
          <Typography variant="overline" sx={{ fontWeight: 'bold', display: 'block' }}>
            {title}
          </Typography>

            {fileTexts.map((text:any, index) => (
                <Grid container alignItems="center" sx={{ py: 1 }}>
                    <Grid size={{ xs: 4 }}>
                    <Typography variant="body2">{text}</Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                    <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                        {(['Election of Benefit', 'Initial Certification'].includes(text) ? 'Required *' : '')}
                        {(['Recertification'].includes(text) ? '(BP2+)' : '')}
                    </Typography>
                    </Grid>
                    <Grid size={{ xs: 5 }} textAlign="right">
                    <Button variant="outlined" component="label" size="small" sx={{ textTransform: 'none' }}>
                        Choose File
                        <input type="file" hidden onChange={(event) => handleFileChange(event, index)} />
                    </Button>
                        <Typography variant="caption" sx={{ ml: 1 }}>{files?.filter((file) => file.name.trim() === text.trim())?.[0]?.originalName || (index === parseInt(uploadText.index, 10) ? uploadText.name : 'No file chosen')}</Typography>
                    </Grid>
                </Grid>
            ))}
        </SectionContainer>
    );
};

export default DocumentSection;
