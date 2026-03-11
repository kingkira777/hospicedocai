import { useEffect } from 'react';
import { 
    Modal, 
    Input, 
    Select, 
    DatePicker, 
    Button, 
    Row, 
    Col, 
    Typography,
    message
} from 'antd';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';


const { Text } = Typography;

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

interface Props {
    payload?: EmployeeDataInterface;
    open: boolean;
    onClose: (data?: any) => void;
}

const AddUpdateEmployeeModal = ({ payload, open, onClose }: Props) => {
    const { user }:any = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const { control, handleSubmit, reset, watch } = useForm<EmployeeDataInterface>({
        defaultValues: {
            id: null,
            companyId: user?.company?.id,
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
            profInfo: { jobTitle: '', discipline: '', profLic: '', npi: '', startDate: null, endDate: null, validTill: null },
            account: { email: '', status: 'active', accessLevel: 'user' }
        }
    });

    useEffect(() => {
        console.log("Payload:", payload);
        if (payload) {
            reset({
                ...payload,
                companyId: user?.company?.id,
            });
        }

        if(payload === undefined){
            reset({
                id: null,
                companyId: user?.company?.id,
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
                profInfo: { jobTitle: '', discipline: '', profLic: '', npi: '', startDate: null, endDate: null, validTill: null },
                account: { email: '', status: 'active', accessLevel: 'user' }
            });
        }
    }, [payload, reset]);

    const handleSaveUpdate = async (employeeData: EmployeeDataInterface) => {
        // Validation logic
        if (!employeeData.firstName?.trim() || !employeeData.lastName?.trim()) {
            messageApi.warning("First and Last name are required.");
            return;
        }

        if(!employeeData.account.email?.trim() || !employeeData.account.status?.trim() || !employeeData.account.accessLevel?.trim()) {
            messageApi.warning("All account fields are required.");
            return;
        }

        if(employeeData.account.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.account.email)) {
            messageApi.warning("Please enter a valid email address.");
            return;
        }
        try {
            console.log("Employee data to submit:", employeeData);
            const endpoint = employeeData.id ? `/employee/update/${employeeData.id}` : '/employee/create';
            const { data } = await api.post(endpoint, employeeData);
            messageApi.success("Employee saved successfully!");
            reset({
                id: null,
                companyId: user?.company?.id,
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
                profInfo: { jobTitle: '', discipline: '', profLic: '', npi: '', startDate: null, endDate: null, validTill: null },
                account: { email: '', status: 'active', accessLevel: 'user' }
            });
            onClose(data);
        } catch (error) {
            console.error("Error saving employee:", error);
            messageApi.error("An error occurred while saving the employee.");
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-bold">Add / Update Employee</span>}
            open={open}
            onCancel={() => onClose()}
            width={1100}
            footer={[
                <Button key="back" onClick={() => onClose()} danger>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit(handleSaveUpdate)}>
                    Save Employee
                </Button>,
            ]}
        >
            <div className="space-y-6">
                {contextHolder}
                {/* Section: Personal Information */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <Text strong className="text-blue-600">Personal Information</Text>
                    </div>
                    <div className="p-4">
                        <Row gutter={[24, 16]}>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">First Name</label>
                                <Controller name="firstName" control={control} render={({ field }) => <Input {...field} placeholder="Enter First Name" />} />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Last Name</label>
                                <Controller name="lastName" control={control} render={({ field }) => <Input {...field} placeholder="Enter Last Name" />} />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Date of Birth</label>
                                <Controller 
                                    name="dateOfBirth" 
                                    control={control} 
                                    render={({ field }) => (
                                        <DatePicker 
                                            className="w-full" 
                                            value={field.value ? dayjs(field.value) : null} 
                                            onChange={(date) => field.onChange(date ? date.toISOString() : null)} 
                                        />
                                    )} 
                                />
                            </Col>
                            <Col xs={24} sm={16}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Address</label>
                                <Controller name="address" control={control} render={({ field }) => <Input {...field} placeholder="Full Address" />} />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Zipcode</label>
                                <Controller name="zipcode" control={control} render={({ field }) => <Input {...field} />} />
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Section: Professional Information */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <Text strong className="text-blue-600">Professional Information</Text>
                    </div>
                    <div className="p-4">
                        <Row gutter={[24, 16]}>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Job Title</label>
                                <Controller name="profInfo.jobTitle" control={control} render={({ field }) => <Input {...field} />} />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Discipline</label>
                                <Controller 
                                    name="profInfo.discipline" 
                                    control={control} 
                                    render={({ field }) => (
                                        <Select {...field} className="w-full" options={[
                                            { value: 'rn', label: 'RN' },
                                            { value: 'lvn', label: 'LVN' },
                                            { value: 'md', label: 'MD' },
                                        ]} />
                                    )} 
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">NPI Number</label>
                                <Controller name="profInfo.npi" control={control} render={({ field }) => <Input {...field} />} />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Start Date</label>
                                <Controller 
                                    name="profInfo.startDate" 
                                    control={control} 
                                    render={({ field }) => (
                                        <DatePicker 
                                            className="w-full" 
                                            value={field.value ? dayjs(field.value) : null} 
                                            onChange={(date) => field.onChange(date ? date.toISOString() : null)} 
                                        />
                                    )} 
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">End Date</label>
                                <Controller 
                                    name="profInfo.endDate" 
                                    control={control} 
                                    render={({ field }) => (
                                        <DatePicker 
                                            className="w-full" 
                                            value={field.value ? dayjs(field.value) : null} 
                                            onChange={(date) => field.onChange(date ? date.toISOString() : null)} 
                                        />
                                    )} 
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Valid Till</label>
                                <Controller 
                                    name="profInfo.validTill" 
                                    control={control} 
                                    render={({ field }) => (
                                        <DatePicker 
                                            className="w-full" 
                                            value={field.value ? dayjs(field.value) : null} 
                                            onChange={(date) => field.onChange(date ? date.toISOString() : null)} 
                                        />
                                    )} 
                                />
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Section: Account Information */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <Text strong className="text-blue-600">Account Information</Text>
                    </div>
                    <div className="p-4">
                        <Row gutter={[24, 16]}>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Email</label>
                                <Controller name="account.email" control={control} render={({ field }) => <Input {...field} type="email" />} />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Status</label>
                                <Controller 
                                    name="account.status" 
                                    control={control} 
                                    render={({ field }) => (
                                        <Select {...field} className="w-full" options={[
                                            { value: 'active', label: 'Active' },
                                            { value: 'inactive', label: 'Inactive' },
                                        ]} />
                                    )} 
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Access Level</label>
                                <Controller 
                                    name="account.accessLevel" 
                                    control={control} 
                                    render={({ field }) => (
                                        <Select {...field} className="w-full" options={[
                                            { value: 'admin', label: 'Admin' },
                                            { value: 'user', label: 'User' },
                                        ]} />
                                    )} 
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddUpdateEmployeeModal;