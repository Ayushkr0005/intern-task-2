import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="text-lg font-semibold">Page not found</div>
      <div className="mt-2 text-sm text-slate-600">
        Go back to{' '}
        <Link to="/" className="font-medium text-slate-900">
          home
        </Link>
        .
      </div>
    </div>
  );
}
