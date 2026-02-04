interface UserType {
  id: string;
  name: string;
  username: string;
}
interface PostType {
  postId: string;
  userId: string;
  postType: string;
  postCategory: string;
  postdate: string;
  imgSrc: string;
  postContent: string;
}

export type {UserType, PostType};