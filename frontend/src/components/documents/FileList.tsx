import { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  styled,
  IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import api from '../../utils/axios';
import { ShowAlert, ShowConfirm } from '../../utils/sweetAlert';

const SectionContainer = styled(Paper)(({ theme }) => ({
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: '8px',
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1.5),
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
}));

type Props = {
    title: string,
    files : string[],
    deleteFile: (id: number) => void
}


const FileList = ({title, files, deleteFile} : Props) => {

    useEffect(() => {
        console.log(title)
    }, [title]);


    return (
        <SectionContainer>
          <Typography variant="overline" sx={{ fontWeight: 'bold', display: 'block' }}>
            {title}
          </Typography>

            {files && (
                files.map((file:any, index) => (
                    <Box key={index} sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
                        {file.fileName}
                        </Typography>
                        <IconButton size="small" onClick={() => deleteFile(file.id)} color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>
                ))
            )}
        </SectionContainer>
    )
}


export default FileList