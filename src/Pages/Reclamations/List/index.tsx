// import { useNavigate } from "react-router-dom";

import { TableColumnsType } from "antd";
import DataTable from "../../../Components/Common/DataTable";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export interface Reclamation {
  id: number;
  title: string;
  description: string;
  submittedAt: string;
  updatedAt: string;
  status: string;
}

export const Reclamations = () => {
  // const navigate = useNavigate();
  const handleEdit = (id: number) => {
    // navigate(`/reclamations/${id}`);
  };

  const columns: TableColumnsType<Reclamation> = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "SubmittedAt", dataIndex: "submittedAt", key: "submittedAt" },
    { title: "UpdatedAt", dataIndex: "updatedAt", key: "updatedAt" },
    { title: "Status", dataIndex: "status", key: "status" },
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

  const data: Reclamation[] = [
    {
      id: 1,
      title: "Reclamation 1",
      description: "Description 1",
      submittedAt: "2023-01-01",
      updatedAt: "2023-01-02",
      status: "Pending",
    },
    {
      id: 2,
      title: "Reclamation 2",
      description: "Description 2",
      submittedAt: "2023-01-03",
      updatedAt: "2023-01-04",
      status: "Resolved",
    },
  ];

  return <DataTable columns={columns} data={data} />;
};
