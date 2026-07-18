import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Row,
  Typography,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../../apis";

const { Title, Paragraph, Text } = Typography;

interface Assignment {
  id: number;
  title: string;
  description: string;
  link: string;
  fileBase64: string;
  submittedAt?: string;
  updatedAt?: string;
  status?: string;
  subject?: string;
  dueDate?: string;
}

interface AssignmentSolution {
  id?: number;
  studentId: number;
  assignmentId: number;
  fileBase64?: string;
  submittedAt?: string;
}

export const AssignmentPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [solution, setSolution] = useState<AssignmentSolution | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [solutionLoading, setSolutionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const assignmentResult = await API.getOne("assignments", Number(id));
        setAssignment(assignmentResult);

        // Fetch existing solution if it exists
        try {
          const solutionResult = await API.getOneWithMultipleIds(
            `assignments/${id}/solution` // TODO: Replace with actual student ID
          );
          setSolution(solutionResult);
        } catch (error) {
          console.log("No existing solution found");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSendAssignmentSolution = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file to send.");
      return;
    }

    setSolutionLoading(true);
    const formData = new FormData();
    formData.append("file", fileList[0]?.originFileObj as Blob);
    formData.append("assignmentId", String(assignment?.id));
    formData.append("studentId", String(1)); // TODO: Replace with actual student ID

    try {
      const result = await API.createWithFile("assignments/solutions", formData);
      message.success("Solution sent successfully!");
      setSolution(result);
      setFileList([]);
    } catch (error) {
      console.error("Failed to send solution:", error);
      message.error("Failed to send solution.");
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleFileChange = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e?.target?.result as string).split(",")[1] as string;
      setSolution(prev => ({
        ...prev,
        fileBase64: base64,
        studentId: 1, // TODO: Replace with actual student ID
        assignmentId: assignment?.id || 0
      }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <p>Loading assignment...</p>;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <Card
      style={{ margin: "auto", marginTop: 24 }}
      title={
        <Row>
          <Col span={8}>
            <Title level={4}>Assignment: {assignment.title}</Title>
          </Col>
          <Col
            span={8}
            offset={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSendAssignmentSolution}
              disabled={!fileList.length}
              loading={solutionLoading}
            >
              {solution ? "Update Solution" : "Send Solution"}
            </Button>
          </Col>
        </Row>
      }
    >
      <Row gutter={16}>
        <Col span={12}>
          <Title level={5}>Assignment Content:</Title>
          <Paragraph>{assignment.description}</Paragraph>
          
          {assignment.fileBase64 ? (
            <iframe
              src={`data:application/pdf;base64,${assignment.fileBase64}`}
              title="Assignment PDF"
              width="100%"
              height="600px"
              style={{ border: "1px solid #d9d9d9" }}
            />
          ) : (
            <div>No PDF file available for this assignment</div>
          )}
        </Col>
        
        <Col span={12}>
          <Title level={5}>Your Solution:</Title>
          
          <Upload
            accept=".pdf"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onRemove={() => {
              setFileList([]);
              setSolution(prev => prev ? {...prev, fileBase64: undefined} : null);
            }}
            onChange={(info) => {
              setFileList(info.fileList);
              if (info.fileList.length > 0) {
                handleFileChange(info.file);
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Select PDF File</Button>
          </Upload>
          
          {solution?.fileBase64 ? (
            <iframe
              src={`data:application/pdf;base64,${solution.fileBase64}`}
              title="Solution PDF"
              width="100%"
              height="600px"
              style={{ border: "1px solid #d9d9d9", marginTop: 16 }}
            />
          ) : (
            <div style={{ marginTop: 16 }}>
              {fileList.length > 0 ? (
                <div>Preview will appear here</div>
              ) : (
                <div>No solution submitted yet</div>
              )}
            </div>
          )}
          
          {solution?.submittedAt && (
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Last submitted: {new Date(solution.submittedAt).toLocaleString()}
              </Text>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};