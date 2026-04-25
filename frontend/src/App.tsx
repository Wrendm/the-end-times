import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/authcontext';

import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import PageNotFound from './components/pages/PageNotFound';

import Register from './components/pages/Register';
import Login from './components/pages/Login';

import Dashboard from './components/pages/AccountDashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import EditUser from './components/features/users/EditUser';

import PostPage from './components/pages/PostPage';
import CreatePost from './components/features/posts/CreatePost';


import CategoryPage from './components/pages/CategoryPage';
import CreateCategory from './components/features/categories/CreateCategory';

import ProfilePage from './components/pages/ProfilePage';


import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* Auth */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          {/* Posts */}
          <Route path="posts">
            <Route index element={<PageNotFound />} />
            <Route path="create" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path=":id" element={<PostPage />} />

          </Route>

          {/* Categories */}
          <Route path="categories">
            <Route index element={<PageNotFound />} />
            <Route path="create" element={
              <ProtectedRoute>
                <CreateCategory />
              </ProtectedRoute>
            } />
            <Route path=":categoryName" element={<CategoryPage />} />
          </Route>

          {/* Users */}
          <Route path="users">
            <Route index element={<PageNotFound />} />
            <Route path=":id" element={<ProfilePage />} />
            <Route path=":id/edit" element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            } />
          </Route>

          {/* Dashboard */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Outlet />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="categories/create" element={<CreateCategory />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;