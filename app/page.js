import HomeCTAButtons from '../components/HomeCTAButtons';

// Server Component — real HTML content in the initial response, good for
// SEO. Only the login-state-aware buttons (HomeCTAButtons) need to be a
// client component; everything else here is static.
export default function Home() {
  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px' }}>
      <h1>Pawvy.co</h1>
      <p style={{ color: '#666' }}>
        Singapore's exclusive distributor of BetterBone, Salmoil, Lillidale,
        Eastsea Brother, Puzzle Feeder and GiGwi — trusted, natural pet
        wellness products.
      </p>
      <HomeCTAButtons />
    </div>
  );
}
