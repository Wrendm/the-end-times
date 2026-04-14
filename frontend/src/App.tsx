import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/authprovider';

import Layout from './components/Layout';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';

import Register from './components/Register';
import Login from './components/Login';

import Dashboard from './components/AccountDashboard';
import AdminDashboard from './components/AdminDashboard';

import PostPage from './components/PostPage';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';

import CategoryPage from './components/CategoryPage';
import CreateCategory from './components/CreateCategory';

import ProfilePage from './components/ProfilePage';
import EditUser from './components/EditUser';

import ProtectedRoute from './components/ProtectedRoute';
import EditCategory from './components/EditCategory';
import EditUserRoles from './components/EditUserRoles';

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
            <Route path=":id/edit" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } />
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
          <Route path="admin">
            <Route index element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="posts/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EditPost />
              </ProtectedRoute>
            } />
            <Route path="users/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EditUser />
              </ProtectedRoute>
            } />
            <Route path="users/:id/roles" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EditUserRoles />
              </ProtectedRoute>
            } />
            <Route path="categories/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EditCategory />
              </ProtectedRoute>
            } />
            <Route path="categories/create" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <CreateCategory />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;