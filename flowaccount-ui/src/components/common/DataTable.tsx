import React from "react";

export interface Column<T> {
  accessor: keyof T | ((data: T) => React.ReactNode);
  header: React.ReactNode;
  cell?: (data: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T, event: React.MouseEvent) => void;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  // Configurable horizontal padding for table cells
  const horizontalPadding = "px-3"; // Change this value to adjust padding

  const getAccessorValue = (item: T, accessor: Column<T>["accessor"]) => {
    if (typeof accessor === "function") {
      return accessor(item);
    }
    return item[accessor as keyof T] as React.ReactNode;
  };

  return (
    <div className="bg-gray-100 rounded-3xl shadow-lg p-1">
      <div className="rounded-[20px] overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: "#148dce" }}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`${horizontalPadding} py-3 text-left text-sm font-bold text-white ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#F2FBFE] transition-colors duration-150 cursor-pointer"
                onClick={(event) => onRowClick?.(item, event)}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`${horizontalPadding} py-4 whitespace-nowrap text-sm text-gray-500 ${
                      column.className || ""
                    }`}
                  >
                    {column.cell
                      ? column.cell(item)
                      : getAccessorValue(item, column.accessor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
