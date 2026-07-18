import { Button, Card, Divider, Form, Input, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { useUserSettings } from "../../../hooks";
import { UserType } from "../../../types/UserType";
import {
  ADRequestStatus,
  EmployeesAdministrativeDocumentType,
  StudentAdministrativeDocumentType,
} from "../List";

export const ADRequestEditor = () => {
  const { userType, userId } = useUserSettings();
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const [adminstrativeDocs, setAdminstrativeDocs] = useState<any>(null);
  const [handlers, setHandlers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: any) => {
    const payload = {
      type: values.adDocumentType,
      handlerComment: values.handlerComment || "",
      requesterComment: values.requesterComment,
      status: values.status || ADRequestStatus.OPEN,
      requesterId: userId,
      handlerId: values.handler || null,
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    if (isCreateMode) {
      API.create("adrequests", payload).then(() => {
        // navigate("/adminstrative-docs");
      });
    } else {
      API.update("adrequests", payload).then(() => {
        // navigate("/adminstrative-docs");
      });
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const admins = await API.getList("admins");
        console.log("API returned admins:", admins);
        setHandlers(admins);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
        message.error("Could not load admins.");
      }
    };

    setAdminstrativeDocs(
      userType === UserType.Admin || userType === UserType.Teacher
        ? EmployeesAdministrativeDocumentType
        : StudentAdministrativeDocumentType
    );
    if (userType === UserType.Admin) {
      fetchAdmins();
    }
    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const numId = Number(idFromPath);
      setId(numId);
      API.getOne("adrequests", numId)
        .then((response) => {
          form.setFieldsValue({
            adDocumentType: response.type,
            requesterComment: response.requesterComment,
            status: response.status || ADRequestStatus.OPEN,
            handlerComment: response.handlerComment || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching adrequests data", error);
        });
    }
  }, [form, isCreateMode, location.pathname]);

  return (
    <Card title={isCreateMode ? "New" : "Edit"} variant="borderless">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        form={form}
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Document type"
          name="adDocumentType"
          rules={[{ required: true, message: "Please select a document type" }]}
        >
          <Select
            placeholder="Select a reclamationContext"
            disabled={userType === UserType.Admin}
          >
            {adminstrativeDocs &&
              Object.keys(adminstrativeDocs).map((adDocumentType) => (
                <Select.Option key={adDocumentType} value={adDocumentType}>
                  {adminstrativeDocs[adDocumentType as any]}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Requester comment"
          name="requesterComment"
          rules={[
            {
              required: true,
              message: "Please leave a comment about the request",
            },
          ]}
        >
          <TextArea rows={4} disabled={userType === UserType.Admin} />
        </Form.Item>

        <Divider />

        <Form.Item
          label="Status"
          name="status"
          rules={[
            {
              required: userType === UserType.Admin,
              message: "Please set a status",
            },
          ]}
        >
          <Select
            placeholder="Select a status"
            disabled={
              userType === UserType.Student || userType === UserType.Teacher
            }
          >
            {Object.keys(ADRequestStatus).map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {userType === UserType.Admin && (
          <Form.Item label="Handler" name="handler">
            <Select placeholder="Select a Handler">
              {handlers.map((handler: any) => (
                <Select.Option key={handler.id} value={handler.id}>
                  {handler.cin} - {handler.firstName} {handler.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Handler Comment"
          name="handlerComment"
          rules={[
            {
              required: userType === UserType.Admin,
              message: "Please leave a comment about the request",
            },
          ]}
        >
          <TextArea
            rows={4}
            disabled={
              userType === UserType.Student || userType === UserType.Teacher
            }
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {isCreateMode
              ? "Create"
              : userType === UserType.Admin
              ? "Submit Response"
              : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
