import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomNumberInput from "@/components/Inputs/CustomNumberInput/CustomNumberInput";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Box, Group, Loader, Stack, Text, UnstyledButton } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconMusic, IconUpload, IconX } from "@tabler/icons-react";
import useContainer, { TSectionFormField } from "./useContainer";

interface Props {
  section: TSectionFormField;
}

const EditSectionDrawer = ({ section }: Props) => {
  const {
    form,
    isValid,
    isPending,
    handleFormSubmit,
    uploadedFile,
    audioUrl,
    isUploading,
    isDeleting,
    handleAudioDrop,
    handleAudioDelete,
    handleTimeLimitChange,
  } = useContainer({
    section,
  });

  return (
    <EditDrawerFrame
      title="Edit Section"
      handleUpdate={handleFormSubmit}
      isValid={isValid}
      isPending={isPending}
      showDelete={false}
      updateLabel="Save"
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          <FormSectionWrapper sectionTitle="Basic Info">
            <Stack>
              <CustomTextInput
                name="title"
                control={form.control}
                label="Title"
              />
              <CustomTextArea
                name="description"
                control={form.control}
                label="Description"
              />
              <CustomNumberInput
                name="timeLimit"
                control={form.control}
                label="Time Limit (min)"
                min={1}
                allowDecimal={false}
                allowNegative={false}
                onChange={handleTimeLimitChange}
              />
            </Stack>
          </FormSectionWrapper>

          <FormSectionWrapper sectionTitle="Section Audio">
            <Stack gap={10}>
              <Text c="dimmed" size="sm">
                Upload the listening audio (MP3) for this section.
              </Text>

              {audioUrl ? (
                <Group
                  wrap="nowrap"
                  gap={12}
                  p={12}
                  className="rounded-xl! ring-1! ring-gray-200!"
                >
                  <Box className="flex! h-10! w-10! shrink-0! items-center! justify-center! rounded-lg! bg-gray-100! text-gray-500!">
                    <IconMusic size={20} />
                  </Box>
                  <Stack gap={0} className="min-w-0! flex-1!">
                    <Text size="sm" fw={600} lineClamp={1}>
                      {uploadedFile?.name ?? audioUrl.split("/").pop()}
                    </Text>
                    {uploadedFile && (
                      <Text size="xs" c="dimmed">
                        {(uploadedFile.size / 1024).toFixed(0)} KB
                      </Text>
                    )}
                  </Stack>
                  <UnstyledButton
                    onClick={handleAudioDelete}
                    disabled={isDeleting}
                    aria-label="Remove file"
                    className="flex! h-8! w-8! shrink-0! items-center! justify-center! rounded-full! text-gray-400! transition-colors! duration-200! hover:bg-gray-100! hover:text-gray-600!"
                  >
                    {isDeleting ? <Loader size={14} /> : <IconX size={16} />}
                  </UnstyledButton>
                </Group>
              ) : (
                <Dropzone
                  onDrop={handleAudioDrop}
                  loading={isUploading}
                  onReject={() => {}}
                  maxSize={20 * 1024 ** 2}
                  accept={["audio/mpeg", "audio/mp3"]}
                  radius={10}
                  className="border! border-dashed! border-gray-300! bg-gray-50! transition-colors! duration-200! hover:bg-gray-100!"
                >
                  <Stack
                    align="center"
                    justify="center"
                    gap={8}
                    mih={120}
                    p={20}
                    style={{ pointerEvents: "none" }}
                    className="text-center!"
                  >
                    <IconUpload size={26} className="text-gray-400!" />
                    <Box>
                      <Text size="sm" fw={600}>
                        Drag file here or click to upload
                      </Text>
                      <Text size="xs" c="dimmed">
                        MP3 audio, up to 20 MB
                      </Text>
                    </Box>
                  </Stack>
                </Dropzone>
              )}
            </Stack>
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditSectionDrawer;
