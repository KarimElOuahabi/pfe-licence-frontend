import {
  Button,
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";
import dayjs from "dayjs";

const { Option } = Select;

export const AssignmentsEditor = () => {
  const [form] = Form.useForm();
  const [subjectOptions, setSubjectOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [id, setId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  // File state for PDF upload (only used in create mode)
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFormSubmit = (values: any) => {
    if (isCreateMode) {
      // Create mode: send FormData with file
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("subjectId", values.subjectId);
      formData.append("status", values.status);
      formData.append("dueDate", values.dueDate.format("YYYY-MM-DD"));

      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj);
      }

      API.createWithFile("assignments", formData).then(() => {
        message.success("Assignment created successfully!");
        navigate("/assignments");
      });
    } else {
      // Edit mode: update with JSON, including link
      const assignment = {
        ...values,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        id,
      };
      API.updateWithFile("assignments", assignment).then(() => {
        navigate("/assignments");
      });
    }
  };

  useEffect(() => {
    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      setId(Number(idFromPath));
      API.getOne("assignments", Number(idFromPath))
        .then((response) => {
          form.setFieldsValue({
            title: response.title,
            description: response.description,
            subject: response.subjectId,
            status: response.status,
            link: response.link,
            dueDate: dayjs(response.dueDate),
          });
        })
        .catch((error) => {
          console.error("Error fetching assignment", error);
        });
    }
  }, [form, isCreateMode, location.pathname]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await API.getList("subjects");
        setSubjectOptions(
          subjects.map((subject: any) => ({
            label: subject.name,
            value: subject.id,
          }))
        );
      } catch (error) {
        message.error("Could not load subjects.");
      }
    };

    fetchSubjects();
  }, []);

  return (
    <Card title={isCreateMode ? "Create Assignment" : "Edit Assignment"}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subjectId"
          rules={[{ required: true }]}
        >
          <Select>
            {subjectOptions.map((subject) => (
              <Option key={subject.value} value={subject.value}>
                {subject.label}
              </Option>
            ))}
          </Select>

          {/* TODO :  get only professor subjects */}
        </Form.Item>

        {isCreateMode ? (
          // CREATE MODE: Show file upload for PDF instead of link field
          <Form.Item label="Upload PDF">
            <Upload
              accept=".pdf"
              fileList={fileList}
              beforeUpload={() => false} // Prevent automatic upload
              onRemove={() => {
                setFileList([]);
              }}
              onChange={(info) => {
                setFileList(info.fileList);
              }}
            >
              <Button icon={<UploadOutlined />}>Select PDF File</Button>
            </Upload>
          </Form.Item>
        ) : (
          // EDIT MODE: Show the link input field
          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
        )}

        <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isCreateMode ? "Create" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
