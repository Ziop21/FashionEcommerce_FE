// DateFormatter.ts
import { format, isValid } from "date-fns";

export const formatDate = (date: Date): string => {
  if (!isValid(date)) {
    return "Invalid";
  }
  return format(date, "HH:mm:ss dd-MM-yyyy");
};
