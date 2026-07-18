import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, TableColumnsType, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DataTable from "../../../Components/Common/DataTable";
import { API } from "../../../apis";

export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  cin: string;
}

export const Admins = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Admin[]>([]);

  const handleUpdate = (id: number) => {
    navigate(`/admins/edit/${id}`);
  };

  const handleRemove = async (id: number) => {
    try {
      await API.remove("admins", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Admin deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete admin.");
    }
  };

  const columns: TableColumnsType<Admin> = [
    { title: "id", dataIndex: "id", key: "id" },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "fname",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lname",
    },
    {
      title: "cin",
      dataIndex: "cin",
      key: "cin",
      render: (cin: string) => <b>{cin}</b>,
    },
    {
      title: "Date of Birth",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
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
          title="Would you like to delete this admin?"
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
    const fetchAdmins = async () => {
      try {
        const admins = await API.getList("admins");
        console.log("API returned admins:", admins);
        setData(admins);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
        message.error("Could not load admins.");
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div>
      <DataTable
        columns={[...columns]}
        data={data}
        expandable={{}}
        showButton={true}
        onAddButtonClick={() => navigate("/admins/create")}
        addButtonLabel="+ Add Admin"
      />
    </div>
  );
};
