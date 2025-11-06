import React from "react";
import { Input, Popover, Button } from "antd";
import { SketchPicker, ColorResult } from "react-color";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import SafeMarkdown from ".";

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
  const [preview, setPreview] = React.useState(true);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [editableText, setEditableText] = React.useState<string>("");

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current?.contains &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setPreview(true); // switch to preview mode
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setPreview(true);
    setPickerOpen(false);
    onChange(`<span style="color:${c.hex}">${escapeHtml(editableText)}</span>`);
  };

  const clearColor = () => {
    setColor("#000000");
    setPickerOpen(false);
    onChange(`<span style="color:#000000">${escapeHtml(editableText)}</span>`);
  };

  // Create display value by wrapping user text with color span
  const displayValue = React.useMemo(() => {
    return `<span style="color:${color}">${escapeHtml(editableText)}</span>`;
  }, [editableText, color]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Content area */}
      {preview ? (
        <div
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: fontSize || 14,
            padding: 0,
            margin: 0,
            cursor: "text",
          }}
          onClick={() => setPreview(false)}
        >
          <SafeMarkdown
            children={displayValue}
            components={{
              p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
              h1: ({ node, ...props }) => (
                <h1 style={{ margin: 0 }} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 style={{ margin: 0 }} {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 style={{ margin: 0 }} {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul style={{ margin: 0, paddingLeft: 16 }} {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol style={{ margin: 0, paddingLeft: 16 }} {...props} />
              ),
              li: ({ node, ...props }) => (
                <li style={{ margin: 0 }} {...props} />
              ),
              span: ({ node, ...props }) => (
                <span style={{ display: "inline-block" }} {...props} />
              ),
            }}
          />
        </div>
      ) : (
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
      )}

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

        {/* Preview toggle button */}
        {preview ? (
          <EditOutlined
            style={{ color: color }}
            color={color}
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevents Popover or parent from re-firing
              setPreview(false); // ✅ safe toggle
            }}
          />
        ) : (
          <EyeOutlined
            style={{ color: color }}
            color={color}
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevents Popover or parent from re-firing
              setPreview(true); // ✅ safe toggle
            }}
          />
        )}
      </div>
    </div>
  );
};
