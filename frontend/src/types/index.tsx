interface UserType {
  id: string;
  name: string;
  username: string;
  roles: string[];
}
interface PostType {
  id: string;
  user: UserType;
  postCategory: CategoryType;
  title: string,
  imgSrc?: string;
  postContent?: string;
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

export type { UserType, PostType, CategoryType };