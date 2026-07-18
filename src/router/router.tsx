import { RouteObject } from "react-router-dom";
import { AuthenticatedLayout } from "../Components/Common/layouts/Authenticated";
import { UnauthenticatedLayout } from "../Components/Common/layouts/UnauthenticatedLayout";

import { AdminEditor } from "../Pages/Admins/Editor";
import { Admins } from "../Pages/Admins/List";
import { ADRequestEditor } from "../Pages/AdministrativeDocs/Editor";
import { AdminstrativeDocsRequests } from "../Pages/AdministrativeDocs/List";
import { AssignmentsEditor } from "../Pages/Assignments/Editor";
import { Assignments } from "../Pages/Assignments/List";
import { AssignmentPreview } from "../Pages/Assignments/Preview";
import { DepartmentEditor } from "../Pages/Departments/Editor";
import { Departments } from "../Pages/Departments/List";
import { FieldsEditor } from "../Pages/Fields/Editor";
import { Fields } from "../Pages/Fields/List";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Marks } from "../Pages/Marks";
import { ReclamationsEditor } from "../Pages/Reclamations/Editor";
import { Reclamations } from "../Pages/Reclamations/List";
import { SchedulesEditor } from "../Pages/Schedules/Editor";
import { Schedules } from "../Pages/Schedules/List";
import { SchedulePreview } from "../Pages/Schedules/Preview";
import { StudentEditor } from "../Pages/Students/Editor";
import { Students } from "../Pages/Students/List";
import { SubjectEditor } from "../Pages/Subjects/Editor";
import { Subjects } from "../Pages/Subjects/List";
import { TeacherEditor } from "../Pages/Teachers/Editor";
import { Teachers } from "../Pages/Teachers/List";

type RouteItem = {
  id: number;
  key: React.Key;
  label?: string;
  icon?: React.ReactNode;
  path: string;
  children?: RouteItem[];
};

export const ROUTES: { [key: string]: RouteItem } = {
  LOGIN: { id: 0, key: 0, label: "Login", path: "/login" },
  HOME: { id: 1, key: 1, label: "Home", path: "/" },
  ASSIGNMENTS: { id: 2, key: 2, label: "Assignments", path: "/assignments" },
  RECLAMATIONS: { id: 3, key: 3, label: "Reclamations", path: "/reclamations" },
  SCHEDULES: { id: 5, key: 5, label: "Schedules", path: "/schedules" },
  MARKS: { id: 6, key: 6, label: "Marks", path: "/marks" },
  ADMINISTRATIVE_DOCS: {
    id: 7,
    key: 7,
    label: "Administrative Documents",
    path: "/adminstrative-docs",
  },
  SUBJECTS: { id: 10, key: 10, label: "Subjects", path: "/subjects" },
  DEPARTMENTS: { id: 11, key: 11, label: "Departments", path: "/departments" },
  FIELDS: { id: 12, key: 12, label: "Fields", path: "/fields" },
  STUDENTS: { id: 13, key: 13, label: "Students", path: "/students" },
  TEACHERS: { id: 14, key: 14, label: "Teachers", path: "/Teachers" },
  ADMINS: { id: 15, key: 15, label: "Admins", path: "/Admins" },
};

export const loggedInRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      { path: ROUTES.HOME.path, element: <Home /> },
      /**ASSIGNMENTS */
      { path: ROUTES.ASSIGNMENTS.path, element: <Assignments /> },
      {
        path: `${ROUTES.ASSIGNMENTS.path}/view/:id`,
        element: <AssignmentPreview />,
      },
      {
        path: `${ROUTES.ASSIGNMENTS.path}/create`,
        element: <AssignmentsEditor />,
      },
      {
        path: `${ROUTES.ASSIGNMENTS.path}/edit/:id`,
        element: <AssignmentsEditor />,
      },
      /**RECLAMATIONS */
      { path: ROUTES.RECLAMATIONS.path, element: <Reclamations /> },
      /**SUBJECTS */
      { path: ROUTES.SUBJECTS.path, element: <Subjects /> },
      { path: `${ROUTES.SUBJECTS.path}/create`, element: <SubjectEditor /> },
      { path: `${ROUTES.SUBJECTS.path}/edit/:id`, element: <SubjectEditor /> },
      /**DEPARTMENTS */
      { path: ROUTES.DEPARTMENTS.path, element: <Departments /> },
      {
        path: `${ROUTES.DEPARTMENTS.path}/create`,
        element: <DepartmentEditor />,
      },
      {
        path: `${ROUTES.DEPARTMENTS.path}/edit/:id`,
        element: <DepartmentEditor />,
      },
      /**FIELDS */
      { path: ROUTES.FIELDS.path, element: <Fields /> },
      {
        path: `${ROUTES.FIELDS.path}/create`,
        element: <FieldsEditor />,
      },
      {
        path: `${ROUTES.FIELDS.path}/edit/:id`,
        element: <FieldsEditor />,
      },
      /** STUDENTS */
      { path: ROUTES.STUDENTS.path, element: <Students /> },
      {
        path: `${ROUTES.STUDENTS.path}/create`,
        element: <StudentEditor />,
      },
      {
        path: `${ROUTES.STUDENTS.path}/edit/:id`,
        element: <StudentEditor />,
      },
      /** TEACHERS */
      { path: ROUTES.TEACHERS.path, element: <Teachers /> },
      {
        path: `${ROUTES.TEACHERS.path}/create`,
        element: <TeacherEditor />,
      },
      {
        path: `${ROUTES.TEACHERS.path}/edit/:id`,
        element: <TeacherEditor />,
      },
      /**RECLAMATIONS */
      {
        path: `${ROUTES.RECLAMATIONS.path}/create`,
        element: <ReclamationsEditor />,
      },
      {
        path: `${ROUTES.RECLAMATIONS.path}/edit/:id`,
        element: <ReclamationsEditor />,
      },
      /**SCHEDULE */
      { path: ROUTES.SCHEDULES.path, element: <Schedules /> },
      {
        path: `${ROUTES.SCHEDULES.path}/view/:id`,
        element: <SchedulePreview />,
      },
      {
        path: `${ROUTES.SCHEDULES.path}/create`,
        element: <SchedulesEditor />,
      },
      {
        path: `${ROUTES.SCHEDULES.path}/edit/:id`,
        element: <SchedulesEditor />,
      },
      /**MARK */
      { path: ROUTES.MARKS.path, element: <Marks /> },
      /**ADMINISTRATIVE_DOCS */
      {
        path: ROUTES.ADMINISTRATIVE_DOCS.path,
        element: <AdminstrativeDocsRequests />,
      },
      {
        path: `${ROUTES.ADMINISTRATIVE_DOCS.path}/create`,
        element: <ADRequestEditor />,
      },
      {
        path: `${ROUTES.ADMINISTRATIVE_DOCS.path}/edit/:id`,
        element: <ADRequestEditor />,
      },
      /** ADMINS */
      { path: ROUTES.ADMINS.path, element: <Admins /> },
      {
        path: `${ROUTES.ADMINS.path}/create`,
        element: <AdminEditor />,
      },
      {
        path: `${ROUTES.ADMINS.path}/edit/:id`,
        element: <AdminEditor />,
      },
    ],
  },
];

export const unauthenticatedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [{ path: ROUTES.LOGIN.path, element: <Login /> }],
  },
];
