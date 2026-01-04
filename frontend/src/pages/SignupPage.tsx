import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      await refresh();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Create account</h1>
      <p className="mt-1 text-sm text-slate-600">Sign up to enroll and track progress.</p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Password (min 6 chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Sign up'}
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-slate-900">
          Login
        </Link>
      </div>
    </div>
  );
}
