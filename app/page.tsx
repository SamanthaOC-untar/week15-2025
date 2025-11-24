import Link from 'next/link';

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="container mt-4">
      <h1>Blog Posts</h1>
      <Link href="/create" className="btn btn-primary mb-3">
        Create Post
      </Link>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="list-group">
          {posts.map((post: unknown) => (
            <li key={(post as { id: string }).id} className="list-group-item">
              <Link href={`/post/${(post as { id: string }).id}`}>
                {(post as { title: string }).title}
              </Link>
              <span className="text-muted float-end">
                {new Date((post as { createdAt: string }).createdAt).toLocaleDateString('id-ID')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}