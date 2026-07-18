import React, { useState } from "react";
import { Row, Col, Card, List, Typography, Button, Space } from "antd";
//import { scheduleData } from "../Schedule/AdminAddSche";
import { CustomCalendar } from "./CustomCalendar";

const { Title } = Typography;

const announcements = [
  { title: "Exam schedule released", date: "2025-05-10" },
  { title: "Lab reports due next week", date: "2025-05-08" },
  { title: "New course materials uploaded", date: "2025-05-06" },
];

export const Home: React.FC = () => {
  const today = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[today.getDay()];

  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([1]);

  const toggleSemester = (semester: number) => {
    setSelectedSemesters((prev) =>
      prev.includes(semester)
        ? prev.filter((item) => item !== semester)
        : [...prev, semester]
    );
  };

  // const scheduleToday = selectedSemesters.flatMap(
  //   (semester) =>
  //     scheduleData[semester]?.filter((session) => session.day === currentDay) ||
  //     []
  // );

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        {/* LEFT COLUMN: Calendar + To-Do List */}
        <Col xs={24} lg={14}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Card title="Calendar">
                <CustomCalendar />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* RIGHT COLUMN: Today's Schedule + Announcements */}
        <Col xs={24} lg={10}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Card
                title="Today's Schedule"
                extra={
                  <Space>
                    <Button
                      size="small"
                      onClick={() => toggleSemester(1)}
                      type={
                        selectedSemesters.includes(1) ? "primary" : "default"
                      }
                    >
                      S1
                    </Button>
                    <Button
                      size="small"
                      onClick={() => toggleSemester(3)}
                      type={
                        selectedSemesters.includes(3) ? "primary" : "default"
                      }
                    >
                      S3
                    </Button>
                    <Button
                      size="small"
                      onClick={() => toggleSemester(5)}
                      type={
                        selectedSemesters.includes(5) ? "primary" : "default"
                      }
                    >
                      S5
                    </Button>
                  </Space>
                }
              >
                {/* <List
                  dataSource={scheduleToday}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.subject}
                        description={`${item.time} (${item.type})`}
                      />
                    </List.Item>
                  )}
                /> */}
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Last Announcements">
                <List
                  dataSource={announcements}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={`Date: ${item.date}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
