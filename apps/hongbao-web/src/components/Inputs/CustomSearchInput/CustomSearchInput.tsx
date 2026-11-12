import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, TextInput, TextInputProps } from "@mantine/core";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  search: z.string().min(1),
});
type FormField = z.infer<typeof schema>;

interface Props extends TextInputProps {
  searchFn: (value: string) => void;
  clearFn: () => void;
}

const CustomSearchInput: React.FC<Props> = ({
  searchFn,
  clearFn,
  ...props
}) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      search: "",
    },
  });

  const handleSearch = handleSubmit(({ search }) => {
    searchFn(search);
  });

  const handleClear = () => {
    reset({ search: "" });
    clearFn();
  };

  return (
    <form onSubmit={handleSearch} style={{ width: "100%" }}>
      <Controller
        control={control}
        name={"search"}
        render={({ field: { value, onChange } }) => {
          return (
            <TextInput
              {...props}
              value={value}
              onChange={(e) => {
                onChange(e.currentTarget.value);
              }}
              rightSection={
                isDirty ? (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => {
                      handleClear();
                    }}
                  >
                    <XIcon />
                  </ActionIcon>
                ) : (
                  <MagnifyingGlassIcon />
                )
              }
            />
          );
        }}
      />
    </form>
  );
};

export default CustomSearchInput;
