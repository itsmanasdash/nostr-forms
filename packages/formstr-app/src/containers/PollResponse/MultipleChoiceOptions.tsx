import { Checkbox, Typography } from "antd";

const { Text } = Typography;

interface MultipleChoiceOptionsProps {
  options: Array<[string, string, string]>;
  response: string[];
  handleResponseChange: (value: string) => void;
}

export const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({
  options,
  response,
  handleResponseChange,
}) => {
  const onChange = (value: string) => {
    handleResponseChange(value);
  };
  
  return (
    <div>
      {options.map((option) => (
        <div key={option[1]} style={{ marginBottom: "8px" }}>
          <Checkbox
            value={option[1]}
            checked={response.includes(option[1])}
            onChange={() => onChange(option[1])}
          >
            <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {option[2]}
            </Text>
          </Checkbox>
        </div>
      ))}
    </div>
  );
};