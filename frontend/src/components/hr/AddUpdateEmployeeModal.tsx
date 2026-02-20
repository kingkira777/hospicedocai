import { useEffect } from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import { 
    Box, 
    Grid, 
    TextField, 
    Typography, 
    Paper, 
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from '../../SessionContext';
import api from '../../utils/axios';
import { ShowAlert } from '../../utils/sweetAlert';
import { Show } from '@toolpad/core';

interface EmployeeDataInterface {
    id?: number | null;
    companyId: string | undefined;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    address: string;
    zipcode: string;
    ssn: string;
    driverLic: string;
    phoneNumber: string;
    cellPhoneNumber: string;
    faxNumber: string;
    profInfo: {
        jobTitle: string;
        discipline: string;
        profLic: string;
        npi: string;
        startDate: string | null;
        endDate: string | null;
        validTill: string | null;
    };
    account: {
        email: string;
        type: string;
        status: string;
        accessLevel: string;
    };
}

const AddUpdateEmployeeModal = ({ payload, open, onClose }: DialogProps<EmployeeDataInterface>) => {    
    const { session } = useSession();

    // Initialize React Hook Form
    const { control, handleSubmit, reset } = useForm<EmployeeDataInterface>({
        defaultValues: {
            id: null,
            companyId: session?.user?.companyId,
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            address: '',
            zipcode: '',
            ssn: '',
            driverLic: '',
            phoneNumber: '',
            cellPhoneNumber: '',
            faxNumber: '',
            profInfo: {
                jobTitle: '',
                discipline: '',
                profLic: '',
                npi: '',
                startDate: null,
                endDate: null,
                validTill: null,
            },
            account: {
                email: '',
                type: '',
                status: '',
                accessLevel: '',
            }
        }
    });


    useEffect(() => {
        if (payload) {
            const employeeData = {
                id: payload?.id || null,
                companyId: session?.user?.companyId,
                firstName: payload?.firstName || '',
                lastName: payload.lastName || '',
                dateOfBirth: payload.dateOfBirth || null,
                address: payload.address || '',
                zipcode: payload.zipcode || '',
                ssn: payload.ssn || '',
                driverLic: payload.driverLic || '',
                phoneNumber: payload.phoneNumber || '',
                cellPhoneNumber: payload.cellPhoneNumber || '',
                faxNumber: payload.faxNumber || '',
                profInfo: {
                    jobTitle: payload.profInfo?.jobTitle || '',
                    discipline: payload.profInfo?.discipline || '',
                    profLic: payload.profInfo?.profLic || '',
                    npi: payload.profInfo?.npi || '',
                    startDate: payload.profInfo?.startDate || null,
                    endDate: payload.profInfo?.endDate || null,
                    validTill: payload.profInfo?.validTill || null,
                },
                account: {
                    email: payload.account?.email || '',
                    type: payload.account?.type || '',
                    status: payload.account?.status || '',
                    accessLevel: payload.account?.accessLevel || '',
                }
            };
            reset(employeeData);
        }
    }, [payload]);


    // Handle Save
    const handleSaveUpdate = async (employeeData: EmployeeDataInterface) => {

        if(!employeeData.firstName.trim() || !employeeData.lastName.trim()) {
            ShowAlert({
                title: 'Validation Error',
                text: 'First Name and Last Name are required.',
                icon: 'warning',
                isToast: true
            });
            return;
        }   

        if(!employeeData.profInfo.jobTitle.trim() || !employeeData.profInfo.discipline.trim() || !employeeData.profInfo.npi.trim()) {
            ShowAlert({
                title: 'Validation Error',
                text: 'Job Title and Discipline are required in Professional Information.',
                icon: 'warning',
                isToast: true
            });
            return;
        }

        if(!employeeData.account.email.trim() || !employeeData.account.status.trim() || !employeeData.account.accessLevel.trim()) {
            ShowAlert({
                title: 'Validation Error',
                text: 'Email, Status, and Access Level are required in Account Information.',
                icon: 'warning',
                isToast: true
            });
            return;
        }
        console.log('Final Employee Data to Save:', employeeData);

        try {
            if(employeeData.id) {
                // Update existing employee
                const { data } = await api.post(`/employee/update/${employeeData.id}`, employeeData);
                console.log('Employee updated successfully:', data);
                ShowAlert({
                    title: 'Success',
                    text: 'Employee updated successfully.',
                    icon: 'success',
                    isToast: true
                });
                onClose(data);
                return;
            }

            const { data } = await api.post('/employee/create', employeeData);
            console.log('Employee created successfully:', data);
            ShowAlert({
                title: 'Success',
                text: 'Employee saved successfully.',
                icon: 'success',
                isToast: true
            });
            onClose(data);
            return;
        } catch (error) {
            console.error('Error saving employee:', error);
             ShowAlert({
                title: 'Error',
                text: 'An error occurred while saving the employee. Please try again.',
                icon: 'error',
                isToast: true
            });   
        }
    };

    return (
        <Dialog fullWidth open={open} maxWidth="lg">
            <DialogTitle>Add Update Employee</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box component="form" sx={{ bgcolor: 'Background.default', mt: 1 }}>
                        
                        {/* Section: Personal Information */}
                        <Paper elevation={0} variant="outlined" sx={{ mb: 3 }}>
                            <Box sx={{ bgcolor: 'Background.default', p: 1.5, borderBottom: '1px solid #ddd' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                    Personal Information
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="firstName"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="FIRST NAME" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="lastName"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="LAST NAME" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="dateOfBirth"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker 
                                                    {...field} 
                                                    label="DATE OF BIRTH" 
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} 
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <Controller
                                            name="address"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="ADDRESS" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="zipcode"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="ZIPCODE" size="small" />}
                                        />
                                    </Grid>
                                    {/* ... Repeat pattern for SSN, Driver Lic, Phone, etc. */}
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="ssn"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="SSN" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="driverLic"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="Driver's License" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="PHONE NUMBER" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="cellPhoneNumber"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="CELL PHONE NUMBER" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="faxNumber"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="FAX NUMBER" size="small" />}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        {/* Section: Professional Information */}
                        <Paper elevation={0} variant="outlined" sx={{ mb: 3 }}>
                            <Box sx={{ bgcolor: 'Background.default', p: 1.5, borderBottom: '1px solid #ddd' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                    Professional Information
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="profInfo.jobTitle"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="JOB TITLE" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="profInfo.discipline"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField {...field} select fullWidth label="DISCIPLINE" size="small">
                                                    <MenuItem value="rn">RN</MenuItem>
                                                    <MenuItem value="lvn">LVN</MenuItem>
                                                    <MenuItem value="md">MD</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="profInfo.profLic"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="Professional License" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="profInfo.npi"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="NPI NUMBER" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="profInfo.startDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker 
                                                    label="FROM" 
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} 
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="profInfo.endDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker 
                                                    label="TO" 
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} 
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="profInfo.validTill"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker 
                                                    label="VALID TILL" 
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} 
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {/* ... and so on for the rest of the fields */}
                                </Grid>
                            </Box>
                        </Paper>

                        {/* Section: Account Information */}
                        <Paper elevation={0} variant="outlined">
                            <Box sx={{ bgcolor: 'Background.default', p: 1.5, borderBottom: '1px solid #ddd' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                    Account Information
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="account.email"
                                            control={control}
                                            render={({ field }) => <TextField {...field} fullWidth label="EMAIL" size="small" type='email' />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="account.status"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField {...field} select fullWidth label="STATUS" size="small">
                                                    <MenuItem value="active">Active</MenuItem>
                                                    <MenuItem value="inactive">Inactive</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="account.accessLevel"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField {...field} select fullWidth label="ACCESS LEVEL" size="small">
                                                    <MenuItem value="admin">Admin</MenuItem>
                                                    <MenuItem value="user">User</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='error' onClick={() => onClose()}>Cancel</Button> 
                <Button variant='contained' color="primary" onClick={handleSubmit(handleSaveUpdate)}>Save Employee</Button> 
            </DialogActions>
        </Dialog>
    );
};

export default AddUpdateEmployeeModal;