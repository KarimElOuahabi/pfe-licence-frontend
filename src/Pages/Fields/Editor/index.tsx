import { Button, Card, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { AcademicLevelEnum, Field } from "../List";

export const FieldsEditor = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Field) => {
    const payload = {
      name: values.name,
      academicLevel: values.academicLevel,
      departmentId: values.departmentId,
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    const request = isCreateMode ? API.create("fields", payload) : API.update("fields", payload);
    request
      .then(() => {
        message.success(`Field ${isCreateMode ? "created" : "updated"} successfully`);
        navigate("/fields");
      })
      .catch(() => {
        message.error("Something went wrong. Please try again.");
      });
  };

  // Fetch departments and (if needed) field data
  useEffect(() => {
    API.getList("departments")
      .then((res) => setDepartments(res))
      .catch(() => message.error("Failed to load departments"));

    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const numId = Number(idFromPath);
      setId(numId);
      API.getOne("fields", numId)
        .then((response) => {
          form.setFieldsValue({
            name: response.name,
            academicLevel: response.academicLevel,
            departmentId: response.department.id,
          });
        })
        .catch(() => {
          message.error("Failed to load field data");
        });
    }
  }, [form, isCreateMode, location.pathname]);

  return (
    <Card title={isCreateMode ? "New Field" : "Edit Field"} variant="borderless">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        form={form}
        onFinish={handleFormSubmit}
      >
        
        <Form.Item
          label="Field"
          name="name"
          rules={[{ required: true, message: "Please input the field name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Department"
          name="departmentId"
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select placeholder="Select a department">
            {departments.map((department) => (
              <Select.Option key={department.id} value={department.id}>
                {department.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Academic Level"
          name="academicLevel"
          rules={[{ required: true, message: "Please select an academic level" }]}
        >
          <Select placeholder="Select an academic level">
            {Object.values(AcademicLevelEnum).map((level) => (
              <Select.Option key={level} value={level}>
                {level}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit">
            {isCreateMode ? "Create" : "Update"}
          </Button>
        </Form.Item>

      </Form>
    </Card>
  );
};
