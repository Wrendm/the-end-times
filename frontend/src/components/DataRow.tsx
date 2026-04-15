import type { DataMap, Column } from "../types/postColumns";
import DataColumn from "./DataColumn";

type DataRowProps<T extends keyof DataMap> = {
  row: DataMap[T];
  columns: Column<T>[];
};

const DataRow = <T extends keyof DataMap>({
  row,
  columns,
}: DataRowProps<T>) => {
  return (
    <tr>
      {columns.map((col) => {
        const value = row[col.key];
        return (
          <DataColumn
            key={String(col.key)}
            data={col.render ? col.render(value, row) : value}
          />
        );
      })}
    </tr>
  );
};

export default DataRow;