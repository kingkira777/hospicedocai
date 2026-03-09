import { Table, type TableProps } from 'antd';

type TablePatientsProps = {
    columns: TableProps<any>['columns'];
    dataSource: any[];
    /**
     * Optional rowKey used by antd Table to assign a unique key to each row.
     * Defaults to 'id' but can be overridden if the items use a different field
     * or a function is needed.
     */
    rowKey?: string | ((record: any) => React.Key);
}

export default function TablePatients({ columns, dataSource, rowKey = 'id' }: TablePatientsProps) {
    return (
        <Table dataSource={dataSource} columns={columns} pagination={false} rowKey={rowKey} />
    );
}