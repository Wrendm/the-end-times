import type { Column, UserType } from "../types";
import { userColumnsBase } from "./baseColumns";
import UserActions from "../components/table/table-actions/UserActions";

export const userColumns = (
  handleDeleteUser: (id: string) => void
): Column<UserType>[] => [
  ...userColumnsBase,
  {
    key: "id",
    label: "Actions",
    render: (_value, row: UserType) => (
      <UserActions
        id={row.id}
        handleDeleteUser={handleDeleteUser}
      />
    ),
  },
];