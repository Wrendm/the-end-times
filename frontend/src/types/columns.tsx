import type { UserType, PostType, CategoryType } from "./index";

// Map each tab to its row type
export type DataMap = {
  users: UserType;
  posts: PostType;
  categories: CategoryType;
};

// Column type for generic DataTable
export type Column<T extends keyof DataMap> = {
  key: Extract<keyof DataMap[T], string | number>; // remove symbols
  label?: string;
  render?: (value: DataMap[T][Extract<keyof DataMap[T], string | number>], row: DataMap[T]) => React.ReactNode;
};

export const userColumnsBase: Column<'users'>[] = [
  { key: "id", label: "ID" },
  { key: "username", label: "Username" },
  { key: "name", label: "Name" },
  {
    key: "roles",
    label: "Roles",
    render: (value) => (Array.isArray(value) ? value.join(", ") : String(value)),
  },
];

export const postColumnsBase: Column<'posts'>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  {
    key: "postContent",
    label: "Content",
    render: (value) => (value ? String(value) : "-"),
  },
  {
    key: "published",
    label: "Published",
    render: (value) => (value ? "Yes" : "No"),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (value) => new Date(value as string).toLocaleDateString(),
  },
];

export const categoryColumnsBase: Column<'categories'>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "published",
    label: "Published",
    render: (value) => (value ? "Yes" : "No"),
  },
];

// ----------------- Action column factories -----------------

export const userColumns = (
  handleDeleteUser: (id: string) => void
): Column<'users'>[] => [
  ...userColumnsBase,
  {
    key: "id",
    label: "Actions",
    render: (value) => (
      <div className="actions">
        <a href={`/admin/users/edit/${value}`}>Edit</a> |{" "}
        <a href={`/admin/users/${value}/roles`}>Edit Roles</a> |{" "}
        <button onClick={() => handleDeleteUser(value as string)}>Delete</button>
      </div>
    ),
  },
];

export const postColumns = (
  handleDeletePost: (id: string) => void
): Column<'posts'>[] => [
  ...postColumnsBase,
  {
    key: "id",
    label: "Actions",
    render: (value) => (
      <div className="actions">
        <a href={`/admin/posts/edit/${value}`}>Edit</a> |{" "}
        <button onClick={() => handleDeletePost(value as string)}>Delete</button>
      </div>
    ),
  },
];

export const categoryColumns = (
  handleDeleteCategory: (id: string) => void
): Column<'categories'>[] => [
  ...categoryColumnsBase,
  {
    key: "id",
    label: "Actions",
    render: (value) => (
      <div className="actions">
        <a href={`admin/categories/edit/${value}`}>Edit</a> |{" "}
        <button onClick={() => handleDeleteCategory(value as string)}>Delete</button>
      </div>
    ),
  },
];
