/**
 * Minimal RFC 4180 CSV parser: handles quoted fields, escaped quotes (""),
 * commas and line breaks inside quotes, CRLF/LF line endings and a UTF-8 BOM
 * (Excel adds one when saving "CSV UTF-8"). Fully blank lines are dropped.
 */
export const parseCsv = (text: string): string[][] => {
  const input = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushRow = () => {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
    row = [];
    field = "";
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i++;
      pushRow();
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length) pushRow();
  return rows;
};

/** Quote a value for CSV output when it contains a comma, quote or newline. */
export const toCsvCell = (value: string) =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
