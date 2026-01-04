import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-sm text-slate-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
