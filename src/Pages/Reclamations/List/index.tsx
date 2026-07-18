import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Col, Popconfirm, Row, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import DataTable from "../../../Components/Common/DataTable";
import { useUserSettings } from "../../../hooks";
import { UserType } from "../../../types/UserType";

export enum ReclamationContextEnum {
  GradeReevaluation = "Appeal for Grade Re-evaluation",
  AccessToExamPapers = "Request for Access to Corrected Exam Papers",
  MissingCourseMaterials = "Reclamation About Missing Course Materials",
  LabEquipmentIssue = "Complaint About Lack of Laboratory Equipment or Access",
  LibraryResourcesIssue = "Reclamation About Unavailable Library Resources",
  InstructorBehavior = "Complaint About Instructor's Behavior or Teaching Quality",
  IrregularScheduling = "Reclamation About Irregular Course Scheduling",
  ClassCancellation = "Complaint Regarding Class Cancellations Without Notice",
  TimetableModification = "Request for Timetable Modification",
  ExamScheduleConflict = "Complaint About Exam Schedule Conflicts",
  StudentRecordError = "Reclamation About Errors in Student Records",
  FacilityIssue = "Complaint About Classroom or Campus Facilities",
  PortalIssue = "Reclamation Regarding Wi-Fi or Online Portal Issues",
}

export interface Reclamation {
  id: number;
  title: string;
  reclamationContext: ReclamationContextEnum;
  response: string;
  description: string;
  submittedAt: Date;
  updatedAt: Date;
  status: string;
}

export enum ReclamationStatusEnum {
  Pending = "Pending",
  InProgress = "InProgress",
  Approved = "Approved",
  Rejected = "Rejected",
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
  const { userType } = useUserSettings();

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

  const statusTagColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "orange";
      case "In Progress":
        return "blue";
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "default";
    }
  };

  const columns: TableColumnsType<Reclamation> = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "reclamationContext",
      dataIndex: "reclamationContext",
      key: "reclamationContext",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusTagColor(status)}>{status}</Tag>,
    },
    {
      title: "",
      key: "edit",
      render: (_, record) =>
        userType === UserType.Student ? (
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit(record.id)}
          />
        ) : (
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit(record.id)}
          />
        ),
    },
    {
      title: "",
      key: "delete",
      render: (_, record) =>
        userType === UserType.Student ? (
          <Popconfirm
            title="Supprimer cette réclamation ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        ) : (
          <></>
        ),
    },
  ];

  const expandedRowRender = (record: Reclamation) => (
    <Row gutter={16} justify={"center"}>
      <Col
        span={8}
        style={{
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          padding: "10px",
        }}
      >
        <h3>Description</h3>
        <p>{record.description}</p>
      </Col>
      <Col
        span={8}
        style={{
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          padding: "10px",
        }}
      >
        <h3>Response</h3>
        <p>{record.response || "No response yet."}</p>
      </Col>
    </Row>
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      expandable={{ expandedRowRender }}
      showButton={userType !== UserType.Admin}
      onAddButtonClick={() => handleAddNew()}
      addButtonLabel="+ Add Reclamation"
    />
  );
};
