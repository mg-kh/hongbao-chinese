import useBaseRequest from "@/hooks/fetching/useBaseRequest";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { BULK_CREATE_FEEDBACK_LIMIT } from "@repo/shared";
import { useQueryClient } from "@tanstack/react-query";
import { chunk } from "lodash";
import { useState } from "react";
import {
  buildFeedbackCsvTemplate,
  parseFeedbackCsv,
  type TCsvFeedbackRow,
} from "../../utils/feedbackCsv";

export type TImportStatus =
  "ready" | "invalid" | "creating" | "created" | "failed";

export type TImportRow = TCsvFeedbackRow & {
  status: TImportStatus;
  message?: string;
};

const useContainer = ({ onClose }: { onClose: () => void }) => {
  const { request } = useBaseRequest();
  const queryClient = useQueryClient();

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<TImportRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const pendingRows = rows.filter(
    (r) => r.status === "ready" || r.status === "failed",
  );
  const counts = {
    total: rows.length,
    invalid: rows.filter((r) => r.status === "invalid").length,
    created: rows.filter((r) => r.status === "created").length,
    failed: rows.filter((r) => r.status === "failed").length,
  };
  const processed = rows.filter(
    (r) => r.status === "created" || r.status === "failed",
  ).length;

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    try {
      const parsed = parseFeedbackCsv(await file.text());
      if (!parsed.length) throw new Error("The CSV has no data rows.");
      setFileName(file.name);
      setRows(
        parsed.map((r) => ({
          ...r,
          status: r.error ? "invalid" : "ready",
          message: r.error,
        })),
      );
    } catch (e) {
      showErrorNoti((e as Error).message);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setRows([]);
  };

  const handleDownloadTemplate = () => {
    // BOM so Excel opens non-Latin text as UTF-8.
    const blob = new Blob(["﻿" + buildFeedbackCsvTemplate()], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedbacks-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Create the pending rows in batches through the bulk endpoint. A batch is
   * all-or-nothing, so its rows are marked created or failed together; a
   * failed batch doesn't stop the next one.
   */
  const handleImport = async () => {
    const queue = pendingRows;
    if (!queue.length) return;
    setIsImporting(true);
    let created = 0;

    for (const batch of chunk(queue, BULK_CREATE_FEEDBACK_LIMIT)) {
      const lines = new Set(batch.map((r) => r.line));
      const patchBatch = (patch: Partial<TImportRow>) =>
        setRows((prev) =>
          prev.map((r) => (lines.has(r.line) ? { ...r, ...patch } : r)),
        );

      patchBatch({ status: "creating", message: undefined });
      try {
        await request({
          url: "dashboard/feedback/bulk",
          method: "POST",
          data: { feedbacks: batch.map((r) => r.payload) },
        });
        created += batch.length;
        patchBatch({ status: "created" });
      } catch (e) {
        patchBatch({
          status: "failed",
          message: (e as TErrorOptions)?.message || "Request failed",
        });
      }
    }

    setIsImporting(false);
    await Promise.all(
      ["feedback", "all-feedbacks"].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );

    const failed = queue.length - created;
    if (failed) {
      showErrorNoti(
        `${created} created, ${failed} failed. Fix and retry the failed rows.`,
      );
    } else {
      showSuccessNoti(`${created} feedback(s) created`);
    }
  };

  const handleClose = () => {
    if (isImporting) return;
    handleReset();
    onClose();
  };

  return {
    fileName,
    rows,
    counts,
    processed,
    pendingCount: pendingRows.length,
    isImporting,
    handleDrop,
    handleReset,
    handleDownloadTemplate,
    handleImport,
    handleClose,
  };
};

export default useContainer;
