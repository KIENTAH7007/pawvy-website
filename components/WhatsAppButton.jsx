// No 'use client' needed — this is a static link with no state or hooks,
// so it can render as a Server Component (slightly better for performance,
// nothing to hydrate).
const WHATSAPP_NUMBER = '6596894853'; // Janice's WhatsApp
const DEFAULT_MESSAGE = 'Hi Pawvy! I have a question about ';

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 100,
        width: 56, height: 56, borderRadius: '50%',
        background: '#25D366', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,.25)',
      }}
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39c1.45.79 3.08 1.21 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C22 6.45 17.55 2 12.04 2zm5.87 14.02c-.25.7-1.23 1.28-1.98 1.44-.53.11-1.21.2-3.51-.75-2.94-1.21-4.83-4.19-4.98-4.39-.14-.19-1.19-1.58-1.19-3.01s.74-2.14 1-2.43c.25-.29.55-.36.73-.36.18 0 .37 0 .53.01.17.01.4-.06.62.48.25.6.83 2.07.9 2.22.07.15.12.33.02.53-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.18 1.53 1.91 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.37-.24.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.33.07.12.07.68-.18 1.38z"/>
      </svg>
    </a>
  );
}
