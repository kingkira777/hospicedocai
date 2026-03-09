"use client";
import { useState, useEffect } from "react";
import TablePatients from "@/components/patient/table";
import { message, type TableProps } from "antd";
import { Edit2, Trash2 } from "lucide-react";


import CustomTable from "@/components/CustomTable";
import AddUpdatePatientModal from "@/components/patient/AddUpdateModal";
import { showConfirmationDialog } from "@/lib/utils";
import api from "@/lib/axios";


export default function PatientPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null); 
  const [patients, setPatients] = useState([]); 
  const [loading, setLoading] = useState(false);


  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/patient/list?companyId=1');
      console.log("Fetched patients:", data);
      setPatients(data.rows);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      messageApi.error("Failed to fetch patients. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);



  const columns: TableProps<any>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render : (text: string, record: any) => (
        <b>{record.firstName} {record.lastName}</b>
      )
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render : (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString();
      }
    },
    {
      title: 'Start of Care',
      dataIndex: 'startOfCare',
      key: 'startOfCare',
      render : (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString();
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_:any, record: any) => (
        
        <div  className="flex gap-2">
          <button key={'edit'+record.id} className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded flex items-center gap-1" onClick={() => {
              handleEditPatient(record);
              setIsModalOpen(true);
            }}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button key={'remove'+record.id} className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded flex items-center gap-1" onClick={() => {
              handleRemovePatient(record);
            }}
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      ),
    }
  ];

  const handleEditPatient = (patientData: any) => {
    // Handle editing a patient here
    console.log('Editing patient:', patientData);
    setEditingPatient(patientData); // set the patient being edited
    setIsModalOpen(true);
  };

  const handleRemovePatient = (patientData: any) => {
    // Handle removing a patient here
    console.log('Removing patient:', patientData);
    showConfirmationDialog('Are you sure?', 'Do you really want to delete this patient?').then(async (confirmed) => {
      if (confirmed) {
        console.log('Patient deleted:', patientData);
        const { data } = await api.post(`/patient/remove/${patientData.id}`);
        messageApi.success("Patient deleted successfully!");
        setEditingPatient(null); 
        fetchPatients();
      } else {
        console.log('Patient deletion cancelled');
      }
    });
  }

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      {contextHolder}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-balance text-2xl font-semibold text-foreground">Patients</h1>
        <button className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded" onClick={() => {
            setEditingPatient(null);
            setIsModalOpen(true);
          }}
        >
          Add New Patient
        </button>
      </div>


      {/* Patient Table */}
      <CustomTable dataSource={patients} columns={columns} loading={loading} />

      {/* AddUpdatePatientModal */}
      <AddUpdatePatientModal open={isModalOpen} close={(data) => {
        setIsModalOpen(false);
        fetchPatients();
      }} payload={editingPatient} />
    </section>
  )
}
