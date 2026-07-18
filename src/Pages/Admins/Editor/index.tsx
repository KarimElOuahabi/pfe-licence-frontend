import { Button, Card, Form, Input, Select, DatePicker, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { Admin } from "../List";
import { UserType } from "../../../types/UserType";

export const AdminEditor = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Admin) => {
    const payload = {
      cin: values.cin,
      firstName: values.firstName,
      lastName: values.lastName,
      userType: UserType.Admin,
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    if (isCreateMode) {
      API.create("admins", payload).then(() => {
        navigate("/admins");
      });
    } else {
      API.update("admins", payload).then(() => {
        navigate("/admins");
      });
    }
  };

  useEffect(() => {
    const isCreateMode = location.pathname.includes("create");
    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const numId = Number(idFromPath);
      setId(numId);
      API.getOne("admins", numId)
        .then((response) => {
          setAdmin(response);
          form.setFieldsValue({
            firstName: response.firstName,
            lastName: response.lastName,
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
      title={isCreateMode ? "New Admin" : "Edit Admin"}
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
          name="firstName"
          rules={[
            { required: true, message: "Please input the teacher first name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
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

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {isCreateMode ? "Create" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
