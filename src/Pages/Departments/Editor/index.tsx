import { Button, Card, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { Department } from "../List";

export const DepartmentEditor = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Department) => {
    const payload = {
      name: values.name || "",
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    if (isCreateMode) {
      API.create("departments", payload).then(() => {
        navigate("/departments");
      });
    } else {
      API.update("departments", payload).then(() => {
        navigate("/departments");
      });
    }
  };

  useEffect(() => {
    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const numId = Number(idFromPath);
      setId(numId);
      API.getOne("departments", numId)
        .then((response) => {
          form.setFieldsValue({
            name: response.name,
          });
        })
        .catch((error) => {
          console.error("Error fetching department data", error);
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
          label="Department"
          name="name"
          rules={[{ required: true, message: "Please input the department" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {isCreateMode ? "Create" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
