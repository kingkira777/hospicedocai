import { useEffect, useState } from 'react';
import { 
    DataGridPro, 
    GridRowsProp, 
    GridColDef, 
    GridToolbar  
} from '@mui/x-data-grid-pro';

type Props = {
    data : GridRowsProp
    columns : GridColDef[] | []
    rowCount?: number
    loading : boolean | undefined
    pagination?: (model: any) => void
    actions? : string[] | null
}



const CustomDataGridTable = ({ data, columns, rowCount, loading, pagination, actions = ['actions']} : Props) => {
    const [paginationModel, setPaginationModel]:any = useState({
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        if (pagination) {
            pagination(paginationModel);
        }
    },[paginationModel,loading]);


    return(
        <div style={{ height: 500, width: '100%' }}>
            <DataGridPro 
                loading={loading}
                pagination
                rows={data} 
                columns={columns} 
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{
                    toolbar: GridToolbar
                }}
                slotProps={{
                    loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                    },
                }}
                rowCount={rowCount}
                pageSizeOptions={[5,10,20,50,100]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                initialState={{
                    pinnedColumns: { right: actions ? actions : ['actions'] },
                }}
            />
        </div>
    )
};

export default CustomDataGridTable;