import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, TableColumnsType, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DataTable from "../../../Components/Common/DataTable";
import { API } from "../../../apis";

export enum TypeBacEnum {
  SMA = "SMA ",
  SMB = " SMB",
  PC = "  PC",
  SVT = " SVT",
}

export interface Student {
  id: number;
  studentCode: String;
  fname: string;
  lname: string;
  cin: string;
  cne: string;
  birthDate: string;
  inscriptionDate: string;
  typeBac: TypeBacEnum;
  fieldId: number;
}

export const Students = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Student[]>([]);

  const handleUpdate = (id: number) => {
    navigate(`/students/edit/${id}`);
  };

  const handleRemove = async (id: number) => {
    try {
      await API.remove("students", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Student deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete student.");
    }
  };

  const columns: TableColumnsType<Student> = [
    {
      title: "Student Code",
      dataIndex: "studentCode",
      key: "studentCode",
      render: (code: string) => <b>{code}</b>,
    },
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
      title: "cne",
      dataIndex: "cne",
      key: "cne",
      render: (cne: string) => <b>{cne}</b>,
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
      title: "typeBac",
      dataIndex: "typeBac",
      key: "typeBac",
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
          title="Would you like to delete this student?"
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
    const fetchStudents = async () => {
      try {
        const students = await API.getList("students");
        console.log("API returned students:", students);
        setData(students);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        message.error("Could not load students.");
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <DataTable
        columns={[...columns]}
        data={data}
        expandable={{}}
        showButton={true}
        onAddButtonClick={() => navigate("/students/create")}
        addButtonLabel="+ Add Student"
      />
    </div>
  );
};
