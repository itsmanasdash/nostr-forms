import React from "react";
import { Input, Popover, Button } from "antd";
import { SketchPicker, ColorResult } from "react-color";

type Props = {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  fontSize?: number;
  className?: string;
  disabled?: boolean;
};

const SPAN_WRAPPER_REGEX =
  /^<span style="color:\s*([^"]+)">\s*([\s\S]*?)\s*<\/span>$/i;

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const unescapeHtml = (str: string) =>
  str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

export const ColorfulMarkdownTextarea: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  fontSize,
  className,
  disabled,
}) => {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [color, setColor] = React.useState("#000000");
  const [editableText, setEditableText] = React.useState<string>("");

  React.useEffect(() => {
    if (!value) {
      setEditableText("");
      return;
    }
    const match = value.match(SPAN_WRAPPER_REGEX);
    if (match) {
      const [, matchedColor, inner] = match;
      if (matchedColor) setColor(matchedColor.trim());
      setEditableText(unescapeHtml(inner ?? ""));
    } else {
      setEditableText(unescapeHtml(value));
    }
  }, [value]);

  const handleColorChange = (c: ColorResult) => {
    setColor(c.hex);
    setPickerOpen(false);
    onChange(`<span style="color:${c.hex}">${escapeHtml(editableText)}</span>`);
  };

  const clearColor = () => {
    setColor("#000000");
    setPickerOpen(false);
    onChange(`<span style="color:#000000">${escapeHtml(editableText)}</span>`);
  };

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Text area */}
      <Input.TextArea
        value={editableText}
        style={{ color: color, fontSize: fontSize }}
        onChange={(e) => {
          const newText = e.target.value;
          setEditableText(newText);
          onChange(`<span style="color:${color}">${escapeHtml(newText)}</span>`);
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoSize
      />

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 0,
        }}
      >
        {/* Color orb */}
        <Popover
          open={pickerOpen}
          onOpenChange={(open) => setPickerOpen(open)}
          content={
            <div style={{ padding: 4 }}>
              <SketchPicker color={color} onChange={handleColorChange} />
              <div style={{ marginTop: 8, textAlign: "right" }}>
                <Button size="small" onClick={clearColor}>
                  Clear
                </Button>
              </div>
            </div>
          }
          placement="topLeft"
          overlayStyle={{ padding: 0 }}
          destroyTooltipOnHide
        >
          <div
            role="button"
            aria-label="Open color picker"
            style={{
              width: 18, // 👈 smaller orb
              height: 18,
              borderRadius: "50%",
              background: color,
              boxShadow: "0 0 0 1px #fff, 0 1px 3px rgba(0,0,0,.2)",
              cursor: "pointer",
            }}
          />
        </Popover>
      </div>
    </div>
  );
};
