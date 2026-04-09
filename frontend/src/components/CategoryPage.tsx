import PostFeed from "./PostFeed";
import type { PostType } from '../types/index';
import useAxiosFetch from '../hooks/useAxiosFetch';
import DataState from './DataState';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  const { data, fetchError, isLoading } = useAxiosFetch<PostType[]>(
    `/posts?postCategory=${categoryName}`
  );

  const posts = data ?? [];

  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={posts.length === 0 && !isLoading && !fetchError}
      emptyMessage="No posts to display. You should make one!"
    >
      <PostFeed posts={posts} />
    </DataState>
  );
};

export default CategoryPage;