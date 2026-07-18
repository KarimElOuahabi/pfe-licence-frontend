import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, TableColumnsType, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DataTable from "../../../Components/Common/DataTable";
import { API } from "../../../apis";


export interface Teacher {
  id: number;
  fname: string;
  lname: string;
  cin: string;
  birthDate: string;
  inscriptionDate: string;
  fieldId: number;
}

export const Teachers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Teacher[]>([]);

  const handleUpdate = (id: number) => {
    navigate(`/teachers/edit/${id}`);
  };

  const handleRemove = async (id: number) => {
    try {
      await API.remove("teachers", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Teacher deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete teacher.");
    }
  };

  const columns: TableColumnsType<Teacher> = [
    { title: "id", dataIndex: "id", key: "id" },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "fname"
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
      title: "Date of Inscription",
      dataIndex: "inscriptionDate",
      key: "inscriptionDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      render: (field: any) => (
        <Tag>
          {field.name} / {field.department.name}
        </Tag>
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
          title="Would you like to delete this teacher?"
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
    const fetchTeachers = async () => {
      try {
        const teachers = await API.getList("teachers");
        console.log("API returned teachers:", teachers);
        setData(teachers);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
        message.error("Could not load teachers.");
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div>
      <DataTable
        columns={[...columns]}
        data={data}
        expandable={{}}
        showButton={true}
        onAddButtonClick={() => navigate("/teachers/create")}
        addButtonLabel="+ Add Teacher"
      />
    </div>
  );
};
