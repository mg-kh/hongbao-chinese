"use client";

import CustomTable from "@/components/CustomTable/CustomTable";
import {
  Badge,
  Button,
  Modal,
  Progress,
  Select,
  Text,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconDownload, IconFileTypeCsv, IconUpload } from "@tabler/icons-react";
import React from "react";
import useContainer, { TImportRow, TImportStatus } from "./useContainer";

interface Props {
  opened: boolean;
  onClose: () => void;
}

const STATUS_BADGE: Record<TImportStatus, { color: string; label: string }> = {
  ready: { color: "blue", label: "Ready" },
  invalid: { color: "orange", label: "Invalid" },
  creating: { color: "yellow", label: "Creating" },
  created: { color: "green", label: "Created" },
  failed: { color: "red", label: "Failed" },
};

const ImportCsvModal: React.FC<Props> = ({ opened, onClose }) => {
  const {
    fileName,
    rows,
    counts,
    processed,
    pendingCount,
    flashcardId,
    setFlashcardId,
    flashcardDropdownData,
    flashcardDropdownDataLoading,
    isImporting,
    handleDrop,
    handleReset,
    handleDownloadTemplate,
    handleImport,
    handleClose,
  } = useContainer({ onClose });

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Import cards from CSV"
      size="xl"
      closeOnClickOutside={!isImporting}
      withCloseButton={!isImporting}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <Select
            label="Add cards to flashcard"
            placeholder="No flashcard"
            data={flashcardDropdownData}
            value={flashcardId}
            onChange={setFlashcardId}
            disabled={flashcardDropdownDataLoading || isImporting}
            searchable
            clearable
            className="sm:w-75"
          />
          <Button
            variant="light"
            leftSection={<IconDownload size={18} />}
            onClick={handleDownloadTemplate}
          >
            Download template
          </Button>
        </div>

        {!rows.length ? (
          <Dropzone
            onDrop={handleDrop}
            accept={["text/csv", "application/vnd.ms-excel", ".csv"]}
            maxFiles={1}
            multiple={false}
          >
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
              <IconUpload size={36} className="text-gray-400" />
              <Text fw={600}>Drop a CSV file here or click to choose</Text>
              <Text size="sm" c="dimmed">
                Columns: cnWord, pinyin, type, meaningEn, meaningMm, plus
                example1_chinese, example1_pinyin, example1_meaningEn,
                example1_meaningMm (example2_…, example3_… for more)
              </Text>
            </div>
          </Dropzone>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <IconFileTypeCsv size={20} className="shrink-0 text-gray-500" />
                <Text size="sm" fw={600} truncate>
                  {fileName}
                </Text>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="light">{counts.total} rows</Badge>
                {!!counts.invalid && (
                  <Badge variant="light" color="orange">
                    {counts.invalid} invalid
                  </Badge>
                )}
                {!!counts.created && (
                  <Badge variant="light" color="green">
                    {counts.created} created
                  </Badge>
                )}
                {!!counts.failed && (
                  <Badge variant="light" color="red">
                    {counts.failed} failed
                  </Badge>
                )}
              </div>
            </div>

            {isImporting && (
              <Progress
                value={(processed / Math.max(counts.total - counts.invalid, 1)) * 100}
                animated
              />
            )}

            <div className="max-h-[50vh] overflow-auto">
              <CustomTable<TImportRow>
                rows={rows}
                withNo={false}
                columns={[
                  {
                    id: "line",
                    header: "Line",
                    element: (r) => <>{r.line}</>,
                  },
                  {
                    id: "cnWord",
                    header: "Word",
                    element: (r) => <>{r.cnWord || "-"}</>,
                  },
                  {
                    id: "pinyin",
                    header: "Pinyin",
                    element: (r) => <>{r.payload.pinyin || "-"}</>,
                  },
                  {
                    id: "meaningEn",
                    header: "Meaning (EN)",
                    element: (r) => (
                      <Text size="sm" lineClamp={1}>
                        {r.payload.meaningEn || "-"}
                      </Text>
                    ),
                  },
                  {
                    id: "examples",
                    header: "Examples",
                    element: (r) => <>{r.payload.exampleUsage?.length ?? 0}</>,
                  },
                  {
                    id: "status",
                    header: "Status",
                    element: (r) => (
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="light"
                          color={STATUS_BADGE[r.status].color}
                        >
                          {STATUS_BADGE[r.status].label}
                        </Badge>
                        {r.message && (
                          <Text size="xs" c="red">
                            {r.message}
                          </Text>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="default"
                onClick={handleReset}
                disabled={isImporting}
              >
                Choose another file
              </Button>
              <Button
                onClick={handleImport}
                loading={isImporting}
                disabled={!pendingCount}
              >
                {counts.failed
                  ? `Retry ${pendingCount} row(s)`
                  : `Create ${pendingCount} card(s)`}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ImportCsvModal;
