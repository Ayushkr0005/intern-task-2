import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-sm text-slate-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
