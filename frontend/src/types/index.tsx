interface UserType {
  _id: string;
  name: string;
  username: string;
}
interface PostType {
  _id: string;
  user: UserType;
  postType: string;
  postCategory: string;
  title: string,
  imgSrc?: string;
  postContent?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type {UserType, PostType};