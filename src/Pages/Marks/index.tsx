import { UserType } from "../../types/UserType";
import { StudentMark } from "./StudentMark";
import { useUserSettings } from "../../hooks";
import { TeacherMark } from "./TeacherMark";

export const Marks = () => {
  const { userType } = useUserSettings();

  const usersDisplay = (userType: UserType) => {
    switch (userType) {
      case "Student":
        return <StudentMark />;
      case "Teacher":
        return <TeacherMark />;
      default:
        return <div>Unknown user type</div>;
    }
  };

  return usersDisplay(userType);
};
