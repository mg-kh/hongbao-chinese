import { Control, Controller, FieldValues, Path } from "react-hook-form";
import RichTextEditorField from "./components/RichTextEditorField/RichTextEditorField";
import { RichTextEditorCommand } from "./types/richTextEditor.type";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  minHeight?: number;
  commands?: RichTextEditorCommand[];
  showHeader?: boolean;
}

const CustomRichTextEditor = <T extends FieldValues>({
  control,
  name,
  label,
  minHeight,
  commands,
  showHeader = true,
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <RichTextEditorField
          value={field.value}
          onChange={field.onChange}
          label={label}
          error={fieldState.error?.message}
          minHeight={minHeight}
          commands={commands}
          showHeader={showHeader}
        />
      )}
    />
  );
};

export default CustomRichTextEditor;
