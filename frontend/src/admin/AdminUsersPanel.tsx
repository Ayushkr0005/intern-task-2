import { useEffect, useState } from 'react';
import { apiFetch, type ApiUser } from '../lib/api';

type UserRow = Pick<ApiUser, 'id' | 'name' | 'email' | 'role'> & { createdAt?: string };

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    apiFetch('/api/users')
      .then((data) => {
        if (!mounted) return;
        setUsers((data as any).users || []);
      })
      .catch((e: Error) => {
        if (!mounted) return;
        setError(e.message);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold">Users</div>
        <div className="text-xs text-slate-600">Admin-only user list</div>
      </div>

      <div className="p-4">
        {loading && <div className="text-sm text-slate-600">Loading users...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-slate-500">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
