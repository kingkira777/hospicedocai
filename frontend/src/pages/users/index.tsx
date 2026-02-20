import { PageContainer } from "@toolpad/core";
import React, { useState, useEffect } from 'react';
import { 
    Box, Container, Typography, Paper, Grid, Autocomplete, TextField,
    Chip, Stack, styled, Avatar, Button
} from '@mui/material';
import { Edit, Delete, AddOutlined } from "@mui/icons-material";
import { GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { useSession } from "../../SessionContext";
import { useDialogs } from "@toolpad/core";
import CustomDataGridTable from "../../components/DataGrid";
import AddUpdateUserModal from "../../components/users/AddUpdateUserModal";
import api from "../../utils/axios";

const UserPage = () => {
    const { session  } = useSession();
  
    const dialogs = useDialogs(); 

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<GridRowsProp>([]);
    const [rowCount, setRowCount] = useState(0);
    const [pagination, setPagination] = useState({
        page : 0,
        pageSize : 10
    });


    const FetchUsers = async (companyId: number) => {
      try {
        setLoading(true);
        const { data } = await api.get(`/user/list?companyId=${companyId}&userId=${session?.user?.id}&limit=${pagination.pageSize || 10}&offset=${pagination.pageSize * pagination.page || 0}`);
        console.log("Users data:", data);
        setRowCount(data.count || 0);
        setUserData(data.rows || []);
        setLoading(false);
      } catch (error) {
        
      }
    };


    useEffect(() => {
      if(session?.user){
        FetchUsers(parseInt(session.user.companyId, 10));
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
            field : 'email',
            headerName : 'Email',
            width:200,
        },
        {
            field : 'role',
            headerName : 'Role',
            width:150,
        },
        {
            field : 'company',
            headerName : 'Company',
            width:200,
            renderCell : ({row}) => row.company.name
        },
        {
            field : 'actions',
            headerName : 'Actions',
            width: 100,
            sortable : false,
            filterable : false,
            renderCell: (e:any) => [
              <GridActionsCellItem key={`edit${e.id}`} icon={<Edit color='primary' />} onClick={() => handleUpdate(e.row)} label="Edit" />,
              <GridActionsCellItem key={`delete${e.id}`} icon={<Delete color='error' />} onClick={() => console.log(e.row.id)} label="Delete" />,
            ],
        }
      ]

    const handleUpdate = async (user:any) => {
      const update:any = await dialogs.open(AddUpdateUserModal,user);
      console.log('Dialog result:', update);
      if(update && update.id){
        FetchUsers(parseInt(session?.user.companyId || '0', 10));
      }
    }
    const handleAdd = async () => {
      const add:any = await dialogs.open(AddUpdateUserModal,{});
      console.log('Dialog result:', add);
      if(add.id){
        FetchUsers(parseInt(session?.user.companyId || '0', 10));
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
            data={userData}
            columns={columns}
            loading={loading}
            pagination={setPagination}
            rowCount={rowCount}
          />
        </Box>
        </PageContainer>
    );
}

export default UserPage