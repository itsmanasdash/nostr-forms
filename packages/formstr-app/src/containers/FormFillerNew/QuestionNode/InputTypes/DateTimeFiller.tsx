import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

interface DateTimeFillerProps {
  defaultValue?: string;
  onChange: (value: string) => void; // Unix timestamp (seconds) as string
  disabled?: boolean;
  testId?: string;
}

export const DateTimeFiller: React.FC<DateTimeFillerProps> = ({
  defaultValue,
  onChange,
  disabled = false,
  testId = "datetime-filler",
}) => {
  const getInitialDate = (): Dayjs | null => {
    if (!defaultValue) return null;
    const parsed = dayjs(parseInt(defaultValue) * 1000);
    return parsed.isValid() ? parsed : null;
  };

  const [date, setDate] = useState<Dayjs | null>(getInitialDate);

  useEffect(() => {
    if (!defaultValue) {
      setDate(null);
      return;
    }
    let newDate: Dayjs | null = null;
    const parsed = dayjs(parseInt(defaultValue) * 1000);
    newDate = parsed.isValid() ? parsed : null;
    setDate(newDate);
  }, [defaultValue]);

  // Emit initial value on mount
  useEffect(() => {
    if (date) {
      onChange(String(Math.floor(date.valueOf() / 1000)));
    }
  }, []);

  // Handle date (and time) change
  const handleChange = (newDate: Dayjs | null) => {
    setDate(newDate);
    if (newDate) {
      // Convert milliseconds → seconds
      onChange(String(Math.floor(newDate.valueOf() / 1000)));
    } else {
      onChange("");
    }
  };

  return (
    <div>
      <DatePicker
        value={date}
        onChange={handleChange}
        showTime
        style={{ marginBottom: 8, width: "100%" }}
        disabled={disabled}
        placeholder="Pick Date & Time"
        data-testid={`${testId}:picker`}
      />
    </div>
  );
};
