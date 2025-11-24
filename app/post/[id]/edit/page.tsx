'use client';
import Link from 'next/link';

import { useEffect, useMemo, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => (Array.isArray(params.id) ? params.id[0] : params.id), [params.id]);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!id) return;

    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/posts/${id}`, { signal: ctrl.signal });

        const data: Post = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (e: unknown) {
        if ((e as { name?: string })?.name !== 'AbortError') {
          setError('Gagal memuat data.');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.status === 404) {
        notFound();
        return;
      }

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || `Save failed with ${res.status}`);
      }

      // Setelah update, kembali ke detail post
      router.push(`/post/${id}`);
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="container mt-4">Loading...</p>;
  if (error) return <p className="container mt-4">{error}</p>;

  return (
    <main className="container mt-4">
      <h1>Edit Post</h1>

      <form onSubmit={onSubmit} className="mt-3" noValidate>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            className="form-control"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={saving}>
            Cancel
          </button>
       
        </div>
      </form>
    </main>
  );
}
