import { Button, Card, Form, Input, Select, DatePicker, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { TypeBacEnum, Student } from "../List";
import { UserType } from "../../../types/UserType";
import { userInfo } from "os";

export const StudentEditor = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const [fields, setFields] = useState<{ id: number; name: string }[]>([]);
  const location = useLocation();
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Student) => {
    const payload = {
      studentCode: values.studentCode,
      cin: values.cin,
      cne: values.cne,
      fname: values.fname,
      lname: values.lname,
      birthDate: moment(values.birthDate).toISOString(),
      inscriptionDate: moment(values.inscriptionDate).toISOString(),
      fieldId: values.fieldId,
      typeBac: values.typeBac,
      userType: UserType.Student,
      ...(!isCreateMode && id !== undefined ? { id } : {}),
    };

    if (isCreateMode) {
      API.create("students", payload).then(() => {
        navigate("/students");
      });
    } else {
      API.update("students", payload).then(() => {
        navigate("/students");
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
      API.getOne("students", numId)
        .then((response) => {
          setStudent(response);
          console.log("response :>> ", response);
          form.setFieldsValue({
            studentCode: response.studentCode,
            fname: response.firstName,
            lname: response.lastName,
            cin: response.cin,
            cne: response.cne,
            birthDate: response.birthDate ? moment(response.birthDate) : null,
            inscriptionDate: response.inscriptionDate
              ? moment(response.inscriptionDate)
              : null,
            typeBac: response.typeBac,
            fieldId: response.field.id,
          });
        })
        .catch((error) => {
          console.error("Error fetching student data", error);
        });
    }
  }, [form, isCreateMode, location.pathname]);

  return (
    <Card
      title={isCreateMode ? "New Student" : "Edit Student"}
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
          label="Student Code"
          name="studentCode"
          rules={[{ required: true, message: "Please input the student code" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="fname"
          rules={[
            { required: true, message: "Please input the student first name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lname"
          rules={[
            { required: true, message: "Please input the student last name" },
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
              message: "Please input the student national identity code",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="CNE"
          name="cne"
          rules={[
            {
              required: true,
              message: "Please input the student national student code",
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
              message: "Please select the student's date of birth",
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
              message: "Please select the student's date of inscription",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Type de baccalauréat"
          name="typeBac"
          rules={[
            { required: true, message: "Please select a baccalauréat type" },
          ]}
        >
          <Select placeholder="Selectionner un type de baccalauréat">
            {Object.values(TypeBacEnum).map((typeBac) => (
              <Select.Option key={typeBac} value={typeBac}>
                {typeBac}
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
