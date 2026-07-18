import { Button, Card, Form, Input, Select, DatePicker, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { Teacher } from "../List";
import { UserType } from "../../../types/UserType";

export const TeacherEditor = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const [fields, setFields] = useState<{ id: number; name: string }[]>([]);
  const location = useLocation();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Teacher) => {
    const payload = {
      cin: values.cin,
      fname: values.fname,
      lname: values.lname,
      birthDate: moment(values.birthDate).toISOString(),
      inscriptionDate: moment(values.inscriptionDate).toISOString(),
      fieldId: values.fieldId,
      userType: UserType.Teacher,
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    if (isCreateMode) {
      API.create("teachers", payload).then(() => {
        navigate("/teachers");
      });
    } else {
      API.update("teachers", payload).then(() => {
        navigate("/teachers");
      });
    }
  };

  useEffect(() => {
    const isCreateMode = location.pathname.includes("create");
    API.getList("fields")
      .then((res) => setFields(res))
      .catch(() => message.error("Failed to load fields"));

    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const numId = Number(idFromPath);
      setId(numId);
      API.getOne("teachers", numId)
        .then((response) => {
          setTeacher(response);
          form.setFieldsValue({
            fname: response.firstName,
            lname: response.lastName,
            cin: response.cin,
            cne: response.cne,
            birthDate: response.birthDate ? moment(response.birthDate) : null,
            inscriptionDate: response.inscriptionDate
              ? moment(response.inscriptionDate)
              : null,
            fieldId: response.field.id,
          });
        })
        .catch((error) => {
          console.error("Error fetching teacher data", error);
        });
    }
  }, [form, isCreateMode, location.pathname]);

  return (
    <Card
      title={isCreateMode ? "New Teacher" : "Edit Teacher"}
      variant="borderless"
    >
      {JSON.stringify(form.getFieldValue("birthDate"))}
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        form={form}
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="First Name"
          name="fname"
          rules={[
            { required: true, message: "Please input the teacher first name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lname"
          rules={[
            { required: true, message: "Please input the teacher last name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="CIN"
          name="cin"
          rules={[
            {
              required: true,
              message: "Please input the teacher national identity code",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="birthDate"
          rules={[
            {
              required: true,
              message: "Please select the teacher's date of birth",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Date of Inscription"
          name="inscriptionDate"
          rules={[
            {
              required: true,
              message: "Please select the teacher's date of inscription",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
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
