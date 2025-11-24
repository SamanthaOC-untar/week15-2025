import Link from 'next/link';

export default function NotFound(){
    return (
        <main className = "container mt-5 text-center">
            <h1>404 - Page Not Found</h1>
            <p> The blog post you are looking for does not exist.</p>
            <Link href="/" className='btn btn-primary mt-3'>
                Back to Home
            </Link>
        </main>
    );
}