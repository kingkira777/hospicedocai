import { useEffect, useState } from "react";
import { 
    Card,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,Checkbox,
    Divider
} from "@mui/material";

import { CheckCircle } from "@mui/icons-material";

import { DOCUMENT_CHECKLIST } from "../../constant/documents";
import api from "../../utils/axios";

type Props = {
    patientId: string | undefined
}

const DocumentListSidebar = ({ patientId }: Props) => {
    const [checked, setChecked] = useState<string[]>(['Plan of Care', 'Visit Notes']);


    const FetchFileByPatient = async () => {
        try {
            const { data } = await api.get(`/file/by-patient/${patientId}`);
            console.log("Fetched file by patient:", data);
            const files = data.map((file: any) => file.name);
            console.log("files", files);
            setChecked(files);
        } catch (error) {
            console.error("Error in FetchFileByPatient:", error);
        }
    };

    useEffect(() => {
        if(patientId) FetchFileByPatient();
    },[patientId])


    return(
        <Card variant="outlined" sx={{ borderRadius: 2, position: 'sticky', top: 20 }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle2" fontWeight="bold">Audit Document Checklist</Typography>
            </Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {DOCUMENT_CHECKLIST.map((value) => (
                <ListItem key={value} disablePadding>
                <ListItemIcon sx={{ minWidth: 40, pl: 2 }}>
                    <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    // onClick={handleToggle(value)}
                    />
                </ListItemIcon>
                <ListItemText 
                    primary={value} 
                    primaryTypographyProps={{ variant: 'body2', fontWeight: checked.includes(value) ? 'bold' : 'normal' }} 
                />
                {checked.includes(value) && <CheckCircle color="success" sx={{ fontSize: 16, mr: 2 }} />}
                </ListItem>
            ))}
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
            {/* <Button fullWidth variant="contained" startIcon={<Description />}>
                Upload Missing
            </Button> */}
            </Box>
        </Card>
    )
};

export default DocumentListSidebar