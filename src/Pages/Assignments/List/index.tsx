import React, { useEffect, useState } from "react";
import { TableColumnsType, Tag, Button, message, Popconfirm } from "antd";
import DataTable from "../../../Components/Common/DataTable";
import { useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export interface Assignment {
  id: number;
  title: string;
  description: string;
  submittedAt: string;
  updatedAt: string;
  status: string;
  subject: string;
  dueDate: string;
}

type UserType = "Student" | "Professor";

export const Assignments = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignments = await API.getList("assignments");
        console.log("API returned assignments:", assignments);
        setData(assignments);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        message.error("Could not load assignments.");
      }
    };

    fetchAssignments();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await API.remove("assignments", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Assignment deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete assignment.");
    }
  };

  const handleUpdate = (id: number) => {
    navigate(`/assignments/edit/${id}`);
  };

  const columns: TableColumnsType<Assignment> = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "red" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
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
          title="Would like to delete this assignment ?"
          onConfirm={() => handleRemove(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
        </Popconfirm>
      ),
    },
  ];

  const StudentAssignmentList = (
    <DataTable
      columns={[
        ...columns.filter((col) => col.key !== "edit" && col.key !== "delete"),
        {
          title: "Open",
          key: "open",
          render: (_, record) => (
            <Button
              type="link"
              onClick={() => navigate(`/assignments/view/${record.id}`)}
              style={{ padding: 0 }}
            >
              &gt;|
            </Button>
          ),
        },
      ]}
      data={data}
      expandable={{}}
    />
  );

  const ProfessorAssignmentList = (
    <DataTable
      columns={[...columns]}
      data={data}
      expandable={{}}
      showButton={true}
      onAddButtonClick={() => navigate("/assignments/create")}
      addButtonLabel="+ Add Assignment"
    />
  );

  const usersDisplay = (userType: UserType) => {
    switch (userType) {
      case "Student":
        return StudentAssignmentList;
      case "Professor":
        return ProfessorAssignmentList;
      default:
        return <div>Unknown user type</div>;
    }
  };

  return usersDisplay("Student"); // Change to "Student" or "Professor" as needed
};
