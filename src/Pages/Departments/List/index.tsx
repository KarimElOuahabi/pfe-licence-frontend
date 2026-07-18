import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, Select, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import DataTable from "../../../Components/Common/DataTable"; // Import DataTable component
import { API } from "../../../apis";

export interface Department {
  id: number;
  name: string;
}

export const Departments = () => {
  const navigate = useNavigate(); // Initialize navigate for routing
  const [data, setData] = useState<Department[]>([]);

  const handleUpdate = (id: number) => {
    // Navigate to the update page with the department ID
    navigate(`/departments/edit/${id}`);
  };

  const handleRemove = async (id: number) => {
    try {
      await API.remove("departments", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Department deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete department.");
    }
  };

  // Define the columns for the DataTable
  const columns: TableColumnsType<Department> = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "name", dataIndex: "name", key: "name" },
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
          title="Would like to delete this department ?"
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
    const fetchDepartments = async () => {
      try {
        const departments = await API.getList("departments");
        console.log("API returned departments:", departments);
        setData(departments);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        message.error("Could not load departments.");
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div>
      {/* Using the DataTable component here */}
      <DataTable
        columns={[...columns]}
        data={data}
        expandable={{}}
        showButton={true}
        onAddButtonClick={() => navigate("/departments/create")}
        addButtonLabel="+ Add Department"
      />
    </div>
  );
};
