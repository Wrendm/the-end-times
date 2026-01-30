interface UserType {
  id: string;
  name: string;
  username: string;
}
interface PostType {
  postId: string;
  userId: string;
  postType: string;
  postdate: string;
  postContent: string;
}

export type {UserType, PostType};