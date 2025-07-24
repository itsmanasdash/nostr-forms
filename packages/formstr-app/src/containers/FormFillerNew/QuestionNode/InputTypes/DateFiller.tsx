import { DatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";

interface DateFillerProps {
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export const DateFiller: React.FC<DateFillerProps> = ({
  onChange,
  value,
  disabled = false,
}) => {
  const handleChange: DatePickerProps["onChange"] = (date, dateString) => {
    onChange(dateString);
  };
  return (
    <>
      <DatePicker
        onChange={handleChange}
        value={value ? dayjs(value) : undefined}
        disabled={disabled}
      />
    </>
  );
};
