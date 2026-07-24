export const metadata = {
  title: 'Pet Wellness Tips | Pawvy Blog',
  description: 'Pet care tips and wellness articles from Pawvy.',
};

// Placeholder — real build needs actual blog content/CMS decision (simple
// markdown files vs. a headless CMS) once content strategy is set. Worth
// having per the SEO discussion (fresh, indexable content is a real
// ranking signal), just not urgent to build out before there's content.
export default function BlogPage() {
  return (
    <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 20px' }}>
      <h1>Pet Wellness Tips</h1>
      <p style={{ color: '#666' }}>Articles coming soon.</p>
    </div>
  );
}
