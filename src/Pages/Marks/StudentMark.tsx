import { Card, message, Select, TableColumnsType, Tag } from "antd";
import { useEffect, useState } from "react";
import DataTable from "../../Components/Common/DataTable";
import { AcademicLevelEnum } from "../Fields/List";
import { API } from "../../apis";
import { useUserSettings } from "../../hooks";

export enum SemesterEnum {
  S1 = "S1",
  S2 = "S2",
  S3 = "S3",
  S4 = "S4",
  S5 = "S5",
  S6 = "S6",
}

enum SessionEnum {
  FIRST = "FIRST",
  SECOND = "SECOND",
}

export interface MarkReadDto {
  id: number;
  grade: number;
  subjectName: string;
  semester: SemesterEnum;
  session: SessionEnum;
  academicYear: string;
  academicLevel: AcademicLevelEnum;
}

export const StudentMark = () => {
  const { userId } = useUserSettings();
  const [data, setData] = useState<MarkReadDto[]>([]);
  const [filtredData, setFiltredData] = useState<MarkReadDto[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<SemesterEnum | null>(
    null
  );
  const [selectedAcedemicLevel, setSeletedAcademicLevel] =
    useState<AcademicLevelEnum | null>(null);

  const columns: TableColumnsType<MarkReadDto> = [
    { title: "Subject", dataIndex: "subjectName", key: "subjectName" },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "markValue",
      render: (value) => (
        <Tag
          color={value >= 10 ? "green" : "red"}
          style={{ fontWeight: "bold" }}
        >
          {value} / 20
        </Tag>
      ),
    },
    {
      title: "Session",
      dataIndex: "session",
      key: "session",
      render: (session) => <Tag>{session}</Tag>,
    },
    { title: "Academic Year", dataIndex: "academicYear", key: "academicYear" },
  ];

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const marks = await API.getList("marks", `student/${userId}`);
        setData(marks);
      } catch (error) {
        console.error("Failed to fetch marks:", error);
        message.error("Could not load marks.");
      }
    };

    fetchMarks();
  }, []);

  useEffect(() => {
    if (selectedAcedemicLevel && selectedSemester) {
      const filtered = data.filter(
        (mark) =>
          mark.academicLevel === selectedAcedemicLevel &&
          mark.semester === selectedSemester
      );
      setFiltredData(filtered);
    }
  }, [selectedAcedemicLevel, selectedSemester]);

  return (
    <Card
      title={
        <>
          Marks{" "}
          {selectedAcedemicLevel && (
            <Tag>Academic Level : {selectedAcedemicLevel}</Tag>
          )}
          {selectedSemester && <Tag>Semester : {selectedSemester}</Tag>}
        </>
      }
      style={{ margin: "20px" }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Select
            placeholder="Select Academic Level"
            style={{ width: 200, marginBottom: 10 }}
            onChange={(value) => {
              setSeletedAcademicLevel(value);
            }}
          >
            {Object.values(AcademicLevelEnum).map((academicLevel) => (
              <Select.Option key={academicLevel} value={academicLevel}>
                {academicLevel}
              </Select.Option>
            ))}
          </Select>

          {selectedAcedemicLevel && (
            <Select
              placeholder="Select Semester"
              style={{ width: 200, marginBottom: 20 }}
              onChange={(value) => {
                setSelectedSemester(value);
              }}
            >
              {Object.values(SemesterEnum).map((semester) => (
                <Select.Option key={semester} value={semester}>
                  {semester}
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
      </div>
      {filtredData.length > 0 && (
        <DataTable columns={[...columns]} data={filtredData} expandable={{}} />
      )}
    </Card>
  );
};
