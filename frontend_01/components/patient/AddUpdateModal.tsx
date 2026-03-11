import React, { useState, useEffect } from "react";
import { Modal, Input, message, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import api from "@/lib/axios";

interface AddUpdateModalProps {
  open: boolean;
  close: (data: any | null) => void;
  payload?: any; // optional data for pre-filling the form when updating
}

// form state shape
interface PatientFormData {
  id?: number;
  companyId? : number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string | null;
  startOfCare: string | null;
  userId? : string
} 

/**
 * Basic modal that returns arbitrary data when confirmed or null when canceled.
 * Uses Ant Design's Modal component. For now it contains a single text input
 * to illustrate passing data back to the caller.
 */
export default function AddUpdatePatientModal({ open, close, payload }: AddUpdateModalProps) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [messageApi, contextHolder] = message.useMessage();
  const [visible, setVisible] = useState(open);
    

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: null,
    startOfCare: null,
  });

  // when parent toggles `open`, reflect it locally too
  useEffect(() => {
    setVisible(open);
    if (open && payload) {
      
        console.log("Pre-filling form with payload:", payload);
        setFormData({
            id: payload?.id,
            companyId: payload?.companyId,
            firstName: payload?.firstName,
            lastName: payload?.lastName,
            gender: payload?.gender,
            dateOfBirth: payload?.dateOfBirth,
            startOfCare: payload?.startOfCare,
        });
    }else{
        // reset form when opening for new patient
        setFormData({
            companyId: user.company?.id,
            firstName: "",
            lastName: "",
            gender: "male",
            dateOfBirth: null,
            startOfCare: null,
        });
    }
  }, [open,payload]);

  useEffect(() => {
    if (payload) {
      setFormData(payload);
    }
  }, [payload]);

  const handleOk = async () => {
    console.log("Form data to submit:", formData);

    formData.companyId = user.company?.id;
    formData.userId = user?.id;


    if(!formData.firstName.trim() || !formData.lastName.trim() || !formData.gender || !formData.dateOfBirth || !formData.startOfCare){
        messageApi.error("All fields are required!");
        return;
    }

    if(formData?.id){
        // update
        const { data } = await api.post(`/patient/update/${formData.id}`, formData);
        console.log("Patient updated successfully:", data);
        messageApi.success("Patient updated successfully!");
        setVisible(false);
        close(formData);
        return;
    }

    const { data } = await api.post('/patient/create', formData);
    console.log(data);
    messageApi.success("Patient saved successfully!");
    setVisible(false);
    close(formData);
  };

  const handleCancel = () => {
    setVisible(false);
    close(null);
  };

  return (
    <Modal
      title="Add / Update Patient"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
  
    >
    {contextHolder}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <Input
            size="middle"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="First name"
            className="mt-1 h-10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <Input
            size="middle"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Last name"
            className="mt-1 h-10" // add explicit height
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <Select
            size="middle"
            style={{width:'100%'}}
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e })}
            placeholder="Gender"
            className="mt-1 h-10" // add explicit height
            options={[
              { value: "male", label: "Male", default: true },
              { value: "female", label: "Female" },
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <DatePicker
            size="medium"
            value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
            onChange={(date, dateString) => setFormData({ ...formData, dateOfBirth: dateString || null})}
            className="mt-1 w-full h-10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start of Care</label>
          <DatePicker
            size="medium"
            value={formData.startOfCare ? dayjs(formData.startOfCare) : null}
            onChange={(date, dateString) => setFormData({ ...formData, startOfCare: dateString || null})}
            className="mt-1 w-full h-10"
          />
        </div>
      </div>
    </Modal>
  );
}
