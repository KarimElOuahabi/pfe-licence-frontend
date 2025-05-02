import { FaHome } from "react-icons/fa";
import { RouteObject } from "react-router-dom";
import { AuthenticatedLayout } from "../Components/Common/layouts/Authenticated";
import { UnauthenticatedLayout } from "../Components/Common/layouts/UnauthenticatedLayout";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { ReclamationsEditor } from "../Pages/Reclamations/Editor";
import { Reclamations } from "../Pages/Reclamations/List";
import { Schedule } from "../Pages/Schedule";
import { Assignments } from "../Pages/Assignments/List";

type RouteItem = {
  id: number;
  key: React.Key;
  label?: string;
  icon?: React.ReactNode;
  path: string;
  style?: React.CSSProperties;
  children?: RouteItem[];
};

const menuItemStyle = {
  backgroundColor: "transparent",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

export const ROUTES: { [key: string]: RouteItem } = {
  LOGIN: { id: 0, key: 0, label: "Login", path: "/login" },
  HOME: {
    id: 1,
    key: 1,
    label: "Home",
    path: "/",
    icon: <FaHome />,
    style: { ...menuItemStyle },
  },
  ASSIGNMENTS: {
    id: 2,
    key: 2,
    label: "Assignments",
    path: "/assignments",
    style: { ...menuItemStyle },
  },
  RECLAMATIONS: {
    id: 3,
    key: 3,
    label: "Reclamations",
    path: "/reclamations",
    style: { ...menuItemStyle },
    // children: [
    //   {
    //     id: 4,
    //     key: 4,
    //     label: "Reclamations Editor",
    //     path: "/reclamations/:id",
    //   },
    // ],
  },
  SCHEDULE: {
    id: 5,
    key: 5,
    label: "Schedule",
    path: "/schedule",
    style: { ...menuItemStyle },
  },
};

export const loggedInRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      {
        path: ROUTES.ASSIGNMENTS.path,
        element: <Assignments />,
      },
      {
        path: ROUTES.RECLAMATIONS.path,
        element: <Reclamations />,
      },
      {
        path: ROUTES.SCHEDULE.path,
        element: <Schedule />,
      },
      {
        path: ROUTES.HOME.path,
        element: <Home />,
      },
    ],
  },
];

export const unauthenticatedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [
      {
        path: ROUTES.LOGIN.path,
        element: <Login />,
      },
    ],
  },
];
