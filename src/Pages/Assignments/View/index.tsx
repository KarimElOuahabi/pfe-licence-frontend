import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { API } from "../../../apis";

interface Assignment {
  id: number;
  title: string;
  description: string;
  link: string;
  fileBase64: string
  submittedAt?: string;
  updatedAt?: string;
  status?: string;
  subject?: string;
  dueDate?: string;
}

export const AssignmentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const result = await API.getOne("assignments", Number(id));
        setAssignment(result);
      } catch (error) {
        console.error("Failed to fetch assignment:", error);
        message.error("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssignment();
  }, [id]);

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleSendAssignment = () => {
    if (fileList.length === 0) {
      message.error("Please select a file to send.");
      return;
    }
    message.success("Assignment sent successfully!");
    setFileList([]);
  };

  if (loading) return <p>Loading assignment...</p>;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <Card
      title={assignment.title}
      style={{ maxWidth: 800, margin: "auto", marginTop: 24 }}
      extra={
        <Button
          type="primary"
          onClick={handleSendAssignment}
          disabled={fileList.length === 0}
        >
          Send Assignment
        </Button>
      }
    >
      <p>{assignment.description}</p>

      <div style={{ marginBottom: 24 }}>
        <iframe
          src={`data:application/pdf;base64,${assignment.fileBase64}`}
          title="PDF Preview"
          width="100%"
          height="600px"
          style={{ border: "none" }}
        />
      </div>

      <Upload
        beforeUpload={() => false}
        fileList={fileList}
        onChange={handleUploadChange}
        maxCount={1}
        accept=".pdf,image/*"
      >
        <Button icon={<UploadOutlined />}>
          Select File to Send (PDF or Image)
        </Button>
      </Upload>
    </Card>
  );
};
