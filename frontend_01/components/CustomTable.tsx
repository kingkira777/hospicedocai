import { Table, type TableProps } from 'antd';

type CustomTableProps = {
    loading?: boolean;
    columns: TableProps<any>['columns'];
    dataSource: any[];
}


export default function CustomTable({ loading, columns, dataSource }: CustomTableProps) {

    return (
        <Table 
            loading={loading} 
            dataSource={dataSource} 
            columns={columns} 
            pagination={false} 
            rowKey={(record) => record.id}    
        />
    )   
}