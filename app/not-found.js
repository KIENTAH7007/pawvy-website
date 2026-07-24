import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p style={{ color: '#666' }}>The page you're looking for doesn't exist.</p>
      <p style={{ marginTop: 16 }}><Link href="/">Go home</Link></p>
    </div>
  );
}
