import { useEffect } from 'react';
import { Modal, Input, Select, Button, Typography, Form, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';

const { Text } = Typography;

interface UserInterface {
    id?: number | null;
    companyId?: string;
    email?: string;
    password?: string;
    retypePassword?: string;
    role?: string;
}

interface Props {
    payload?: UserInterface;
    open: boolean;
    onClose: (data?: any) => void;
}

const AddUpdateUserModal = ({ payload, open, onClose }: Props) => {
    const { user }:any = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const { control, handleSubmit, reset, watch } = useForm<UserInterface>({
        defaultValues: {
            id: null,
            companyId: user?.company?.id || '0',
            email: '',
            password: '',
            retypePassword: '',
            role: 'user'
        }
    });

    useEffect(() => {
        console.log('Payload in AddUpdateUserModal:', payload);
        if (payload) {
            reset({
                id: payload.id || null,
                companyId: payload.companyId || '0',
                email: payload?.email || '',
                role: payload.role || 'user',
                password: '', // Usually keep passwords blank on edit
                retypePassword: ''
            });
        }

        if(payload === undefined){
            reset({
                id: null,
                companyId: user?.company?.id || '0',
                email: '',
                role: 'user',
                password: '',
                retypePassword: ''
            });
        }

    }, [payload, reset]);

    const handleSave = async (formData: UserInterface) => {
        try {
            if(formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                messageApi.warning("Please enter a valid email address.");
                return;
            }

            if (formData.password !== formData.retypePassword) {
                messageApi.error('Passwords do not match');
                return;
            }
            formData.companyId = user.company?.id;

            console.log('Saving user with data:', formData);
            const endPoint = payload?.id ? `/user/update/${payload.id}` : '/user/create';
            const { data } = await api.post(endPoint, formData);
            console.log("User updated successfully:", data);
            messageApi.success('User saved successfully');
            onClose(null);
        } catch (error) {
            console.error("Error saving user:", error);
            messageApi.error('An error occurred while saving the user. Please try again.');
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    }

    return (
        <Modal
            title={<span className="text-xl font-bold">{payload?.id ? 'Update' : 'Add'} New User</span>}
            open={open}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} danger>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit(handleSave)}>
                    {payload?.id ? 'Update User' : 'Save User'}
                </Button>
            ]}
        >
            <div className="py-4 space-y-5">
                {contextHolder}
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="email@example.com" size="large" />
                        )}
                    />
                </div>

                {/* Password Fields - Usually optional during Update */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            {payload?.id ? 'New Password (Optional)' : 'Password'}
                        </label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input.Password {...field} placeholder="******" size="large" />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Retype Password</label>
                        <Controller
                            name="retypePassword"
                            control={control}
                            render={({ field }) => (
                                <Input.Password {...field} placeholder="******" size="large" />
                            )}
                        />
                    </div>
                </div>

                {/* Role Selection */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Role</label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select 
                                {...field} 
                                className="w-full" 
                                size="large"
                                options={[
                                    { value: 'user', label: 'User' },
                                    { value: 'admin', label: 'Admin' }
                                ]}
                            />
                        )}
                    />
                </div>

                {payload?.id && (
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                        <Text type="secondary" className="text-xs italic">
                            Leave the password fields blank if you do not wish to change the current password.
                        </Text>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddUpdateUserModal;