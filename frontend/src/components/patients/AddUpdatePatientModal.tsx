import { DialogProps } from '@toolpad/core/useDialogs';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    InputLabel,
    Select,
    MenuItem as Option,
} from '@mui/material';

import CustomDatePicker from '../DatePicker';
import dayjs from 'dayjs';
import { useSession } from '../../SessionContext';
import api from '../../utils/axios';
import { ShowAlert } from '../../utils/sweetAlert';

interface PatientPayload {
    id?: number | null;
    companyId?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    dateOfBirth?: string;
    startOfCare?: string;
    userId?: string;
}

const AddUpdatePatientModal = ({ payload, open, onClose }: DialogProps<PatientPayload>) => {
    const { session  } = useSession();
    const [formData, setFormData] = useState<PatientPayload>({
        id: null,
        companyId: session?.user.companyId || '',
        firstName:'',
        lastName:'',
        gender:'',
        dateOfBirth: '',
        startOfCare: '',
        userId : session?.user.id || ''
    });

    useEffect(() => {
        console.log('Payload in AddUpdatePatientModal:', payload);
        if(payload){
            setFormData({
                id: payload.id || null,
                companyId: payload.companyId || session?.user.companyId || '',
                firstName: payload?.firstName || '',
                lastName: payload.lastName || '',
                gender: payload.gender || '',
                dateOfBirth: payload.dateOfBirth || '',
                startOfCare: payload.startOfCare || '',
                userId : payload.userId || session?.user.id || ''
            });
        }
    }, [payload]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSave = async () => {
        try {
            formData.dateOfBirth = dayjs(formData.dateOfBirth).format('YYYY-MM-DD');
            formData.startOfCare = dayjs(formData.startOfCare).format('YYYY-MM-DD');
            console.log('Saving patient with data:', formData);
            if(payload && payload.id){
                console.log(formData);
                const { data } = await api.post(`/patient/update/${payload.id}`, formData);
                console.log("Patient updated successfully:", data);
                ShowAlert({title: 'Success', text: 'Patient updated successfully', icon: 'success', isToast: true});
                onClose(data);
                return;
            }
            const { data } = await api.post('/patient/create', formData);
            if(data.message){
                ShowAlert({title: 'Limit Reached', text: data.message, icon: 'warning', isToast: true});
                onClose();
                return;
            }
            console.log("Patient saved successfully:", data);
            ShowAlert({title: 'Success', text: 'Patient saved successfully', icon: 'success', isToast: true});
            onClose(data);
        } catch (error) {
            console.error("Error saving patient:", error);   
            onClose();
        }
    };


    return(
        <Dialog fullWidth open={open}>
        <DialogTitle>{payload && payload.id ? 'Update' : 'Add'} New Patient</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            sx={{mt:1}}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            sx={{mt:1}}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Select
                            fullWidth
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            sx={{mt:1}}
                        >
                            <Option value={'male'}>Male</Option>
                            <Option value={'female'}>Female</Option>
                        </Select>    
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomDatePicker
                            label="Date of Birth"
                            value={formData.dateOfBirth || ''}
                            size='medium'
                            onChange={(e) => setFormData({...formData, dateOfBirth : e})} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomDatePicker
                            label="SOC"
                            value={formData.startOfCare || ''}
                            size='medium'
                            onChange={(e) => setFormData({...formData, startOfCare : e})} />
                    </Grid>
                   
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='error' onClick={() => onClose()}>Cancel</Button> 
                <Button variant='contained' color="primary" onClick={handleSave}>{payload && payload.id ? 'Update' : 'Save'} New Patient</Button> 
            </DialogActions>
        </Dialog>
    )
};

export default AddUpdatePatientModal;