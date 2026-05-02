// ===== App Router =====
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import IntroducePage from './pages/IntroducePage/IntroducePage';
import SignInPage from './pages/SignInPage/SignInPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ServiceDetailPage from './pages/ServiceDetailPage/ServiceDetailPage';
import MemberManagePage from './pages/MemberManagePage/MemberManagePage';
import ChatPage from './pages/ChatPage/ChatPage';
import AdminBotChatPage from './pages/AdminBotChatPage/AdminBotChatPage';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<IntroducePage />} />
      <Route path="/signin" element={<SignInPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/service/:serviceId" element={<ProtectedRoute><ServiceDetailPage /></ProtectedRoute>} />
      <Route path="/service/:serviceId/members" element={<ProtectedRoute><MemberManagePage /></ProtectedRoute>} />
      <Route path="/service/:serviceId/chat/:appId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/service/:serviceId/bot" element={<ProtectedRoute><AdminBotChatPage /></ProtectedRoute>} />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
