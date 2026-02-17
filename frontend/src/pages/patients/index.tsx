import { useEffect, useState } from "react";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useDialogs } from "@toolpad/core";
import { GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid-pro';

import CustomDataGridTable from "../../components/DataGrid";
import { 
  Edit,
  Delete,
  AddOutlined,
  Add,
 } from '@mui/icons-material';

import { 
  Avatar,
  Box,
  Button,
  Grid

} from '@mui/material';

import AddUpdatePatientModal from "../../components/patients/AddUpdatePatientModal";
import api from "../../utils/axios";
import { useSession } from "../../SessionContext";
import { ShowAlert, ShowConfirm } from "../../utils/sweetAlert";

const PatientsPage = () => {
  const { session  } = useSession();
  
  const dialogs = useDialogs(); 
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState<GridRowsProp>([]);
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({
    page : 0,
    pageSize : 10
  });

  const FetchPatients = async (companyId: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/patient/list?companyId=${companyId}&limit=${pagination.pageSize || 10}&offset=${pagination.pageSize * pagination.page || 0}`);
      console.log("Patients data:", data);
      setRowCount(data.count || 0);
      setPatientData(data.rows || []);
      setLoading(false);
    } catch (error) {
      
    }
  };


  useEffect(() => {
    if(session?.user){
      FetchPatients(parseInt(session.user.companyId, 10));
    }
  }, [pagination, setPagination]);




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
        renderCell : ({row}) => {
          return row.firstName+' '+row.lastName;
        }
    },
    {
        field : 'gender',
        headerName : 'Gender',
        width:100,
        renderCell : ({row}) => {
          return row.gender.charAt(0).toUpperCase() + row.gender.slice(1);
        }
    },
    {
        field : 'dateOfBirth',
        headerName : 'Date of Birth',
        width:150,
        renderCell : ({row}) => {
          return new Date(row.dateOfBirth).toLocaleDateString();
        }
    },
    {
        field : 'startOfCare',
        headerName : 'SOC',
        width:150,
        renderCell : ({row}) => {
          return new Date(row.startOfCare).toLocaleDateString();
        }
    },
    {
        field : 'actions',
        headerName : 'Actions',
        width: 100,
        sortable : false,
        filterable : false,
        renderCell: (e:any) => [
          <GridActionsCellItem key={`edit${e.id}`} icon={<Edit color='primary' />} onClick={() => handleUpdatePatient(e.row)} label="Edit" />,
          (session?.user.role === 'admin') && <GridActionsCellItem key={`delete${e.id}`} icon={<Delete color='error' />} onClick={() => handleRemovePatient(e.row.id)} label="Delete" />
          
        ],
    }
  ]


  const handleAddPatient = async () => {
    const add:any = await dialogs.open(AddUpdatePatientModal,{});
    console.log('Dialog result:', add);
    if(add !== undefined && add.id){
      FetchPatients(parseInt(session?.user.companyId || '0', 10));
    }
  };

  const handleUpdatePatient = async (patient:any) => {
    const update:any = await dialogs.open(AddUpdatePatientModal, patient);
    console.log('Dialog result:', update);
    if( update !== undefined && update.id){
      FetchPatients(parseInt(session?.user.companyId || '0', 10));
    }
  };

  const handleRemovePatient = async (patientId:number) => {
    ShowConfirm({
      title: 'Are you sure?',
      text: 'You will not be able to recover this patient record!',
      icon: 'warning',
      fn: async (result : any) => {
        if(result.isConfirmed){
          try {
            const { data } = await api.post(`/patient/remove/${patientId}`);
            console.log("Patient removed successfully:", data);
            ShowAlert({title: 'Deleted!', text: 'Patient record has been deleted.', icon: 'success', isToast: true});
            FetchPatients(parseInt(session?.user.companyId || '0', 10));
          } catch (error) {
            console.error("Error removing patient:", error);   
            ShowAlert({title: 'Error', text: 'Failed to delete patient record.', icon: 'error', isToast: true});
          }
        }
      }
    });

  }

  return <PageContainer>

      <Box sx={{ mb: 4 }}>
          <Grid container justifySelf='flex-end'>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Button variant="contained" onClick={handleAddPatient} startIcon={<AddOutlined />}>
                Add
              </Button>
            </Grid>
          </Grid>
          <hr />
          <CustomDataGridTable
            data={patientData}
            columns={columns}
            loading={loading}
            pagination={setPagination}
            rowCount={rowCount}
          />
        </Box>

  </PageContainer>;
}

export default PatientsPage;