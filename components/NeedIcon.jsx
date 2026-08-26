// Custom SVG icons for the Shop-by-Need categories (Aug 2026, per Janice's
// direction) — replaces plain emoji, which can't reliably represent
// specific requested shapes (two joined bones for Joint, a bathtub with
// bubbles for Grooming) and render inconsistently across devices/OSes
// anyway. Skin & Coat and Dental keep their original sparkle/tooth
// concepts (not flagged for change) but are now the same SVG style as
// the other six, for visual consistency across the set.
export default function NeedIcon({ slug, size = 1 }) {
  const s = { width: `${size}em`, height: `${size}em`, display: 'block' };
  switch (slug) {
    case 'skin-coat':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
        </svg>
      );
    case 'chew':
      // Single bone silhouette.
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="4.2" cy="8.5" r="2.4" /><circle cx="4.2" cy="15.5" r="2.4" />
          <circle cx="19.8" cy="8.5" r="2.4" /><circle cx="19.8" cy="15.5" r="2.4" />
          <rect x="4.2" y="10.6" width="15.6" height="2.8" rx="1.4" />
        </svg>
      );
    case 'enrichment':
      // Puzzle piece, blue-to-yellow gradient per Janice's direction.
      return (
        <svg style={s} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="needEnrichGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2D98DA" />
              <stop offset="1" stopColor="#F7B731" />
            </linearGradient>
          </defs>
          <path
            fill="url(#needEnrichGrad)"
            d="M8 4h3a2 2 0 104 0h3a1 1 0 011 1v3a2 2 0 100 4v3a1 1 0 01-1 1h-3a2 2 0 10-4 0H8a1 1 0 01-1-1v-3a2 2 0 100-4V5a1 1 0 011-1z"
          />
        </svg>
      );
    case 'gut':
      // Rounded stomach-organ silhouette.
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 3C6 3 4 5.8 4 9.5 4 14.5 8 19 13 19c3.4 0 6-2.2 6-5 0-1.8-1-3-2.6-3.6 1-1.1 1.3-2.8.3-4.1C15.6 4.6 13.5 4 11.7 4.6 11 3.8 10.3 3 9.5 3z" />
        </svg>
      );
    case 'food':
      // Bowl with a mound of food inside.
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12.5a9 4.5 0 0018 0v1a9 4.8 0 01-18 0z" />
          <ellipse cx="12" cy="12.3" rx="9" ry="3.6" opacity=".55" />
          <circle cx="9" cy="9.3" r="1.4" /><circle cx="12.3" cy="7.6" r="1.5" /><circle cx="15.3" cy="9.2" r="1.3" />
        </svg>
      );
    case 'dental':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.2 2 5 4.4 5 7.8c0 2.6 1.3 3.7 1.5 6.4.15 2 .5 5.3 2 5.3 1.5 0 1.6-3.4 3.5-3.4s2 3.4 3.5 3.4c1.5 0 1.85-3.3 2-5.3.2-2.7 1.5-3.8 1.5-6.4C19 4.4 15.8 2 12 2z" />
        </svg>
      );
    case 'grooming':
      // Bathtub with bubbles.
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13h18v1.5A5.5 5.5 0 0115.5 20h-7A5.5 5.5 0 013 14.5z" fill="currentColor" stroke="none" />
          <path d="M3 13V8.5A2.5 2.5 0 015.5 6H7" />
          <circle cx="17.5" cy="5.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="19.8" cy="8" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="15.3" cy="3.6" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'joints':
      // Two bones crossing/joined at an angle.
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <g transform="rotate(24 12 12)">
            <circle cx="4.5" cy="9" r="2" /><circle cx="4.5" cy="15" r="2" />
            <circle cx="19.5" cy="9" r="2" /><circle cx="19.5" cy="15" r="2" />
            <rect x="4.5" y="10.6" width="15" height="2.8" rx="1.4" />
          </g>
          <g transform="rotate(-24 12 12)" opacity=".82">
            <circle cx="4.5" cy="9" r="2" /><circle cx="4.5" cy="15" r="2" />
            <circle cx="19.5" cy="9" r="2" /><circle cx="19.5" cy="15" r="2" />
            <rect x="4.5" y="10.6" width="15" height="2.8" rx="1.4" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}
