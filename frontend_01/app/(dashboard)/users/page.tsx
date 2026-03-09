"use client";
import { useEffect, useState } from "react";
import { message, type TableProps } from "antd";


import CustomTable from "@/components/CustomTable"
import AddUpdateUserModal from "@/components/user/AddUpdateModal";


export default function UsersPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: TableProps<any>['columns'] = [
      {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
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
        width: 200,
        render: (_:any, record: any) => (
          <div className="flex gap-2">
            <button className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded" onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>
            <button className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded" onClick={() => {
            }}
          >
            Remove
          </button>
          </div>
        ),
      }
    ];

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      {contextHolder}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-balance text-2xl font-semibold text-foreground">Users</h1>
        <button className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded" onClick={() => {
            console.log("Add New User clicked");
            setIsModalOpen(true);
          }}
        >
          Add New User
        </button>
      </div>

      <CustomTable columns={columns} dataSource={[]} />
      <AddUpdateUserModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}