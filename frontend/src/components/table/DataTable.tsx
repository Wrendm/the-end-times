import type { Column } from "../../types/index";

interface DataTableProps<T extends { id: string; [key: string]: any }> {
  dataset: T[];
  columns: Column<any>[];
}

const DataTable = <T extends { id: string; [key: string]: any }>({
  dataset,
  columns,
}: DataTableProps<T>) => {
  if (!dataset || dataset.length === 0) return null;

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>
              {col.label || String(col.key)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {dataset.map((datum) => (
          <tr key={datum.id}>
            {columns.map((col) => {
              const value =
                col.key in datum ? (datum as any)[col.key] : undefined;

              return (
                <td key={`${col.key}-${datum.id}`}>
                  {col.render ? col.render(value, datum) : String(value ?? "")}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;