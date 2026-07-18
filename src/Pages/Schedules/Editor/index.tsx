import { Button, Card, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../apis";

const { Option } = Select;

export const SchedulesEditor = () => {
  const [form] = Form.useForm();
  const [fieldOptions, setFieldOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [id, setId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname.includes("create");

  const [fileList, setFileList] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any>(null);
  const [newFilePreview, setNewFilePreview] = useState<string | null>(null);

  const handleFormSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("fieldId", values.fieldId);

    if (fileList.length > 0) {
      formData.append("file", fileList[0].originFileObj);
    }

    if (isCreateMode) {
      try {
        await API.createWithFile("schedules", formData);
        message.success("Schedule created successfully!");
      } catch (err) {
        message.error("Error creating schedule.");
      }
      navigate("/schedules");
    } else {
      if (id !== undefined) {
        formData.append("id", id.toString());
        try {
          await API.updateWithFile("schedules", formData);
          message.success("Schedule updated successfully!");
          navigate("/schedules");
        } catch (err) {
          message.error("Error updating schedule.");
        }
      }
    }
  };

  useEffect(() => {
    if (!isCreateMode) {
      const idFromPath = location.pathname.split("/").pop();
      const parsedId = Number(idFromPath);
      setId(parsedId);
      API.getOne("schedules", parsedId)
        .then((response) => {
          setSchedule(response);
          form.setFieldsValue({
            title: response.title,
            fieldId: response.field.id,
          });
        })
        .catch((error) => {
          console.error("Error fetching schedule", error);
        });
    }
  }, [form, isCreateMode, location.pathname]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const subjects = await API.getList("fields");
        setFieldOptions(
          subjects.map((field: any) => ({
            label: field.name,
            value: field.id,
          }))
        );
      } catch (error) {
        message.error("Could not load fields.");
      }
    };
    fetchFields();
  }, []);

  const handleUploadChange = (info: any) => {
    const newFileList = info.fileList.slice(-1);
    setFileList(newFileList);

    const file = newFileList[0]?.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewFilePreview(null);
    }
  };

  return (
    <Card title={isCreateMode ? "Create Schedule" : "Edit Schedule"}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Field" name="fieldId" rules={[{ required: true }]}>
          <Select>
            {fieldOptions.map((field) => (
              <Option key={field.value} value={field.value}>
                {field.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Upload PDF">
          <Upload
            accept=".pdf"
            fileList={fileList}
            beforeUpload={() => false}
            onRemove={() => {
              setFileList([]);
              setNewFilePreview(null);
            }}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Select PDF File</Button>
          </Upload>
        </Form.Item>

        {/* PDF Preview - Show for both create and edit modes */}
        <div style={{ marginBottom: 16 }}>
          {newFilePreview ? (
            <>
              <strong>
                {isCreateMode ? "Selected file:" : "New selected file:"}
              </strong>
              <iframe
                src={newFilePreview}
                title="PDF Preview"
                width="100%"
                height="500px"
                style={{ border: "1px solid #d9d9d9", marginTop: 8 }}
              />
            </>
          ) : !isCreateMode && schedule?.fileBase64 ? (
            <>
              <strong>Current file:</strong>
              <iframe
                src={`data:application/pdf;base64,${schedule.fileBase64}`}
                title="Current PDF Preview"
                width="100%"
                height="500px"
                style={{ border: "1px solid #d9d9d9", marginTop: 8 }}
              />
            </>
          ) : (
            !isCreateMode && <div>No PDF available for this schedule</div>
          )}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isCreateMode ? "Create" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
