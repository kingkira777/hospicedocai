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
import { useSession } from '../../SessionContext';
import api from '../../utils/axios';
import { ShowAlert } from '../../utils/sweetAlert';

interface EmployeeInterface {
    id?: number | null;
    companyId?: string;
    email?: string;
    password?: string;
    retypePassword?: string;
}

const UpdateEmployeeAccount = ({ payload, open, onClose }: DialogProps<EmployeeInterface>) => {
    const { session  } = useSession();
    const [formData, setFormData] = useState<EmployeeInterface>({
        id: null,
        companyId : session?.user.companyId || '',
        email:'',
        password:'',
        retypePassword:''
    });

    useEffect(() => {
        console.log('Payload in AddUpdateUserModal:', payload);
        if(payload){
            setFormData({
                id: payload.id || null,
                companyId: payload.companyId || session?.user.companyId || '',
                email: payload?.email || ''
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
                ShowAlert({
                    title : 'Mismatch Password',
                    text : 'Passwords do not match',
                    icon : 'warning',
                    isToast : true
                });
                return;
            }
            const { data } = await api.post(`/employee/account-update/${formData.id}`,{
                email : formData.email,
                password : formData.password
            });
            console.log('Update response:', data);
            ShowAlert({
                title : 'Success',
                text : 'Employee account updated successfully',
                icon : 'success',
                isToast : true
            });
            onClose(data);
            return;
        } catch (error) {
            console.error("Error saving patient:", error);   
            onClose();
        }
    };


    return(
        <Dialog fullWidth open={open}>
        <DialogTitle>Update Employee Account</DialogTitle>
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
                   
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='error' onClick={() => onClose()}>Cancel</Button> 
                <Button variant='contained' color="primary" onClick={handleSave}>{payload && payload.id ? 'Update' : 'Save'} Employee Account</Button> 
            </DialogActions>
        </Dialog>
    )
};

export default UpdateEmployeeAccount;