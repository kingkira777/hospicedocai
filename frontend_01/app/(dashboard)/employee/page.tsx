"use client";
import { useEffect, useState } from "react";
import { message, type TableProps } from "antd";



import CustomTable from "@/components/CustomTable"
import AddUpdateEmployeeModal from "@/components/employee/AddUpdateModal";
import { showConfirmationDialog } from "@/lib/utils";


export default function EmployeePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const columns: TableProps<any>['columns'] = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Access Level',
        dataIndex: 'accessLevel',
        key: 'accessLevel',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_:any, record: any) => (
          <div className="flex gap-2">
            <button className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded" onClick={() => {
              handleEditEmployee(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>
            <button className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded" onClick={() => {
              handleRemoveEmployee(record);
            }}
          >
            Remove
          </button>
          </div>
        ),
      }
    ];

    const handleEditEmployee = (record: any) => {
        console.log("Edit employee:", record);
        // You can set the selected employee data to state here and pass it to the modal for editing
    };

    const handleRemoveEmployee = (record: any) => {
        console.log("Remove employee:", record);
        // You can set the selected employee data to state here and pass it to the modal for removal
        showConfirmationDialog('Are you sure?', 'Do you really want to delete this employee?').then((confirmed) => {
        if (confirmed) {
          console.log('Employee deleted:', record);
          messageApi.success("Employee deleted successfully!");
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
            console.log("Add New Employee clicked");
            setIsModalOpen(true);
          }}
        >
          Add New Employee
        </button>
      </div>
      <CustomTable columns={columns} dataSource={[]}  />
      <AddUpdateEmployeeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}