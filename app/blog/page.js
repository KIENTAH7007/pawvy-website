import { buildOgMeta } from '../../lib/seo';

const TITLE = 'Pet Wellness Tips | Pawvy Blog';
const DESCRIPTION = 'Pet care tips and wellness articles from Pawvy.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/blog' }),
};

// Placeholder — real build needs actual blog content/CMS decision (simple
// markdown files vs. a headless CMS) once content strategy is set. Worth
// having per the SEO discussion (fresh, indexable content is a real
// ranking signal), just not urgent to build out before there's content.
export default function BlogPage() {
  return (
    <div style={{ maxWidth: 640, margin: '140px auto 40px', padding: '0 20px' }}>
      <h1>Pet Wellness Tips</h1>
      <p style={{ color: '#666' }}>Articles coming soon.</p>
    </div>
  );
}
