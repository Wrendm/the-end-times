import type { UserType, PostType, CategoryType } from "./index";

// Map each tab to its row type
export type DataMap = {
  users: UserType;
  posts: PostType;
  categories: CategoryType;
};

// Column type for generic DataTable
export type Column<T extends keyof DataMap> = {
  key: keyof DataMap[T];
  label?: string;
  render?: (value: DataMap[T][keyof DataMap[T]], row: DataMap[T]) => React.ReactNode;
};

// Column definitions
export const userColumns: Column<'users'>[] = [
  { key: "id", label: "ID" },
  { key: "username", label: "Username" },
  { key: "name", label: "Name" },
  {
    key: "roles",
    label: "Roles",
    render: (value) => (Array.isArray(value) ? value.join(", ") : String(value)),
  },
];

export const postColumns: Column<'posts'>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "postContent", label: "Content", render: (value) => (value ? String(value) : "-") },
  { key: "published", label: "Published", render: (value) => (value ? "Yes" : "No") },
  { key: "createdAt", label: "Created", render: (value) => new Date(value as string).toLocaleDateString() },
];

export const categoryColumns: Column<'categories'>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "published", label: "Published", render: (value) => (value ? "Yes" : "No") },
];
