import type { DataMap, Column } from "../types/columns";
import DataRow from "./DataRow";

type DataTableProps<T extends keyof DataMap> = {
  dataset: DataMap[T][];
  columns: Column<T>[];
};

const DataTable = <T extends keyof DataMap>({
  dataset,
  columns,
}: DataTableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>
              {col.label ?? String(col.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataset.map((row) => (
          <DataRow key={row.id} row={row} columns={columns} />
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;