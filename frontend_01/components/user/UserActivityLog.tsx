import React, {useState, useEffect} from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '@/hooks/use-auth';
import api from '@/lib/axios';

interface ActivityLog {
  id: string;
  module: string;
  action: string;
  ipAddress: string;
  timestamp: string; // Added for a better UI experience
}

const UserActivityLog: React.FC = () => {
  const { user }:any = useAuth();
    const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
    const [pagination, setPagination]:any = useState({ current: 1, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);



    const fetchActivityLog = async () => {
      try {
        const { data } = await api.get(`/user/activity-logs?userId=${user?.id}&limit=${pagination.pageSize}&offset=${(pagination.current - 1) * pagination.pageSize}`);
        console.log("Fetched activity log:", data);
        setActivityLog(data.rows);
        setTotalRows(data.count);
      } catch (error) {
        console.error("Error fetching activity log:", error);
      }
    };


  useEffect(() => {
    if(!user) return
    fetchActivityLog();
  }, [user, pagination]);

  const columns: ColumnsType<ActivityLog> = [
    {
      title: 'MODULE',
      dataIndex: 'module',
      key: 'module',
      render: (text) => <span className="font-medium text-slate-700">{text}</span>,
    },
    {
      title: 'ACTION',
      dataIndex: 'action',
      key: 'action',
      render: (action) => {
        let color = action.includes('Delete') ? 'volcano' : action.includes('Create') ? 'green' : 'blue';
        return <Tag color={color}>{action.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'IP ADDRESS',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip) => <code className="text-xs bg-slate-100 px-2 py-1 rounded">{ip}</code>,
    },
  ];

  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Activity Log</h3>
        <p className="text-sm text-slate-500">Track recent changes and access points</p>
      </div>
      
      <div className="p-4">
        <Table 
          columns={columns} 
          dataSource={activityLog} 
          onChange={(pagination, filters, sorter) => setPagination(pagination)}
          pagination={{pageSize: pagination.pageSize, total: totalRows}}
          className="antd-custom-table"
        />
      </div>
    </div>
  );
};

export default UserActivityLog;