import type { TableColumnsType } from "antd";
import { Button, Table } from "antd";

const DataTable = ({
  columns,
  data,
  expandable,
  showButton = false,
  onAddButtonClick,
  addButtonLabel = "Add",
}: {
  columns: TableColumnsType<any>;
  data: any[];
  expandable?: any; // the expandable logic to pass in from parent
  showButton?: boolean; // optional prop to show button
  onAddButtonClick?: () => void;
  addButtonLabel?: string; // optional prop for button label
}) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 16,
      }}
    >
      {showButton && (
        <Button type="primary" onClick={onAddButtonClick}>
          {addButtonLabel}
        </Button>
      )}
    </div>
    <Table<any>
      columns={columns}
      dataSource={data}
      expandable={expandable} // Pass expandable prop here
      rowKey="id" // Ensure each row has a unique key
    />
  </div>
);

export default DataTable;
