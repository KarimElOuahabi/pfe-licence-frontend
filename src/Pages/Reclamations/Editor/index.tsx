import { Button, Card, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import { Reclamation } from "../List";

export const ReclamationsEditor = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const handleFormSubmit = (values: Reclamation) => {
    const payload = {
      title: values.title || "",
      description: values.description || "",
      ...( !isCreateMode && id !== undefined ? { id } : {}),
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
        <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please input the title" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} />
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
