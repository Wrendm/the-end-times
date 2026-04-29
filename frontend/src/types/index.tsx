import type { ReactNode } from "react";

interface UserType {
  id: string;
  name: string;
  username: string;
  bio: string;
  roles: string[];
}
interface PostType {
  id: string;
  user: UserType;
  postCategory: CategoryType;
  title: string,
  imgSrc?: string;
  postContent?: string;
  videoSrc?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
interface CategoryType {
  id: string;
  name: string;
  type: 'Text' | 'Image' | 'Audio' | 'Video';
  published: boolean;
}

export type DataMap = {
  users: UserType;
  posts: PostType;
  categories: CategoryType;
};

export type Column<T> = {
  key: keyof T & string;
  label?: string;
  render?: (value: any, row: T) => ReactNode;
};

export type { UserType, PostType, CategoryType };