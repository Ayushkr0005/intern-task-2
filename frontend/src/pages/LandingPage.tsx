import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="grid gap-8 rounded-xl border bg-white p-8">
      <div className="grid gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Learn faster with structured courses</h1>
        <p className="max-w-2xl text-slate-600">
          Browse curated courses, enroll in seconds, and track your progress lesson by lesson.
        </p>
      </div>

      <div className="flex gap-3">
        <Link to="/courses" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Browse courses
        </Link>
        <Link to="/signup" className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-900">
          Create account
        </Link>
      </div>
    </div>
  );
}
