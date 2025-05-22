import React from "react";
import { Calendar, Badge } from "antd";
import type { Dayjs } from "dayjs";

interface SpecialDay {
  date: string; // Format: "YYYY-MM-DD"
  name: string;
}

const specialDays: SpecialDay[] = [
  { date: "2025-01-01", name: "New Year's Day" },
  { date: "2025-05-01", name: "Labor Day" },
  { date: "2025-12-25", name: "Christmas" },
  { date: "2025-06-15", name: "University Closed" },
];

const getSpecialDay = (date: Dayjs) => {
  const formatted = date.format("YYYY-MM-DD");
  return specialDays.find((d) => d.date === formatted);
};

export const CustomCalendar: React.FC = () => {
  const cellRender = (current: Dayjs) => {
    const special = getSpecialDay(current);
    return special ? (
      <div>
        <Badge color="green" text={special.name} />
      </div>
    ) : null;
  };

  return <Calendar fullscreen={false} cellRender={cellRender} />;
};
