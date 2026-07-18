import { useEffect, useState } from "react";
import { UserType } from "../../../types/UserType";
import { useNavigate } from "react-router-dom";
import { useUserSettings } from "../../../hooks";
import { API } from "../../../apis";
import {
  Badge,
  Button,
  Col,
  message,
  Popconfirm,
  Row,
  TableColumnsType,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import DataTable from "../../../Components/Common/DataTable";

export enum ADRequestStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED",
}

export enum StudentAdministrativeDocumentType {
  TRANSCRIPT = "TRANSCRIPT",
  ENROLLMENT_CERTIFICATE = "ENROLLMENT_CERTIFICATE",
  INTERNSHIP_REQUEST = "INTERNSHIP_REQUEST",
}

export enum EmployeesAdministrativeDocumentType {
  ADMIN_REPORT = "ADMIN_REPORT",
  BUDGET_REQUEST = "BUDGET_REQUEST",
  SYSTEM_ACCESS = "SYSTEM_ACCESS",

  TEACHING_CERTIFICATE = "TEACHING_CERTIFICATE",
  CLASS_SCHEDULE = "CLASS_SCHEDULE",
  SALARY_SLIP = "SALARY_SLIP",
}

export interface AdminstrativeDocsRequests {
  id: number;
  adDocumentType:
    | StudentAdministrativeDocumentType
    | EmployeesAdministrativeDocumentType;
  status: ADRequestStatus;
  submittedAt: Date;
  updatedAt: Date;

  requesterId: number;
  requesterComment: String;

  handlerId: number;
  handlerComment: String;
}

export const AdminstrativeDocsRequests = () => {
  const navigate = useNavigate();
  const { userType, userId } = useUserSettings();

  const [data, setData] = useState<AdminstrativeDocsRequests[]>([]);

  const [filteredData, setFilteredData] = useState<AdminstrativeDocsRequests[]>(
    []
  );

  useEffect(() => {
    const fetchADRequest = async () => {
      try {
        const adrequests = await API.getList("adrequests");
        setData(adrequests);
      } catch (error) {
        message.error("Could not load aministrative documents requests.");
      }
    };

    const fetchADRequestByRequesterId = async () => {
      try {
        const adrequests = await API.getList(
          "adrequests",
          `baseuser/${userId}`
        );
        setData(adrequests);
      } catch (error) {
        message.error("Could not load requests.");
      }
    };

    if (userType === UserType.Admin) {
      fetchADRequest();
    } else {
      fetchADRequestByRequesterId();
    }
  }, []);

  const handleUpdate = (id: number) => {
    navigate(`/adminstrative-docs/edit/${id}`);
  };

  const handleCreate = () => {
    navigate(`/adminstrative-docs/create`);
  };

  const expandedRowRender = (record: any) => (
    <Row gutter={16} justify={"center"}>
      <Col
        span={8}
        style={{
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          padding: "10px",
        }}
      >
        <h3>Requester Comment</h3>
        <p>{record.requesterComment}</p>
      </Col>
      <Col
        span={8}
        style={{
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          padding: "10px",
        }}
      >
        <h3>Admin Comment</h3>
        <p>{record.adminComment || "No comments yet."}</p>
      </Col>
    </Row>
  );

  const statusResolver = (status: string): string => {
    switch (status) {
      case "OPEN":
        return "blue";
      case "IN_PROGRESS":
        return "orange";
      case "CLOSED":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "grey";
    }
  };

  let columns: TableColumnsType<AdminstrativeDocsRequests> = [
    {
      title: "Requester",
      dataIndex: "requester",
      key: "requester",
      render: (value: any) =>
        value?.id && value?.id !== userId ? (
          <Tag color="geekblue-inverse">
            <b>{value?.cin}</b> - {value?.lastName.toUpperCase()}{" "}
            {value?.firstName.toUpperCase()}
          </Tag>
        ) : (
          <>
            <b>Requested By you</b>
          </>
        ),
    },
    {
      title: "Handler",
      dataIndex: "handler",
      key: "handler",
      render: (value) =>
        value?.id ? (
          <Tag color="blue-inverse">
            <b>{value.cin}</b> - {value.lastName.toUpperCase()}{" "}
            {value.firstName.toUpperCase()}
          </Tag>
        ) : (
          <Tag color="red-inverse">Not Assigned</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => <Badge color={statusResolver(value)} text={value} />,
    },
    {
      title: "Document Type",
      dataIndex: "type",
      key: "type",
      render: (value) => <Tag color="blue-inverse">{value}</Tag>,
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      expandable={{ expandedRowRender }}
      showButton
      addButtonLabel="New Administrative Doc Request"
      onAddButtonClick={() => handleCreate()}
    />
  );
};
