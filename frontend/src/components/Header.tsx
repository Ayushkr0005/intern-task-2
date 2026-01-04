import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../lib/api';

export default function Header() {
  const { user, loading, refresh } = useAuth();

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    await refresh();
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-slate-900">
          E-Learn
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/courses" className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : 'text-slate-700')}>
            Courses
          </NavLink>

          {!loading && user && (
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : 'text-slate-700')}>
              Dashboard
            </NavLink>
          )}

          {!loading && user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : 'text-slate-700')}>
              Admin
            </NavLink>
          )}

          {!loading && !user && (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : 'text-slate-700')}>
              Login
            </NavLink>
          )}

          {!loading && user && (
            <button className="rounded-lg border px-3 py-1.5 text-xs font-medium" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
