import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Popconfirm } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../Components/Common/DataTable";
import { UserType } from "../../../Components/types/UserType";
import { API } from "../../../apis";

export interface Reclamation {
  id: number;
  title: string;
  description: string;
  submittedAt: Date;
  updatedAt: Date;
  status: string;
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const Reclamations = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Reclamation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reclamations = await API.getList("reclamations");
        setData(reclamations);
      } catch (error) {
        console.error("Failed to fetch reclamations:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = () => {
    navigate("create");
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await API.remove("reclamations", id);
      if (response) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate("edit/" + id);
  };

  const columns: TableColumnsType<Reclamation> = [
    { title: "Title", dataIndex: "title", key: "title" },
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
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "",
      key: "edit",
      render: (_, record) => (
        <EditOutlined
          style={{ cursor: "pointer" }}
          onClick={() => handleEdit(record.id)}
        />
      ),
    },
    {
      title: "",
      key: "delete",
      render: (_, record) => (
        <Popconfirm
          title="Supprimer cette réclamation ?"
          onConfirm={() => handleDelete(record.id)}
          okText="Oui"
          cancelText="Non"
        >
          <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
        </Popconfirm>
      ),
    },
  ];

  const expandedRowRender = (record: Reclamation) => (
    <div style={{ margin: 0 }}>
      <strong>Description :</strong>
      <p>{record.description}</p>
    </div>
  );

  const usersDisplay = (userType: UserType) => {
    switch (userType) {
      case "Student":
        return StudentReclamationsList;
      case "Professor":
        return ProfessorReclamationList;
      case "Admin":
        return AdminReclamationList;
      default:
        return <div>Unknown user type</div>;
    }
  };

  const StudentReclamationsList = (
    <DataTable
      columns={columns}
      data={data}
      expandable={{ expandedRowRender }}
      showButton={true}
      onAddButtonClick={() => handleAddNew()}
      addButtonLabel="+ Add Reclamation"
    />
  );

  const ProfessorReclamationList = (
    <DataTable
      columns={columns}
      data={data}
      expandable={{ expandedRowRender }}
    />
  );

  const AdminReclamationList = <>ADMIN LIST</>;

  return usersDisplay("Student");
};
