
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Paintings from './components/Paintings';
import Photography from './components/Photography';
import Poetry from './components/Poetry';
import Essays from './components/Essays';
import Fashion from './components/Fashion';
import Home from './components/Home';
import PostPage from './components/PostPage';
import PageNotFound from './components/PageNotFound';
import Layout from './components/Layout';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home  />} />
        <Route path="post">
          <Route path=":id" element={<PostPage />} />
        </Route>
        <Route path="paintings" element={<Paintings />} />
        <Route path="photography" element={<Photography />} />
        <Route path="poetry" element={<Poetry />} />
        <Route path="essays" element={<Essays />} />
        <Route path="fashion" element={<Fashion />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App
