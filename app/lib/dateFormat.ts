import { formatInTimeZone } from "date-fns-tz";

const dateFormat = (
  date: Date | string,
  format = "dd MMM, yyyy"
): string => {
  return formatInTimeZone(date, "America/New_York", format);
};

export default dateFormat;
