import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import type { PostType } from './types/index';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import Layout from './components/Layout';
import useAxiosFetch from './hooks/useAxiosFetch';


function App() {
  const [posts, setPosts] = useState<PostType[]>([]);

  const {
    data: postData,
    fetchError,
    isLoading,
  } = useAxiosFetch<PostType[]>('http://localhost:3500/posts');

  useEffect(() => {
    if (postData) {
      setPosts(postData);
    }
  }, [postData]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home posts={posts} isLoading={isLoading} fetchError={fetchError} />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App
