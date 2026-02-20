import { PageContainer, Show } from "@toolpad/core";
import React, { useState, useEffect } from 'react';
import { 
    Box, Container, Typography, Paper, Grid, Autocomplete, TextField,
    Chip, Stack, styled, Avatar, Button
} from '@mui/material';
import { Edit, Delete, AddOutlined, AccountBoxOutlined } from "@mui/icons-material";
import { GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { useSession } from "../../SessionContext";
import { useDialogs } from "@toolpad/core";
import CustomDataGridTable from "../../components/DataGrid";
import api from "../../utils/axios";
import AddUpdateEmployeeModal from "../../components/hr/AddUpdateEmployeeModal";
import UpdateEmployeeAccount from "../../components/hr/UpdateEmployeeAccount";
import { ShowAlert, ShowConfirm } from "../../utils/sweetAlert";

const EmployeesPage = () => {
    const { session  } = useSession();
  
    const dialogs = useDialogs(); 

    const [loading, setLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState<GridRowsProp>([]);
    const [rowCount, setRowCount] = useState(0);
    const [pagination, setPagination] = useState({
        page : 0,
        pageSize : 10
    });

    
    const FetchEmployees = async (companyId: number) => {
      try {
        setLoading(true);
        const { data } = await api.post(`/employee/list`,{
          companyId,
          limit: pagination.pageSize || 10,
          offset: pagination.pageSize * pagination.page || 0
        });
        console.log("Employees data:", data);
        setRowCount(data.count || 0);
        setEmployeeData(data.rows || []);
        setLoading(false);
      } catch (error) {
        
      }
    };


    useEffect(() => {
      if(session?.user){
        FetchEmployees(parseInt(session.user.companyId, 10));
      }
    },[session,pagination.page,pagination.pageSize]);



    const columns:GridColDef[] = [
        {
            field : 'id',
            headerName : '',
            width:80,
            sortable: false,
            renderCell : ({row}) => {
              return <Avatar sx={{m:1}} alt={row.lastName} src='#' />
            }
        },
        {
            field : 'name',
            headerName : 'Name',
            width:200,
            renderCell : ({row}) => `${row.firstName} ${row.lastName}`
        },
        {
            field : 'email',
            headerName : 'Email',
            width:200,
            renderCell : ({row}) => row.account?.email || ''
        },
        {
            field : 'accessLevel',
            headerName : 'Access Level',
            width:150,
            renderCell : ({row}) => row.account?.accessLevel || ''
        },
        {
            field : 'status',
            headerName : 'Status',
            width:200,
            renderCell : ({row}) => row.account?.status || ''
        },
        {
            field : 'actions',
            headerName : 'Actions',
            width: 150,
            sortable : false,
            filterable : false,
            renderCell: (e:any) => [
              <GridActionsCellItem key={`edit${e.id}`} icon={<Edit color='primary' />} onClick={() => handleUpdate(e.row)} label="Edit" />,
              (session?.user.role === 'admin') && <GridActionsCellItem key={`account${e.id}`} icon={<AccountBoxOutlined color='secondary' />} onClick={() => handleUpdateEmployeeAccount(e.row)} label="Account" />,
              (session?.user.role === 'admin') && <GridActionsCellItem key={`delete${e.id}`} icon={<Delete color='error' />} onClick={() => handleRemove(e.row.id)} label="Delete" />,
            ],
        }
      ]

    const handleUpdate = async (employee:any) => {
      const update:any = await dialogs.open(AddUpdateEmployeeModal,employee);
      console.log('Dialog result:', update);
      if(update !== undefined && update.id){
        FetchEmployees(parseInt(session?.user.companyId || '0', 10));
      }
    }
    const handleAdd = async () => {
      const add:any = await dialogs.open(AddUpdateEmployeeModal, {} as any);
      console.log('Dialog result:', add);
      if(add !== undefined && add.id){
          FetchEmployees(parseInt(session?.user.companyId || '0', 10));
      }
    }

    const handleRemove = async (employeeId:number) => {
        try {
          ShowConfirm({
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete this employee?',
            icon: 'warning',
            fn: async (result : any) => {
                if(result.isConfirmed){
                  await api.post(`/employee/remove/${employeeId}`);
                  FetchEmployees(parseInt(session?.user.companyId || '0', 10));  
                  return;
                }
            }
          });
        } catch (error) {
            console.error("Error removing employee:", error);
            ShowAlert({title: 'Error', text: 'Failed to delete employee.', icon: 'error', isToast: true});
        }
    };

    const handleUpdateEmployeeAccount = async (employee:any) => {
        const update:any = await dialogs.open(UpdateEmployeeAccount,employee.account || {} as any);
        console.log('Dialog result:', update);
        if(update !== undefined && update.id){
            FetchEmployees(parseInt(session?.user.companyId || '0', 10));
        }
    }


    return (    
        <PageContainer>
            <Box sx={{ mb: 4 }}>
          <Grid container justifySelf='flex-end'>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Button variant="contained" onClick={handleAdd} startIcon={<AddOutlined />}>
                Add
              </Button>
            </Grid>
          </Grid>
          <hr />
          <CustomDataGridTable
            data={employeeData}
            columns={columns}
            loading={loading}
            pagination={setPagination}
            rowCount={rowCount}
          />
        </Box>
        </PageContainer>
    );
}

export default EmployeesPage