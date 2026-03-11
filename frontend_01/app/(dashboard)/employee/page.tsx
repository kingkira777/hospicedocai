"use client";
import { useEffect, useState } from "react";
import { message, type TableProps } from "antd";



import CustomTable from "@/components/CustomTable"
import AddUpdateEmployeeModal from "@/components/employee/AddUpdateModal";
import AddUpdateEmployeeAccount from "@/components/employee/AddUpdateAccount";
import { showConfirmationDialog } from "@/lib/utils";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/use-auth";


export default function EmployeePage() {
  const { user }:any = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchEmployees = async (companyId: number) => {
    try {
      setLoading(true);
      const { data } = await api.post(`/employee/list`,{
        companyId,
        limit: 10,
        offset: 0
      });
      console.log("Employees data:", data);
      setEmployeeData(data.rows || []);
      setLoading(false);
    } catch (error) {
      
    }
  };

  useEffect(() => {
    if(!user) return;
    fetchEmployees(user?.companyId || 0);
  }, [user]);

  const columns: TableProps<any>['columns'] = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => `${record.firstName} ${record.lastName}`,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (_, record) => `${record.account?.email || ''}`,

      },
      {
        title: 'Access Level',
        dataIndex: 'accessLevel',
        key: 'accessLevel',
        render: (_, record) => `${record.account?.accessLevel || ''}`,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => `${record.account?.status || ''}`,
      },
      {
        title: 'Action',
        key: 'action',
        width: 200,
        render: (_:any, record: any) => (
          <div className="flex gap-2">
            <button className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded" onClick={() => {
              handleEditEmployee(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>
            <button className="cursor-pointer bg-amber-500 text-white py-2 px-4 rounded" onClick={() => {
              handleEditEmployee(record);
              setIsAccountModalOpen(true);
            }}
          >
            Account
          </button>

          {
            (user?.type === 'admin' || user?.type === 'user') && (
              <button className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded" onClick={() => {
                  handleRemoveEmployee(record);
                }}
              >
                Remove
              </button>
            )
          }
          </div>
        ),
      }
    ];

    const handleEditEmployee = (record: any) => {
        console.log("Edit employee:", record);
        setEditEmployee(record);
        // You can set the selected employee data to state here and pass it to the modal for editing
    };

    const handleRemoveEmployee = (record: any) => {
        console.log("Remove employee:", record);
        // You can set the selected employee data to state here and pass it to the modal for removal
        showConfirmationDialog('Are you sure?', 'Do you really want to delete this employee?').then( async(confirmed) => {
        if (confirmed) {
          await api.post(`/employee/remove/${record.id}`);
          fetchEmployees(parseInt(user?.companyId || '0', 10));  
          messageApi.success("Employee deleted successfully!");
          return;
        } else {
          console.log('Employee deletion cancelled');
        }
      });
    };


  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      {contextHolder}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-balance text-2xl font-semibold text-foreground">Employees</h1>
        <button className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded" onClick={() => {
            setEditEmployee(null);
            setIsModalOpen(true);
          }}
        >
          Add New Employee
        </button>
      </div>
      <CustomTable columns={columns} dataSource={employeeData}  />
      <AddUpdateEmployeeModal
        open={isModalOpen}
        payload={editEmployee || undefined}
        onClose={() => {
          setIsModalOpen(false)
          fetchEmployees(user?.companyId || 0);
        }}
      />

      <AddUpdateEmployeeAccount
        open={isAccountModalOpen}
        payload={editEmployee || undefined}
        onClose={() => {
          setIsAccountModalOpen(false)
          fetchEmployees(user?.companyId || 0);
        }}
      />
    </section>
  )
}