"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

type Preview = { file: File; url: string };

const useContainer = () => {
  const form = useFormContext();
  const [preview, setPreview] = useState<Preview | null>(null);
  const previewRef = useRef<Preview | null>(null);

  useEffect(() => {
    previewRef.current = preview;
  }, [preview]);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { file, url: URL.createObjectURL(file) };
    });
  };

  const clearPreview = () => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current.url);
    },
    [],
  );

  return { form, preview, handleDrop, clearPreview };
};

export default useContainer;
