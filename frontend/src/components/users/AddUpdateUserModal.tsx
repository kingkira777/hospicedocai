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
    email?: string;
    password?: string;
    retypePassword?: string;
    role?: string;
}

const AddUpdateUserModal = ({ payload, open, onClose }: DialogProps<PatientPayload>) => {
    const { session  } = useSession();
    const [formData, setFormData] = useState<PatientPayload>({
        id: null,
        companyId : session?.user.companyId || '',
        email:'',
        password:'',
        retypePassword:'',
        role: 'user'
    });

    useEffect(() => {
        console.log('Payload in AddUpdatePatientModal:', payload);
        if(payload){
            setFormData({
                id: payload.id || null,
                companyId: payload.companyId || session?.user.companyId || '',
                email: payload?.email || '',
                role: payload.role || ''
            });
        }
    }, [payload]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSave = async () => {
        try {
            console.log(`Saving user with data:`,formData);
            
            if(formData.password !== formData.retypePassword){
                ShowAlert({title: 'Error', text: 'Passwords do not match', icon: 'error', isToast: true});
                return;
            }
            
            
            if(payload && payload.id){
                console.log(formData);
                const { data } = await api.post(`/user/update/${payload.id}`, formData);
                console.log("User updated successfully:", data);
                ShowAlert({title: 'Success', text: 'User updated successfully', icon: 'success', isToast: true});
                onClose(data);
                return;
            }
            const { data } = await api.post('/user/create', formData);
            console.log("User saved successfully:", data);
            if(data === "limit of users reached"){
                ShowAlert({title: 'Limit Reached', text: data.message, icon: 'warning', isToast: true});
                onClose();
                return;
            }
            ShowAlert({title: 'Success', text: 'User saved successfully', icon: 'success', isToast: true});
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
                            type='email'
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{mt:1}}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <TextField
                            fullWidth
                            type='password'
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            sx={{mt:1}}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <TextField
                            fullWidth
                            type='password'
                            label="Retype Password"
                            name="retypePassword"
                            value={formData.retypePassword}
                            onChange={handleInputChange}
                            sx={{mt:1}}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Select
                            fullWidth
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            sx={{mt:1}}
                        >
                            <Option value={'user'}>User</Option>
                            <Option value={'admin'}>Admin</Option>
                        </Select>    
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

export default AddUpdateUserModal;