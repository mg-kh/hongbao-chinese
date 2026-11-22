import { Group, Radio, RadioGroupProps, Stack } from "@mantine/core";
import DOMPurify from "dompurify";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Option = { label: string; value: string };

interface Props<T extends FieldValues> extends Omit<
  RadioGroupProps,
  "children"
> {
  control: Control<T>;
  name: Path<T>;
  data: Option[];
}

const CustomRadioGroup = <T extends FieldValues>({
  control,
  name,
  data,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => {
        return (
          <Radio.Group
            error={fieldState.error?.message}
            {...props}
            value={value ?? ""}
            onChange={onChange}
          >
            <Stack gap="xs" mt="xs">
              {data.map((option) => (
                <Radio.Card
                  key={option.value}
                  value={option.value}
                  radius="md"
                  p="sm"
                >
                  <Group wrap="nowrap" align="center" gap="sm">
                    <Radio.Indicator />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: option.label,
                      }}
                    />
                  </Group>
                </Radio.Card>
              ))}
            </Stack>
          </Radio.Group>
        );
      }}
    />
  );
};

export default CustomRadioGroup;
