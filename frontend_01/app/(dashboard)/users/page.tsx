"use client";
import { useEffect, useState } from "react";
import { message, type TableProps } from "antd";


import CustomTable from "@/components/CustomTable"
import AddUpdateUserModal from "@/components/user/AddUpdateModal";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/use-auth";
import { set } from "date-fns";


export default function UsersPage() {
  const { user } :any = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [editUser, setEditUser] = useState(null);


  const fetchUsers = async () => {
    try {
      const { data } = await api.get(`/user/list?companyId=${user?.company?.id}&userId=${user?.id}`);
      console.log("Fetched users:", data);
      setUserData(data.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      messageApi.error("Failed to fetch users. Please try again later.");
    }
  };

  useEffect(() => {
    if(!user) return;
    fetchUsers();
  }, [user]);

  const columns: TableProps<any>['columns'] = [
      {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
        render:(_, record) => record?.company?.name
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
        render:(_, record) => record?.role
      },
      {
        title: 'Action',
        key: 'action',
        width: 200,
        render: (_:any, record: any) => (
          <div className="flex gap-2">
            <button className="cursor-pointer bg-(--brand) text-white py-2 px-4 rounded" onClick={() => {
              setIsModalOpen(true);
              setEditUser(record);
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
            setEditUser(null);
            setIsModalOpen(true);
          }}
        >
          Add New User
        </button>
      </div>

      <CustomTable columns={columns} dataSource={userData} />
      <AddUpdateUserModal payload={editUser || undefined} open={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        fetchUsers();
      }} />
    </section>
  )
}