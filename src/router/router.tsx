import { RouteObject } from "react-router-dom";
import { AuthenticatedLayout } from "../Components/Common/layouts/Authenticated";
import { UnauthenticatedLayout } from "../Components/Common/layouts/UnauthenticatedLayout";

import { RequestsStats } from "../Pages/AcademicRecords/requestsStats";
import { MakeRequests } from "../Pages/AcademicRecords/makeRequests";
import { AssignmentsEditor } from "../Pages/Assignments/Editor";
import { AssignmentView } from "../Pages/Assignments/View";
import { Assignments } from "../Pages/Assignments/List";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Marks } from "../Pages/Marks";
import { ReclamationsEditor } from "../Pages/Reclamations/Editor";
import { Reclamations } from "../Pages/Reclamations/List";
import { Schedule } from "../Pages/Schedule";
import { TodoList } from "../Pages/TodoList";

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
  SCHEDULE: { id: 5, key: 5, label: "Schedule", path: "/schedule" },
  MARKS: { id: 6, key: 6, label: "Marks", path: "/marks" },
  ACADEMIC_RECORDS: {
    id: 7,
    key: 7,
    label: "Academic Records",
    path: "/academic-records",
    children: [
      {
        id: 8,
        key: 8,
        label: "Make a Request",
        path: "/academic-records/make-request",
      },
      {
        id: 9,
        key: 9,
        label: "Requests Stats",
        path: "/academic-records/requests",
      },
    ],
  },
  TODO_LIST: { id: 10, key: 10, label: "Todo List", path: "/todo-list" },
};

export const loggedInRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      { path: ROUTES.HOME.path, element: <Home /> },
      { path: ROUTES.ASSIGNMENTS.path, element: <Assignments /> },
      { path: `${ROUTES.ASSIGNMENTS.path}/view/:id`, element: <AssignmentView /> },
      { path: `${ROUTES.ASSIGNMENTS.path}/create`, element: <AssignmentsEditor /> },
      { path: `${ROUTES.ASSIGNMENTS.path}/edit/:id`, element: <AssignmentsEditor /> },
      { path: ROUTES.RECLAMATIONS.path, element: <Reclamations /> },
      { path: `${ROUTES.RECLAMATIONS.path}/create`, element: <ReclamationsEditor /> },
      { path: `${ROUTES.RECLAMATIONS.path}/edit/:id`, element: <ReclamationsEditor /> },
      { path: ROUTES.SCHEDULE.path, element: <Schedule /> },
      { path: ROUTES.MARKS.path, element: <Marks /> },
      { path: "/academic-records/make-request", element: <MakeRequests /> },
      { path: "/academic-records/requests", element: <RequestsStats /> },
      { path: ROUTES.TODO_LIST.path, element: <TodoList /> },
    ],
  },
];

export const unauthenticatedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [
      { path: ROUTES.LOGIN.path, element: <Login /> },
    ],
  },
];
