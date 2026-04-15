import type { Column, CategoryType } from "../types";
import { categoryColumnsBase } from "./baseColumns";
import CategoryActions from "../components/table/table-actions/CategoryActions";

export const categoryColumns = (
  handleDeleteCategory: (id: string) => void
): Column<"categories">[] => [
  ...categoryColumnsBase,
  {
    key: "id",
    label: "Actions",
    render: (_value, row: CategoryType) => (
      <CategoryActions
        id={row.id}
        handleDeleteCategory={handleDeleteCategory}
      />
    ),
  },
];