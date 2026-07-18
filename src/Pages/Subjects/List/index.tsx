import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, Select, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import DataTable from "../../../Components/Common/DataTable"; // Import DataTable component
import { API } from "../../../apis";

export enum SemesterEnum {
  S1 = "S1",
  S2 = "S2",
  S3 = "S3",
  S4 = "S4",
  S5 = "S5",
  S6 = "S6",
}

export interface Subject {
  id: number;
  name: string;
  semester: SemesterEnum;
  teacherId: number;
  fieldId: number;
}

export const Subjects = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState<Subject[]>([]);

  const handleUpdate = (id: number) => {
    navigate(`/subjects/edit/${id}`);
  };

  const handleRemove = async (id: number) => {
    try {
      await API.remove("subjects", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Subject deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete subject.");
    }
  };

  const columns: TableColumnsType<Subject> = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "name", dataIndex: "name", key: "name" },
    { 
      title: "teacher",
      dataIndex: "teacher",
      key: "teacher",
      render: (teacher) => <>{teacher.firstName} {teacher.lastName}</>,
    },
    {
      title: "semester",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "field",
      dataIndex: "field",
      key: "field",
      render: (field) => <>{field.name}</>,
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
          title="Would like to delete this subject ?"
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
    const fetchSubjects = async () => {
      try {
        const subjects = await API.getList("subjects");
        console.log("API returned subjects:", subjects);
        setData(subjects);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        message.error("Could not load subjects.");
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div>
      <DataTable
        columns={[...columns]}
        data={data}
        expandable={{}}
        showButton={true}
        onAddButtonClick={() => navigate("/subjects/create")}
        addButtonLabel="+ Add Subject"
      />
    </div>
  );
};
