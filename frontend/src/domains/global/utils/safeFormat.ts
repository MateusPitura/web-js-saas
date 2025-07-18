import { format as fnsFormat, parseISO } from "date-fns";
import { DateFormats } from "../types";

interface FormatDateProps {
  date: string;
  format: DateFormats;
}

export default function safeFormat({ date, format }: FormatDateProps) {
  return fnsFormat(parseISO(date), format);
}
