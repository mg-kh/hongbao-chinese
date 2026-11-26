import useBaseRequest from "@/hooks/fetching/useBaseRequest";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { BULK_CREATE_CARD_LIMIT } from "@repo/shared";
import { useQueryClient } from "@tanstack/react-query";
import { chunk } from "lodash";
import { useState } from "react";
import useFlashcards from "../../../../hooks/data-fetching/useFlashcards";
import {
  buildCardCsvTemplate,
  parseCardCsv,
  type TCsvCardRow,
} from "../../utils/cardCsv";

export type TImportStatus = "ready" | "invalid" | "creating" | "created" | "failed";

export type TImportRow = TCsvCardRow & {
  status: TImportStatus;
  message?: string;
};

const useContainer = ({ onClose }: { onClose: () => void }) => {
  const { request } = useBaseRequest();
  const queryClient = useQueryClient();
  const { flashcardDropdownData, isLoading: flashcardDropdownDataLoading } =
    useFlashcards();

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<TImportRow[]>([]);
  const [flashcardId, setFlashcardId] = useState<string | null>(null);
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
      const parsed = parseCardCsv(await file.text());
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
    // BOM so Excel opens the Chinese/Myanmar text as UTF-8.
    const blob = new Blob(["﻿" + buildCardCsvTemplate()], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cards-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Create the pending rows in batches through the bulk endpoint (one request
   * per row trips the API rate limiter). A batch is all-or-nothing, so its
   * rows are marked created or failed together; a failed batch doesn't stop
   * the next one.
   */
  const handleImport = async () => {
    const queue = pendingRows;
    if (!queue.length || !flashcardId) return;
    setIsImporting(true);
    let created = 0;

    for (const batch of chunk(queue, BULK_CREATE_CARD_LIMIT)) {
      const lines = new Set(batch.map((r) => r.line));
      const patchBatch = (patch: Partial<TImportRow>) =>
        setRows((prev) =>
          prev.map((r) => (lines.has(r.line) ? { ...r, ...patch } : r)),
        );

      patchBatch({ status: "creating", message: undefined });
      try {
        await request({
          url: "dashboard/card/bulk",
          method: "POST",
          data: { flashcardId, cards: batch.map((r) => r.payload) },
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
      ["card", "flashcard"].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );

    const failed = queue.length - created;
    if (failed) {
      showErrorNoti(
        `${created} created, ${failed} failed. Fix and retry the failed rows.`,
      );
    } else {
      showSuccessNoti(`${created} card(s) created`);
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
  };
};

export default useContainer;
