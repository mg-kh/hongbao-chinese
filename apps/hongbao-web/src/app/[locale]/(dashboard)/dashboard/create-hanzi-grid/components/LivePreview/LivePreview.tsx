"use client";

import dynamic from "next/dynamic";
import { useFormContext, useWatch } from "react-hook-form";
import PdfDocument from "./components/PdfDocument/PdfDocument";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

const LivePreview = () => {
  const { control, watch } = useFormContext();
  const pages = useWatch({
    control,
    name: "pages",
  });
  const website_name = watch("website_name");
  const website_type = watch("website_type");
  const website_url = watch("website_url");

  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <PdfDocument
        website_name={website_name}
        website_type={website_type}
        website_url={website_url}
        pages={pages}
      />
    </PDFViewer>
  );
};

export default LivePreview;
