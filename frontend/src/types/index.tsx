interface UserType {
  id: string;
  name: string;
  username: string;
}
interface PostType {
  id: string;
  userId: string;
  username: string;
  postType: string;
  postCategory: string;
  postdate: string;
  title: string,
  imgSrc: string;
  postContent: string;
}

export type {UserType, PostType};