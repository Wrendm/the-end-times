import type { Column } from "../../types/index.tsx";
import DataColumn from "./DataColumn.tsx";

type DataRowProps<T> = {
  row: T;
  columns: Column<T>[];
};

const DataRow = <T,>({ row, columns }: DataRowProps<T>) => {
  return (
    <tr>
      {columns.map((col) => {
        const value = row[col.key as keyof T];

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