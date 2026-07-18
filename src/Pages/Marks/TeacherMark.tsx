import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Select,
  TableColumnsType,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { API } from "../../apis";
import DataTable from "../../Components/Common/DataTable";
import { useUserSettings } from "../../hooks";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

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

export interface MarkProfessorReadDto {
  id: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    cin: string;
    cne: string;
    studentCode: string;
  };
  mark: number;
  markSession: SessionEnum;
  subject: {
    id: number;
    name: string;
  };
}

export interface SubjectDto {
  id: number;
  name: string;
}



/**
 * 
 * SCHEDULE = ID, FIELD, FILEBASE64 (Admin)
 * GET SCHEDULE BY FIELD ID (pcq: student FIELD ID) (Student)
 */

export const TeacherMark = () => {
  // STATES
  const [modalAsOpen, setModalAsOpen] = useState(false);
  const { userId, fieldId } = useUserSettings();
  const [data, setData] = useState<MarkProfessorReadDto[]>([]);
  const [filtredData, setFiltredData] = useState<MarkProfessorReadDto[]>([]);
  const [subjectsByProfessorId, setSubjectsByProfessorId] = useState<
    SubjectDto[]
  >([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionEnum | null>(
    null
  );
  const [students, setStudents] = useState<any[]>([]);
  const [editingMark, setEditingMark] = useState<MarkProfessorReadDto | null>(
    null
  );

  // COLUMNS
  const columns: TableColumnsType<MarkProfessorReadDto> = [
    {
      title: "Student Code",
      dataIndex: "student",
      key: "scode",
      render: (student: any) => <b>{student.studentCode}</b>,
    },
    {
      title: "Student Name",
      dataIndex: "student",
      key: "fnameAndLname",
      render: (student: any) => (
        <>
          {student.lname} {student.fname}
        </>
      ),
    },
    {
      title: "CIN",
      dataIndex: "student",
      key: "cin",
      render: (student: any) => <>{student.cin}</>,
    },
    {
      title: "Mark (/20)",
      dataIndex: "",
      key: "mark",
      render: (mark: any) => {
        return (
          <>
            <Tag color="blue-inverse">{mark.mark} /20</Tag>
            <Button
              type="dashed"
              onClick={() => {
                setEditingMark(mark); // set current mark to be edited
                setModalAsOpen(true);
              }}
            >
              <EditOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  // HOOKS
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await API.getList("subjects", `teacher/${userId}`);
        setSubjectsByProfessorId(subjects);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        message.error("Could not load subjects.");
      }
    };

    const fetchStudentsByFieldId = async () => {
      try {
        const students = await API.getList("students", `field/${fieldId}`);
        // You can set the students in state if needed
        setStudents(students);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        message.error("Could not load students.");
      }
    };

    fetchStudentsByFieldId();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const fetchMarkProfessorReadDtos = async () => {
        try {
          const marks = await API.getList(
            "marks",
            `subject/${selectedSubject}`
          );
          setData(marks);
        } catch (error) {
          message.error("Could not load marks.");
        }
      };
      setFiltredData(
        data.filter(
          (mark) =>
            mark.markSession === selectedSession &&
            mark.subject.id === selectedSubject
        ) ?? []
      );
      fetchMarkProfessorReadDtos();
    }
  }, [selectedSession, selectedSubject]);

  // METHODS
  const createMark = async (markData: any) => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      let currentAcademicYear = "";
      if (currentMonth >= 9) {
        currentAcademicYear = `${new Date().getFullYear()}-${
          new Date().getFullYear() + 1
        }`;
      } else {
        currentAcademicYear = `${
          new Date().getFullYear() - 1
        }-${new Date().getFullYear()}`;
      }
      const newMark = {
        studentId: markData.studentId,
        subjectId: selectedSubject,
        grade: markData.mark,
        academicYear: currentAcademicYear,
        session: selectedSession,
      };
      await API.create("marks", newMark);
      // setFiltredData((prev) => [...prev, newMark]);
    } catch (error) {
      console.error("Failed to create mark:", error);
      message.error("Could not add the mark.");
    }
  };
  const updateMark = async (markData: any) => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      let currentAcademicYear = "";
      if (currentMonth >= 9) {
        currentAcademicYear = `${new Date().getFullYear()}-${
          new Date().getFullYear() + 1
        }`;
      } else {
        currentAcademicYear = `${
          new Date().getFullYear() - 1
        }-${new Date().getFullYear()}`;
      }
      const updatedMark = {
        id: markData.id,
        studentId: markData.studentId,
        subjectId: selectedSubject,
        grade: markData.mark,
        academicYear: currentAcademicYear,
        session: selectedSession,
      };
      await API.update("marks", updatedMark);
    } catch (error) {
      console.error("Failed to create mark:", error);
      message.error("Could not add the mark.");
    }
  };
  return (
    <Card
      title={
        <>
          {selectedSubject && (
            <Tag>
              Subject :{" "}
              {
                subjectsByProfessorId.find(
                  (subject) => subject.id === selectedSubject
                )?.name
              }
            </Tag>
          )}
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
            placeholder="Select Subject"
            style={{ width: 200, marginBottom: 10 }}
            onChange={(value) => {
              setSelectedSubject(value);
            }}
          >
            {subjectsByProfessorId.map((subject) => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Select Session"
            style={{ width: 200, marginBottom: 10 }}
            onChange={(value) => {
              setSelectedSession(value);
            }}
          >
            {Object.values(SessionEnum).map((session) => (
              <Select.Option key={session} value={session}>
                {session}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <Divider style={{ margin: "20px 0" }} />
      <Row>
        <Col span={8}>
          <Input.Search
            placeholder="Search by Student Code"
            style={{ width: 300, marginBottom: 20 }}
            onChange={(ev) => {
              const searchValue = ev.target.value.toLowerCase();
              const dataBySubjectAndSession = data.filter(
                (mark) =>
                  mark.markSession === selectedSession &&
                  mark.subject.id === selectedSubject
              );

              if (searchValue == "") {
                setFiltredData(dataBySubjectAndSession);
                return;
              }
              setFiltredData(
                dataBySubjectAndSession.filter((mark) =>
                  mark.student.studentCode.toLowerCase().includes(searchValue)
                )
              );
            }}
          />
        </Col>
        <Col span={8} offset={8} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => {
              setModalAsOpen(true);
            }}
            disabled={!selectedSession || !selectedSubject}
          >
            <PlusOutlined />
            Add Mark
          </Button>
          <MarkModal
            open={modalAsOpen}
            students={students}
            editingMark={editingMark}
            handleOk={(e: any) => {
              console.log("editingMark :>> ", editingMark);
              if (editingMark) {
                updateMark({ ...e, id: editingMark.id });
                message.success("Mark updated successfully!");
              } else {
                createMark(e);
                message.success("Mark added successfully!");
              }
              setEditingMark(null);
              setModalAsOpen(false);
            }}
            handleCancel={() => {
              setEditingMark(null);
              setModalAsOpen(false);
            }}
          />
        </Col>
      </Row>

      {filtredData.length > 0 && selectedSubject && selectedSession && (
        <DataTable columns={[...columns]} data={filtredData} expandable={{}} />
      )}
    </Card>
  );
};

const MarkModal = ({
  open,
  handleOk,
  handleCancel,
  students,
  editingMark,
}: any) => {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [mark, setMark] = useState<number | null>(null);

  useEffect(() => {
    if (editingMark) {
      setSelectedStudent(editingMark.student.id);
      setMark(editingMark.mark);
    } else {
      setSelectedStudent(null);
      setMark(null);
    }
  }, [editingMark]);

  return (
    <Modal
      title={editingMark ? "Edit Mark" : "New Mark"}
      open={open}
      onOk={() => {
        handleOk({ studentId: selectedStudent, mark });
      }}
      onCancel={handleCancel}
    >
      <Select
        showSearch
        disabled={!!editingMark} // prevent changing student on edit
        placeholder="Select Student"
        style={{ marginBottom: 10, width: "100%" }}
        optionFilterProp="label"
        onChange={(value) => {
          setSelectedStudent(value);
        }}
        filterOption={(input, option) =>
          (option?.label as string).toLowerCase().includes(input.toLowerCase())
        }
        value={selectedStudent ?? undefined}
        options={students.map((student: any) => ({
          value: student.id,
          label: `${student.studentCode} - ${student.firstName} ${student.lastName}`,
        }))}
      />
      <Input
        type="number"
        min={0}
        max={20}
        placeholder="Enter mark (/20)"
        value={mark ?? undefined}
        onChange={(e) =>
          setMark(e.target.value ? parseFloat(e.target.value) : null)
        }
      />
    </Modal>
  );
};
