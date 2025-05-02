import type { TableColumnsType } from "antd";
import { Table } from "antd";

const DataTable = ({
  columns,
  data,
}: {
  columns: TableColumnsType<any>;
  data: any[];
}) => (
  <Table<any>
    columns={columns}
    expandable={{
      expandedRowRender: (record) => (
        <p style={{ margin: 0 }}>{record.description}</p>
      ),
      rowExpandable: (record) => record.name !== "Not Expandable",
    }}
    dataSource={data}
  />
);

export default DataTable;
