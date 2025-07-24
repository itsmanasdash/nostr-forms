import { Option } from "@formstr/sdk/dist/formstr/nip101";
import { Select } from "antd";

interface DropdownFillerProps {
  options: Option[];
  onChange: (text: string) => void;
  value?: string;
  disabled?: boolean;
}

export const DropdownFiller: React.FC<DropdownFillerProps> = ({
  options,
  onChange,
  value,
  disabled = false,
}) => {
  return (
    <>
      <Select
        onChange={onChange}
        options={options.map((choice) => {
          let [choiceId, label] = choice;
          return { value: choiceId, label: label };
        })}
        value={value}
        placeholder="Select an option"
        disabled={disabled}
      />
    </>
  );
};
