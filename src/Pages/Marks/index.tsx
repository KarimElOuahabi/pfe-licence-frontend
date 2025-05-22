import { TableColumnsType, Tag, Button, Select } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import DataTable from "../../Components/Common/DataTable"; // Import DataTable component

const { Option } = Select;

export interface Mark {
  id: number;
  module: string;
  grade: number;
  mention: string;
  status: "Validé" | "Rattrapage";
  session: 1 | 2;
  validatedAt: string;
}

const allMarks: Record<string, Mark[]> = {
  S1: [
    {
      id: 1,
      module: "Analyse Mathématique",
      grade: 14.5,
      mention: "Bien",
      status: "Validé",
      session: 1,
      validatedAt: "2023-06-30",
    },
    {
      id: 2,
      module: "Physique",
      grade: 9.0,
      mention: "Insuffisant",
      status: "Rattrapage",
      session: 1,
      validatedAt: "2023-06-30",
    },
    {
      id: 3,
      module: "Chimie",
      grade: 12.0,
      mention: "Assez bien",
      status: "Validé",
      session: 1,
      validatedAt: "2023-06-30",
    },
    {
      id: 4,
      module: "Informatique",
      grade: 15.0,
      mention: "Bien",
      status: "Validé",
      session: 1,
      validatedAt: "2023-06-30",
    },
  ],
  S2: [
    {
      id: 4,
      module: "Algèbre Linéaire",
      grade: 12.0,
      mention: "Assez bien",
      status: "Validé",
      session: 1,
      validatedAt: "2023-12-20",
    },
    {
      id: 5,
      module: "Chimie",
      grade: 10.0,
      mention: "Passable",
      status: "Validé",
      session: 1,
      validatedAt: "2023-12-20",
    },
  ],
  S3: [],
  S4: [],
  S5: [],
  S6: [],
};

const calculateSemesterAverage = (marks: Mark[]) => {
  if (marks.length === 0) return 0;
  const sum = marks.reduce((acc, mark) => acc + mark.grade, 0);
  return parseFloat((sum / marks.length).toFixed(2));
};

const getMention = (average: number): string => {
  if (average >= 16) return "Très bien";
  if (average >= 14) return "Bien";
  if (average >= 12) return "Assez bien";
  if (average >= 10) return "Passable";
  return "Insuffisant";
};

export const Marks = () => {
  const [semester, setSemester] = useState<string>("S1");
  const navigate = useNavigate(); // Initialize navigate for routing

  const marks = allMarks[semester] || [];
  const average = calculateSemesterAverage(marks);
  const mention = getMention(average);

  const handleReclamation = (module: string) => {
    // Use navigate to redirect to the reclamation page and pass the module as state
    navigate("/reclamations", { state: { module } });
  };

  const handlePrint = () => {
    window.print();
  };

  // Define the columns for the DataTable
  const columns: TableColumnsType<Mark> = [
    { title: "Module", dataIndex: "module", key: "module" },
    { title: "Note /20", dataIndex: "grade", key: "grade" },
    { title: "Mention", dataIndex: "mention", key: "mention" },
    {
      title: "État de validation",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Validé" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    { title: "Session", dataIndex: "session", key: "session" },
    { title: "Date de validation", dataIndex: "validatedAt", key: "validatedAt" },
    {
      title: "Réclamation",
      key: "reclamation",
      render: (_, record) => (
        <Button type="link" onClick={() => handleReclamation(record.module)}>
          Réclamer
        </Button>
      ),
    },
  ];

  // Define expandable row content
  const expandedRowRender = (record: Mark) => (
    <div style={{ margin: 0 }}>
      <strong>Description :</strong>
      <p>Details of the module, like requirements or additional notes...</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Select value={semester} onChange={(val) => setSemester(val)} style={{ width: 200 }}>
          <Option value="S1">Semestre 1</Option>
          <Option value="S2">Semestre 2</Option>
          <Option value="S3">Semestre 3</Option>
          <Option value="S4">Semestre 4</Option>
          <Option value="S5">Semestre 5</Option>
          <Option value="S6">Semestre 6</Option>
        </Select>
        <Button type="primary" onClick={handlePrint}>
          Imprimer le relevé de notes
        </Button>
      </div>

      {/* Using the DataTable component here */}
      <DataTable
        columns={columns}
        data={marks}
        expandable={{ expandedRowRender }} // Pass expandable prop
      />

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <p><strong>Note globale du semestre :</strong> {average}</p>
        <p><strong>Mention générale :</strong> {mention}</p>
      </div>
    </div>
  );
};
