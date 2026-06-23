import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Login   from './pages/Login';
import Signup  from './pages/Signup';
import Feed    from './pages/Feed';
import Chat    from './pages/Chat';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/feed" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"               element={<Navigate to="/feed" replace />} />
      <Route path="/home"           element={<Navigate to="/feed" replace />} />
      <Route path="/social"         element={<Navigate to="/feed" replace />} />

      <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup"         element={<PublicRoute><Signup /></PublicRoute>} />

      <Route path="/feed"           element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/chat"           element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="*"               element={<Navigate to="/feed" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                maxWidth: '340px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
