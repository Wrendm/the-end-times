import type { Column, PostType } from "../types";
import { postColumnsBase } from "./baseColumns";
import PostActions from "../components/table/table-actions/PostActions";

export const postColumns = (
  handleDeletePost: (id: string) => void
): Column<"posts">[] => [
  ...postColumnsBase,
  {
    key: "id",
    label: "Actions",
    render: (_value, row: PostType) => (
      <PostActions
        id={row.id}
        handleDeletePost={handleDeletePost}
      />
    ),
  },
];