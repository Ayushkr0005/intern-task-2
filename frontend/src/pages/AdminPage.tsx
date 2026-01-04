import AdminRoute from '../components/AdminRoute';
import AdminCoursesPanel from '../admin/AdminCoursesPanel';
import AdminUsersPanel from '../admin/AdminUsersPanel';

export default function AdminPage() {
  return (
    <AdminRoute>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-slate-600">Manage courses and view users.</p>
        </div>

        <AdminCoursesPanel />
        <AdminUsersPanel />
      </div>
    </AdminRoute>
  );
}
