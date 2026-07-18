import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, Select, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import DataTable from "../../../Components/Common/DataTable"; // Import DataTable component
import { API } from "../../../apis";

export enum AcademicLevelEnum {
  DEUG = "DEUG",
  LISENCE = "LISENCE",
  MASTER = "MASTER",
  DOCTORAT = "DOCTORAT",
}

export interface Field {
  id: number;
  name: string;
  academicLevel: AcademicLevelEnum;
  departmentId: number;
}

export const Fields = () => {
  const navigate = useNavigate(); // Initialize navigate for routing
  const [data, setData] = useState<Field[]>([]);

  const handleUpdate = (id: number) => {
    // Navigate to the update page with the field ID
    navigate(`/fields/edit/${id}`);
  };

  const handleRemove = async (id: number) => {
    try {
      await API.remove("fields", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Field deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete field.");
    }
  };

  // Define the columns for the DataTable
  const columns: TableColumnsType<Field> = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "name", dataIndex: "name", key: "name" },
    {
      title: "academic level",
      dataIndex: "academicLevel",
      key: "academicLevel",
    },
    {
      title: "department",
      dataIndex: "department",
      key: "department",
      render: (department) => (
        <>{department.name}</>
      ),
    },
    {
      title: "",
      key: "edit",
      render: (_, record) => (
        <EditOutlined
          style={{ cursor: "pointer" }}
          onClick={() => handleUpdate(record.id)}
        />
      ),
    },
    {
      title: "",
      key: "delete",
      render: (_, record) => (
        <Popconfirm
          title="Would like to delete this field ?"
          onConfirm={() => handleRemove(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fields = await API.getList("fields");
        console.log("API returned fields:", fields);
        setData(fields);
      } catch (error) {
        console.error("Failed to fetch fields:", error);
        message.error("Could not load fields.");
      }
    };

    fetchFields();
  }, []);

  return (
    <div>
      {/* Using the DataTable component here */}
      <DataTable
        columns={[...columns]}
        data={data}
        expandable={{}}
        showButton={true}
        onAddButtonClick={() => navigate("/fields/create")}
        addButtonLabel="+ Add Field"
      />
    </div>
  );
};
