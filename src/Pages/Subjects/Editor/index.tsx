import { Button, Card, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { SemesterEnum, Subject } from "../List";

export const SubjectEditor = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const [fields, setFields] = useState<{ id: number; name: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: number; firstName: string; lastName: String }[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Subject) => {
    const payload = {
      name: values.name,
      teacherId: values.teacherId,
      semester: values.semester,
      fieldId: values.fieldId,
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    if (isCreateMode) {
      API.create("subjects", payload).then(() => {
        navigate("/subjects");
      });
    } else {
      API.update("subjects", payload).then(() => {
        navigate("/subjects");
      });
    }
  };

  useEffect(() => {
    const isCreateMode = location.pathname.includes("create");
    API.getList("fields")
      .then((res) => setFields(res))
      .catch(() => message.error("Failed to load fields"));

    API.getList("teachers")
      .then((res) => {
        console.log('res :>> ', res);
        setTeachers(res);
      })
      .catch(() => message.error("Failed to load teachers"));

    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const numId = Number(idFromPath);
      setId(numId);
      API.getOne("subjects", numId)
        .then((response) => {
          console.log("response :>> ", response);
          form.setFieldsValue({
            name: response.name,
            teacherId: response.teacher.id,
            fieldId: response.field.id,
            semester: response.semester,
          });
        })
        .catch((error) => {
          console.error("Error fetching subject data", error);
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
          label="Subject"
          name="name"
          rules={[{ required: true, message: "Please input the subject" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Teacher"
          name="teacherId"
          rules={[{ required: true, message: "Please select a teacher" }]}
        >
          <Select placeholder="Select a teacher">
            {teachers.map((teacher) => (
              <Select.Option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Semester"
          name="semester"
          rules={[{ required: true, message: "Please select a semester" }]}
        >
          <Select placeholder="Select a semester">
            {Object.values(SemesterEnum).map((semester) => (
              <Select.Option key={semester} value={semester}>
                {semester}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Field"
          name="fieldId"
          rules={[{ required: true, message: "Please select a field" }]}
        >
          <Select placeholder="Select a field">
            {fields.map((field) => (
              <Select.Option key={field.id} value={field.id}>
                {field.name}
              </Select.Option>
            ))}
          </Select>
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
