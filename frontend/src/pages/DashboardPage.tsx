import { useEffect, useState } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { apiFetch } from '../lib/api';

const recommendedYoutube = [
  {
    title: 'Playlist 1',
    url: 'https://www.youtube.com/watch?v=yC36gN-rqjo&list=PLKnIA16_RmvYsvB8qkUQuJmJNuiCUJFPL',
  },
  {
    title: 'Playlist 2',
    url: 'https://www.youtube.com/watch?v=Vi9bxu-M-ag&list=PLDzeHZWIZsTo0wSBcg4-NMIbC0L8evLrD',
  },
  {
    title: 'Playlist 3',
    url: 'https://www.youtube.com/watch?v=QXeEoD0pB3E&list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3',
  },
  {
    title: 'Video 4',
    url: 'https://www.youtube.com/watch?v=4XTsAAHW_Tc',
  },
];

type Enrollment = {
  _id: string;
  courseId: {
    title: string;
    slug: string;
    category: string;
    difficulty: string;
  };
  progress?: Record<string, boolean>;
};

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    apiFetch('/api/enrollments/me')
      .then((data) => {
        if (!mounted) return;
        setEnrollments((data as any).enrollments || []);
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
    <PrivateRoute>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-600">Your enrolled courses and progress.</p>
        </div>

        {loading && <div className="text-sm text-slate-600">Loading...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          {!loading && !error && enrollments.length === 0 && (
            <div className="text-sm text-slate-600">No enrollments yet. Browse courses to enroll.</div>
          )}

          {enrollments.map((e) => {
            const progress = e.progress || {};
            const total = Object.keys(progress).length;
            const completed = Object.values(progress).filter(Boolean).length;

            return (
              <div key={e._id} className="rounded-xl border bg-white p-4">
                <div className="text-lg font-semibold">{e.courseId?.title}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {e.courseId?.category} • {e.courseId?.difficulty}
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  Progress: {completed}/{total}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-lg font-semibold">Recommended YouTube</div>
          <div className="mt-1 text-sm text-slate-600">Quick learning resources to continue your progress.</div>

          <div className="mt-3 grid gap-2">
            {recommendedYoutube.map((v) => (
              <a
                key={v.url}
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
              >
                {v.title}
                <div className="mt-1 break-all text-xs text-slate-500">{v.url}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
