export const metadata = {
  title: 'Find a Stockist | Pawvy',
  description: "Find where to buy Pawvy's pet wellness brands near you in Singapore.",
};

// Placeholder — real build needs: partner locations geocoded (do all 107
// B2B partner records have full addresses currently?), a map provider
// (Google Maps or Mapbox — needs an API key, same pattern as Stripe/Resend),
// and filter UI (by brand, by area). Scoping this properly once we're
// ready, per the earlier discussion.
export default function StockistPage() {
  return (
    <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 20px' }}>
      <h1>Find a Stockist</h1>
      <p style={{ color: '#666' }}>
        A searchable map of where to find Pawvy brands near you is coming soon.
      </p>
    </div>
  );
}
