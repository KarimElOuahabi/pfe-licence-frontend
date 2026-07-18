import { Button, Card, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { useUserSettings } from "../../../hooks";
import {
  Reclamation,
  ReclamationContextEnum,
  ReclamationStatusEnum,
} from "../List";
import { UserType } from "../../../types/UserType";

export const ReclamationsEditor = () => {
  const { userType } = useUserSettings();
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Reclamation) => {
    const payload = {
      title: values.title || "",
      reclamationContext: values.reclamationContext,
      response: values.response,
      status: values.status || ReclamationStatusEnum.Pending,
      description: values.description || "",
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    if (isCreateMode) {
      API.create("reclamations", payload).then(() => {
        navigate("/reclamations");
      });
    } else {
      API.update("reclamations", payload).then(() => {
        navigate("/reclamations");
      });
    }
  };

  useEffect(() => {
    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const numId = Number(idFromPath);
      setId(numId);
      API.getOne("reclamations", numId)
        .then((response) => {
          form.setFieldsValue({
            title: response.title,
            reclamationContext: response.reclamationContext,
            response: response.response,
            status: response.status,
            description: response.description,
          });
        })
        .catch((error) => {
          console.error("Error fetching reclamation data", error);
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
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input the title" }]}
        >
          <Input disabled={userType === UserType.Admin} />
        </Form.Item>

        <Form.Item
          label="Reclamation Context"
          name="reclamationContext"
          rules={[
            { required: true, message: "Please select a reclamation context" },
          ]}
        >
          <Select
            placeholder="Select a reclamationContext"
            disabled={userType === UserType.Admin}
          >
            {Object.keys(ReclamationContextEnum).map((reclamationContext) => (
              <Select.Option
                key={reclamationContext}
                value={reclamationContext}
              >
                {
                  ReclamationContextEnum[
                    reclamationContext as keyof typeof ReclamationContextEnum
                  ]
                }
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please describe the issue" }]}
        >
          <TextArea rows={4} disabled={userType === UserType.Admin} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please set a status" }]}
        >
          <Select placeholder="Select a status" disabled={userType === UserType.Student}>
            {Object.keys(ReclamationStatusEnum).map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Response"
          name="response"
          rules={[{ required: true, message: "Please describe the issue" }]}
        >
          <TextArea rows={4}  disabled={userType === UserType.Student}/>
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
