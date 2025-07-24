import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { Option } from "@formstr/sdk/dist/formstr/nip101";
import {
  Checkbox,
  Input,
  Radio,
  RadioChangeEvent,
  RadioGroupProps,
  Space,
} from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import Markdown from "react-markdown";
import ChoiceFillerStyle from "./choiceFiller.style";
import { ChangeEvent, useState } from "react";

interface ChoiceFillerProps {
  answerType: AnswerTypes.checkboxes | AnswerTypes.radioButton;
  options: Option[];
  onChange: (value: string, message: string) => void;
  value?: string;
  disabled?: boolean;
}

export const ChoiceFiller: React.FC<ChoiceFillerProps> = ({
  answerType,
  options,
  onChange,
  value,
  disabled = false,
}) => {
  const [otherMessage, setOtherMessage] = useState("");
  
  function handleChoiceChange(e: RadioChangeEvent): void;

  function handleChoiceChange(checkedValues: CheckboxValueType[]): void;

  function handleChoiceChange(e: RadioChangeEvent | CheckboxValueType[]) {
    if (Array.isArray(e)) {
      onChange(e.sort().join(";"), otherMessage);
      return;
    }
    onChange(e.target.value, otherMessage);
  }

  function handleMessage(e: ChangeEvent<HTMLInputElement>){
    setOtherMessage(e.target.value)
  }

  let ElementConfig: {
    Element: typeof Radio,
    value?: RadioGroupProps['value']
  } | {
    Element: typeof Checkbox,
    value?: CheckboxGroupProps['value']
  } = {
    Element: Radio,
    value: value
  }
 if (answerType === AnswerTypes.checkboxes) {
   ElementConfig = {
     Element: Checkbox,
     value: value?.split(";")
   }
  }
  return (
    //@ts-ignore
    <ChoiceFillerStyle>
      <ElementConfig.Element.Group
        onChange={handleChoiceChange}
        value={ElementConfig.value}
        disabled={disabled}
      >
        <Space direction="vertical">
          {options.map((choice) => {
            let [choiceId, label, configString] = choice;
            let config = JSON.parse(configString || "{}")
            return (
              <ElementConfig.Element key={choiceId} value={choiceId} disabled={disabled}>
                <Markdown>{label}</Markdown>
                {config.isOther && <Input placeholder="Add an optional message..." onInput={handleMessage} disabled={disabled}/>} 
              </ElementConfig.Element>
            );
          })}
        </Space>
      </ElementConfig.Element.Group>
    </ChoiceFillerStyle>
  );
};
