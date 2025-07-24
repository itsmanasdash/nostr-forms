import { TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";

dayjs.extend(customParseFormat);

interface TimeFillerProps {
  value?: string;
  onChange: (answer: string, message?: string) => void;
  disabled?: boolean;
}

export const TimeFiller: React.FC<TimeFillerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState<dayjs.Dayjs | null>(
    value ? dayjs(value, "h:mm A") : null
  );

  useEffect(() => {
    if (internalValue) {
      onChange(internalValue.format("h:mm A"), "");
    }
  }, [internalValue]);

  useEffect(() => {
    setInternalValue(value ? dayjs(value, "h:mm A") : null);
  }, [value]);

  return (
    <>
      <TimePicker
      use12Hours
      format="h:mm A"
      value={internalValue}
      onSelect={(val) => setInternalValue(val)}
      allowClear={false}
      disabled={disabled}
    />
    </>
  );
};
