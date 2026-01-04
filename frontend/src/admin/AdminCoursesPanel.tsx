import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

type LessonInput = {
  title: string;
  contentHtml: string;
  videoUrl?: string;
  order: number;
};

type CourseRow = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  difficulty: string;
  thumbnailUrl?: string;
  lessons?: { _id: string; title: string; order: number }[];
};

const emptyCourse = {
  title: '',
  slug: '',
  description: '',
  price: 0,
  category: '',
  difficulty: '',
  thumbnailUrl: '',
  lessonsJson: '[]',
};

export default function AdminCoursesPanel() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ ...emptyCourse });
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => courses.find((c) => c._id === selectedId) || null, [courses, selectedId]);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/api/courses');
      setCourses((data as any).courses || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCourses();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setForm({
      title: selected.title,
      slug: selected.slug,
      description: selected.description,
      price: selected.price,
      category: selected.category,
      difficulty: selected.difficulty,
      thumbnailUrl: selected.thumbnailUrl || '',
      lessonsJson: JSON.stringify((selected.lessons || []).sort((a, b) => a.order - b.order), null, 2),
    });
  }, [selectedId]);

  const parseLessons = () => {
    if (!form.lessonsJson.trim()) return [];
    const parsed = JSON.parse(form.lessonsJson);
    return parsed as LessonInput[];
  };

  const onCreateOrUpdate = async () => {
    setSaving(true);
    setError(null);

    try {
      const lessons = parseLessons();
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        difficulty: form.difficulty,
        thumbnailUrl: form.thumbnailUrl || undefined,
        lessons,
      };

      if (selectedId) {
        await apiFetch(`/api/courses/${selectedId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/api/courses', { method: 'POST', body: JSON.stringify(payload) });
      }

      await loadCourses();
      setSelectedId(null);
      setForm({ ...emptyCourse });
    } catch (e: any) {
      setError(e.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this course?');
    if (!ok) return;

    setError(null);
    try {
      await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (selectedId === id) {
        setSelectedId(null);
        setForm({ ...emptyCourse });
      }
      await loadCourses();
    } catch (e: any) {
      setError(e.message || 'Failed to delete course');
    }
  };

  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold">Courses</div>
        <div className="text-xs text-slate-600">Create, edit, and delete courses</div>
      </div>

      <div className="grid gap-6 p-4 lg:grid-cols-2">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Existing courses</div>
            <button
              className="rounded-lg border px-3 py-1.5 text-xs font-medium"
              onClick={() => {
                setSelectedId(null);
                setForm({ ...emptyCourse });
              }}
            >
              New
            </button>
          </div>

          {loading && <div className="text-sm text-slate-600">Loading courses...</div>}
          {!loading && courses.length === 0 && <div className="text-sm text-slate-600">No courses yet.</div>}

          <div className="grid gap-2">
            {courses.map((c) => (
              <div key={c._id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <button
                  className="text-left"
                  onClick={() => {
                    setSelectedId(c._id);
                  }}
                >
                  <div className="text-sm font-semibold">{c.title}</div>
                  <div className="text-xs text-slate-600">{c.slug}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">{c.category}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">{c.difficulty}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">₹{c.price}</span>
                  </div>
                </button>

                <button className="rounded-lg border px-3 py-1.5 text-xs" onClick={() => onDelete(c._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="text-sm font-semibold">{selectedId ? 'Edit course' : 'Create course'}</div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="grid gap-3">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Slug (kebab-case)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <textarea
              className="min-h-24 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value as any }))}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Difficulty"
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
              />
            </div>

            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Thumbnail URL (optional)"
              value={form.thumbnailUrl}
              onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
            />

            <div className="grid gap-1">
              <div className="text-xs text-slate-600">Lessons JSON (array). Example:</div>
              <pre className="rounded-lg border bg-slate-50 p-2 text-xs text-slate-700">{'[\n  { "title": "Intro", "contentHtml": "<p>...</p>", "order": 0 }\n]'}</pre>
              <textarea
                className="min-h-40 w-full rounded-lg border px-3 py-2 font-mono text-xs"
                value={form.lessonsJson}
                onChange={(e) => setForm((f) => ({ ...f, lessonsJson: e.target.value }))}
              />
            </div>

            <button
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              onClick={onCreateOrUpdate}
            >
              {saving ? 'Saving...' : selectedId ? 'Update course' : 'Create course'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
