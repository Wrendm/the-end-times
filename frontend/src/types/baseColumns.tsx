import type { CategoryType, Column, PostType, UserType } from "./index";

export const userColumnsBase = [
  { key: "id", label: "ID" },
  { key: "username", label: "Username" },
  { key: "name", label: "Name" },
  {
    key: "roles",
    label: "Roles",
    render: (value: string[]) =>
      Array.isArray(value) ? value.join(", ") : String(value),
  },
] satisfies Column<UserType>[];

export const postColumnsBase = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  {
    key: "postContent",
    label: "Content",
    render: (value) => (value ? value : "-"),
  },
  {
    key: "published",
    label: "Published",
    render: (value: boolean) => (value ? "Yes" : "No"),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (value: string) =>
      new Date(value).toLocaleDateString(),
  },
] satisfies Column<PostType>[];

export const categoryColumnsBase: Column<CategoryType>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "published",
    label: "Published",
    render: (value: boolean) => (value ? "Yes" : "No"),
  },
];