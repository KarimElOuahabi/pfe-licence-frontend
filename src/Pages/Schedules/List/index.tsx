import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  message,
  Popconfirm,
  Select,
  TableColumnsType,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import DataTable from "../../../Components/Common/DataTable";
import { UserType } from "../../../types/UserType";
import { useUserSettings } from "../../../hooks";

// TYPES
export interface Schedule {
  id: number;
  title: string;
  field: {
    id: number;
    name: string;
  };
}

export interface Department {
  id: number;
  name: string;
}

export interface Field {
  id: number;
  name: string;
  academicLevel: string;
  department: {
    id: number;
    name: string;
  };
}

export const Schedules = () => {
  const navigate = useNavigate();
  const { userType } = useUserSettings();

  const [data, setData] = useState<Schedule[]>([]);
  const [filteredData, setFilteredData] = useState<Schedule[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [selectedField, setSelectedField] = useState<number | null>(null);

  // FETCH DATA
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedules = await API.getList("schedules");
        setData(schedules);
        setFilteredData(schedules);
      } catch (error) {
        message.error("Could not load schedules.");
      }
    };

    const fetchDepartments = async () => {
      try {
        const deps = await API.getList("departments");
        setDepartments(deps);
      } catch (error) {
        message.error("Failed to load departments.");
      }
    };

    const fetchFields = async () => {
      try {
        const fields = await API.getList("fields");
        setFields(fields);
      } catch (error) {
        message.error("Failed to load fields.");
      }
    };

    fetchSchedules();
    fetchDepartments();
    fetchFields();
  }, []);

  // FILTER
  useEffect(() => {
    let filtered = data;

    if (selectedField !== null) {
      filtered = filtered.filter(
        (schedule) => schedule.field.id === selectedField
      );
    } else if (selectedDepartment !== null) {
      filtered = filtered.filter((schedule) => {
        const field = fields.find((f) => f.id === schedule.field.id);
        return field?.department.id === selectedDepartment;
      });
    }

    setFilteredData(filtered);
  }, [selectedDepartment, selectedField, data, fields]);

  // ACTIONS
  const handleRemove = async (id: number) => {
    try {
      await API.remove("schedules", id);
      const updated = data.filter((item) => item.id !== id);
      setData(updated);
      setFilteredData(updated);
      message.success("Schedule deleted successfully.");
    } catch (error) {
      message.error("Failed to delete schedule.");
    }
  };

  const handleUpdate = (id: number) => {
    navigate(`/schedules/edit/${id}`);
  };

  // BASE COLUMNS
  const baseColumns: TableColumnsType<Schedule> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      render: (field) => <>{field.name}</>,
    },
  ];

  // ACTION COLUMNS
  const editDeleteColumns: TableColumnsType<Schedule> = [
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
          title="Would you like to delete this schedule?"
          onConfirm={() => handleRemove(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
        </Popconfirm>
      ),
    },
  ];

  const eyeColumn: TableColumnsType<Schedule> = [
    {
      title: "",
      key: "open",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/schedules/view/${record.id}`)}
          style={{ padding: 0 }}
        >
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  // COMPONENTS
  const DepartmentAndFieldFilter = (
    <Card title="Select your Department/Field" style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Select
          placeholder="Select Department"
          style={{ width: 300 }}
          onChange={(value) => {
            setSelectedDepartment(value);
            setSelectedField(null);
          }}
          allowClear
          value={selectedDepartment ?? undefined}
        >
          {departments.map((dept) => (
            <Select.Option key={dept.id} value={dept.id}>
              {dept.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Select Field"
          style={{ width: 300 }}
          onChange={(value) => setSelectedField(value)}
          value={selectedField ?? undefined}
          disabled={!selectedDepartment}
          allowClear
        >
          {fields
            .filter(
              (field) =>
                Number(field.department.id) === Number(selectedDepartment)
            )
            .map((field) => (
              <Select.Option key={field.id} value={field.id}>
                {field.name}
              </Select.Option>
            ))}
        </Select>
      </div>
    </Card>
  );

  const columnsForStudent = [...baseColumns, ...eyeColumn];
  const columnsForAdmin = [...baseColumns, ...editDeleteColumns, ...eyeColumn];

  const ScheduleList = (
    columns: TableColumnsType<Schedule>,
    showAdd: boolean
  ) => (
    <div>
      {DepartmentAndFieldFilter}
      <DataTable
        columns={columns}
        data={filteredData}
        expandable={{}}
        showButton={showAdd}
        onAddButtonClick={() => navigate("/Schedules/create")}
        addButtonLabel={
          <>
            <PlusOutlined style={{ marginRight: 6 }} />
            Add Schedule
          </>
        }
      />
    </div>
  );

  // RENDER
  const usersDisplay = (userType: UserType) => {
    switch (userType) {
      case "Student":
        return ScheduleList(columnsForStudent, false);
      case "Admin":
        return ScheduleList(columnsForAdmin, true);
      default:
        return <div>Unknown user type</div>;
    }
  };

  return usersDisplay(userType);
};
