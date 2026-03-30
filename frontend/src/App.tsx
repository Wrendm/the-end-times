
import { Route, Routes } from 'react-router-dom';
import './App.css';
import CategoryPage from './components/CategoryPage';
import Home from './components/Home';
import PostPage from './components/PostPage';
import ProfilePage from './components/ProfilePage';
import PageNotFound from './components/PageNotFound';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/AccountDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/authprovider';



function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post">
            <Route index element={<PageNotFound />} />
            <Route path=":id" element={<PostPage />} />
          </Route>
          <Route path="users">
            <Route index element={<PageNotFound />} />
            <Route path=":id" element={<ProfilePage />} />
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App
