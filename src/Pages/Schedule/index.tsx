import React, { useState } from "react";
import { Card, Select, Typography, Tag } from "antd";

const { Title } = Typography;
const { Option } = Select;

type SessionType = "Cours" | "TD" | "TP";

interface Session {
  day: string;
  time: string;
  type: SessionType;
  subject: string;
}

const sessionColorMap: Record<SessionType, string> = {
  Cours: "powderblue",
  TD: "green",
  TP: "orange",
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
  "08:30 - 10:00",
  "10:00 - 11:30",
  "11:45 - 13:15",
  "14:30 - 16:00",
  "16:15 - 17:45",
];

// Sample schedule data per semester
export const scheduleData: Record<number, Session[]> = {
  1: [
    { day: "Monday", time: timeSlots[0], type: "Cours", subject: "Math" },
    { day: "Tuesday", time: timeSlots[1], type: "TD", subject: "Physics" },
    { day: "Wednesday", time: "14:30 - 16:00", type: "TP", subject: "Computer Lab" },
    { day: "Thursday", time: "11:45 - 13:15", type: "Cours", subject: "English" },
    { day: "Friday", time: "10:00 - 11:30", type: "TD", subject: "French" },
    { day: "Saturday", time: "08:30 - 10:00", type: "Cours", subject: "History" },
  ],
  3: [
    { day: "Monday", time: "10:00 - 11:30", type: "Cours", subject: "Algorithms" },
    { day: "Tuesday", time: "11:45 - 13:15", type: "TP", subject: "Database Lab" },
    { day: "Wednesday", time: "14:30 - 16:00", type: "TD", subject: "Statistics" },
    { day: "Thursday", time: "08:30 - 10:00", type: "Cours", subject: "Logic" },
    { day: "Friday", time: "16:15 - 17:45", type: "TD", subject: "Networking" },
    { day: "Saturday", time: "14:30 - 16:00", type: "TP", subject: "Web Dev Lab" },
  ],
  5: [
    { day: "Monday", time: "11:45 - 13:15", type: "Cours", subject: "AI" },
    { day: "Tuesday", time: "08:30 - 10:00", type: "TP", subject: "ML Lab" },
    { day: "Wednesday", time: "10:00 - 11:30", type: "TD", subject: "Project Management" },
    { day: "Thursday", time: "14:30 - 16:00", type: "Cours", subject: "Cloud Computing" },
    { day: "Friday", time: "08:30 - 10:00", type: "Cours", subject: "Cybersecurity" },
    { day: "Saturday", time: "11:45 - 13:15", type: "TP", subject: "AI Project" },
  ],
};

export const Schedule: React.FC = () => {
  const [semester, setSemester] = useState<number>(1);

  const getSession = (day: string, time: string) => {
    return scheduleData[semester].find(
      s => s.day === day && s.time === time
    );
  };

  return (
    <Card style={{ margin: 24 }}>
      <Title level={3}>📘 Global Schedule</Title>

      <Select
        defaultValue={semester}
        onChange={setSemester}
        style={{ marginBottom: 20, width: 200 }}
      >
        <Option value={1}>Semester 1</Option>
        <Option value={3}>Semester 3</Option>
        <Option value={5}>Semester 5</Option>
      </Select>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: 120, border: "1px solid #ddd", padding: 8 }}>Time</th>
              {days.map(day => (
                <th key={day} style={{ border: "1px solid #ddd", padding: 8 }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{time}</td>
                {days.map(day => {
                  const session = getSession(day, time);
                  return (
                    <td
                      key={day + time}
                      style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}
                    >
                      {session ? (
                        <Tag
                          color={sessionColorMap[session.type]}
                          style={{ color: "#000", fontWeight: 500 }}
                        >
                          {session.subject} ({session.type})
                        </Tag>
                      ) : (
                        <span style={{ color: "#ccc" }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
