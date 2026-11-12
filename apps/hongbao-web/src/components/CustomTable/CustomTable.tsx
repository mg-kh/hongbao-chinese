"use client";

import { cn } from "@/utils/cn";
import { Box, Stack, Table, TableProps, Text } from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";
import React from "react";
import LoaderComponent from "../LoaderComponent/LoaderComponent";

interface Props<T> extends TableProps {
  onTableRowClick?: (data: T) => void;
  rows?: Array<T>;
  columns?: Array<{
    id: string;
    header: string | React.ReactNode;
    headerClass?: string;
    element: (r: T) => React.ReactNode;
    columnClass?: string;
  }>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  /** Message shown when there are no rows. */
  emptyLabel?: string;
  /** Show a leading auto-incrementing row-number ("No.") column. */
  withNo?: boolean;
  /** Number added to the row index for the "No." column (e.g. `(page - 1) * pageSize`). */
  noOffset?: number;
  /** Header label for the "No." column. */
  noLabel?: string;
}

const CustomTable = <T,>({
  onTableRowClick,
  rows = [],
  columns,
  header,
  footer,
  isLoading,
  emptyLabel = "No data available",
  withNo = true,
  noOffset = 0,
  noLabel = "No.",
  ...props
}: Props<T>) => {
  const isEmpty = rows.length === 0;
  const colCount = (columns?.length ?? 1) + (withNo ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {header && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          {header}
        </div>
      )}

      <Table.ScrollContainer minWidth={"100%"} type="native">
        {isLoading ? (
          <Box py={48}>
            <LoaderComponent />
          </Box>
        ) : (
          <Table
            verticalSpacing={10}
            horizontalSpacing="md"
            withRowBorders={false}
            highlightOnHover={false}
            {...props}
          >
            <Table.Thead className="sticky top-0 z-10 bg-gray-100">
              <Table.Tr className="border-b-2 border-gray-300">
                {withNo && (
                  <Table.Th className="w-14 py-3! text-center! text-xs! font-bold! uppercase! tracking-wide! text-gray-600! whitespace-nowrap">
                    {noLabel}
                  </Table.Th>
                )}
                {columns?.map((c, i) => (
                  <Table.Th
                    key={i}
                    className={cn(
                      "py-3! text-xs! font-bold! uppercase! tracking-wide! text-gray-600! whitespace-nowrap",
                      (withNo || i > 0) && "border-l border-gray-200",
                      c.headerClass,
                    )}
                  >
                    {c.header}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {!isEmpty ? (
                rows.map((row, i) => (
                  <Table.Tr
                    key={i}
                    onClick={() => onTableRowClick?.(row)}
                    className={cn(
                      "border-b border-gray-200 transition-colors duration-100 last:border-b-0",
                      i % 2 === 1 && "bg-gray-50/70",
                      "hover:bg-gray-50!",
                      onTableRowClick && "cursor-pointer",
                    )}
                  >
                    {withNo && (
                      <Table.Td className="text-sm! text-center! font-medium! text-gray-500! align-middle tabular-nums">
                        {noOffset + i + 1}
                      </Table.Td>
                    )}
                    {columns?.map((c, j) => (
                      <Table.Td
                        key={j}
                        className={cn(
                          "text-sm! text-gray-800! align-middle",
                          (withNo || j > 0) && "border-l border-gray-100",
                          c.columnClass,
                        )}
                      >
                        {c.element(row)}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={colCount} className="border-b-0!">
                    <Stack align="center" gap={10} py={44}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <IconDatabaseOff size={22} stroke={1.6} />
                      </div>
                      <Text size="sm" c="dimmed" fw={500}>
                        {emptyLabel}
                      </Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}
      </Table.ScrollContainer>

      {footer && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default CustomTable;
