import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';

type CourseListItem = {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  difficulty: string;
  thumbnailUrl?: string;
};

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = searchParams.get('category') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const search = searchParams.get('search') || '';

  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (difficulty) qs.set('difficulty', difficulty);
    if (search) qs.set('search', search);
    const s = qs.toString();
    return s ? `?${s}` : '';
  }, [category, difficulty, search]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    apiFetch(`/api/courses${queryString}`)
      .then((data) => {
        if (!mounted) return;
        setCourses((data as any).courses || []);
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
  }, [queryString]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <p className="text-sm text-slate-600">Filter by category, difficulty, or search.</p>
      </div>

      <div className="grid gap-3 rounded-xl border bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set('search', e.target.value);
              else next.delete('search');
              setSearchParams(next);
            }}
          />
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Category (e.g. Web)"
            value={category}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set('category', e.target.value);
              else next.delete('category');
              setSearchParams(next);
            }}
          />
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Difficulty (Beginner/Intermediate/Advanced)"
            value={difficulty}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set('difficulty', e.target.value);
              else next.delete('difficulty');
              setSearchParams(next);
            }}
          />
        </div>
      </div>

      {loading && <div className="text-sm text-slate-600">Loading courses...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && !error && courses.length === 0 && (
          <div className="text-sm text-slate-600">No courses found. Create one as admin.</div>
        )}

        {courses.map((c) => (
          <Link key={c.slug} to={`/courses/${c.slug}`} className="rounded-xl border bg-white p-4 hover:shadow-sm">
            <div className="grid gap-2">
              <div className="text-lg font-semibold">{c.title}</div>
              <div className="text-sm text-slate-600 line-clamp-3">{c.description}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-1">{c.category}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{c.difficulty}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">₹{c.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
