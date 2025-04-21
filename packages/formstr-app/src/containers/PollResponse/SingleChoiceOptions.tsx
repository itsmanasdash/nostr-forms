import { Radio , Typography } from "antd";
import type { RadioChangeEvent } from "antd";
const { Text } = Typography;

interface SingleChoiceOptionsProps {
  options: Array<[string, string, string]>;
  response: string[];
  handleResponseChange: (value: string) => void;
}

export const SingleChoiceOptions: React.FC<SingleChoiceOptionsProps> = ({
  options,
  response,
  handleResponseChange,
}) => {
  const onChange = (e: RadioChangeEvent) => {
    handleResponseChange(e.target.value);
  };

  return (
    <Radio.Group 
      value={response[0]} 
      defaultValue={response[0]} 
      onChange={onChange}
    >
      {options.map((option) => (
        <Radio 
          key={option[1]} 
          value={option[1]}
        >
          <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {option[2]}
            </Text>
        </Radio>
      ))}
    </Radio.Group>
  );
};