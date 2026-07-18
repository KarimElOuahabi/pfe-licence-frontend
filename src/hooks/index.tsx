import { UserType } from "../types/UserType";

export const useUserSettings = () => {
  return teacher;
};

const teacher = {
  userType: UserType.Teacher,
  userId: 2,
  fieldId: 1,
  menus: getMenusByUserType(UserType.Teacher),
};

const admin = {
  userType: UserType.Admin,
  userId: 2,
  fieldId: 1,
  menus: getMenusByUserType(UserType.Admin),
};

const student = {
  userType: UserType.Student,
  userId: 2,
  fieldId: 1,
  menus: getMenusByUserType(UserType.Student),
};

export function getMenusByUserType(userType: UserType): string[] {
  switch (userType) {
    case UserType.Teacher:
      return [
        "/assignments",
        "/reclamations",
        "/marks",
        "/schedules",
        "/adminstrative-docs",
      ];
    case UserType.Admin:
      return [
        "/assignments",
        "/reclamations",
        "/marks",
        "/schedules",
        "/adminstrative-docs",
      ];
    case UserType.Student:
      return [
        "/departments",
        "/fields",
        "/subjects",
        "/admins",
        "/teachers",
        "/students",
      ];
    default:
      return [];
  }
}
