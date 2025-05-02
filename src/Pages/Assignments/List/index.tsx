// import { useNavigate } from "react-router-dom";

import { TableColumnsType, Tag } from "antd";
import DataTable from "../../../Components/Common/DataTable";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export interface Assignment {
  id: number;
  title: string;
  description: string;
  submittedAt: string;
  updatedAt: string;
  status: string;
  link: string;
  subject: string;
  dueDate: string;
}

export const Assignments = () => {
  // const navigate = useNavigate();
  const handleEdit = (id: number) => {
    // navigate(`/reclamations/${id}`);
  };

  const columns: TableColumnsType<Assignment> = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Link", dataIndex: "link", key: "link" },
    { title: "DueDate", dataIndex: "dueDate", key: "dueDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "red" : "green"}>{status}</Tag>
      ),
    },
    { title: "UpdatedAt", dataIndex: "updatedAt", key: "updatedAt" },
    { title: "SubmittedAt", dataIndex: "submittedAt", key: "submittedAt" },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: () => <EditOutlined style={{ cursor: "pointer" }} />,
    },
    {
      title: "",
      dataIndex: "",
      key: "y",
      render: () => (
        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
      ),
    },
  ];

  const data: Assignment[] = [
    {
      id: 1,
      title: "Assignment 1",
      description: "Description 1",
      submittedAt: "2023-01-01",
      updatedAt: "2023-01-02",
      status: "Pending",
      link: "http://example.com/assignment1",
      subject: "Math",
      dueDate: "2023-01-10",
    },
    {
      id: 2,
      title: "Assignment 2",
      description: "Description 2",
      submittedAt: "2023-01-03",
      updatedAt: "2023-01-04",
      status: "Resolved",
      link: "http://example.com/assignment2",
      subject: "Science",
      dueDate: "2023-01-15",
    },
  ];

  return <DataTable columns={columns} data={data} />;
};
