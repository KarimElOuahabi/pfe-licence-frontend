import { Button, Card, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../../apis";

const { Title } = Typography;

interface Schedule {
  id: number;
  title: string;
  fileBase64: string;
  field?: {
    name: string;
  };
}

export const SchedulePreview = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const result = await API.getOne("schedules", Number(id));
        setSchedule(result);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
        message.error("Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSchedule();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!schedule) return <div>Schedule not found</div>;

  return (
    <Card
      title={`Schedule: ${schedule.title}`}
      style={{ margin: "16px auto", maxWidth: 1000 }}
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Field: {schedule.field?.name || 'N/A'}</Title>
      </div>

      {schedule.fileBase64 ? (
        <iframe
          src={`data:application/pdf;base64,${schedule.fileBase64}`}
          title="PDF Preview"
          width="100%"
          height="600px"
          style={{ border: "1px solid #d9d9d9" }}
        />
      ) : (
        <div>No PDF file available for this schedule</div>
      )}
    </Card>
  );
};