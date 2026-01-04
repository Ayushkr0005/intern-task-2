import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import PrivateRoute from '../components/PrivateRoute';

type Lesson = {
  _id: string;
  title: string;
  order: number;
};

type Course = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  difficulty: string;
  lessons: Lesson[];
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    apiFetch(`/api/courses/${slug}`)
      .then((data) => {
        if (!mounted) return;
        setCourse((data as any).course || null);
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
  }, [slug]);

  const enroll = async () => {
    if (!course) return;
    setEnrolling(true);
    setEnrollError(null);
    try {
      await apiFetch('/api/enroll', { method: 'POST', body: JSON.stringify({ courseId: course._id }) });
    } catch (e: any) {
      setEnrollError(e.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-600">Loading course...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!course) return <div className="text-sm text-slate-600">Course not found.</div>;

  const lessonsSorted = [...(course.lessons || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-white p-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2 py-1">{course.category}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1">{course.difficulty}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1">₹{course.price}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{course.description}</p>
        </div>

        <div className="mt-4">
          <PrivateRoute>
            <button
              onClick={enroll}
              disabled={enrolling}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {enrolling ? 'Enrolling...' : 'Enroll'}
            </button>
          </PrivateRoute>
          {enrollError && <div className="mt-2 text-sm text-red-600">{enrollError}</div>}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Syllabus</h2>
        <div className="mt-3 grid gap-2">
          {lessonsSorted.length === 0 && <div className="text-sm text-slate-600">No lessons yet.</div>}
          {lessonsSorted.map((l) => (
            <div key={l._id} className="rounded-lg border px-3 py-2 text-sm">
              {l.order + 1}. {l.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
