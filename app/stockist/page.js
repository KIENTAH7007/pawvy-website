import StockistDirectory from '../../components/StockistDirectory';
import { stockistApi, shopApi } from '../../lib/api';

export const metadata = {
  title: 'Find a Stockist | Pawvy',
  description: "Find where to buy Pawvy's pet wellness brands near you in Singapore — filterable by brand and region.",
};

// Server Component — fetches the initial stockist list server-side (real
// HTML/SEO value), interactive filtering handled client-side after that
// via StockistDirectory. No maps/geocoding API anywhere in this feature —
// region-tag + brand filtering plus a free Google Maps search link per
// result gives the same real-world utility at zero cost.
export default async function StockistPage() {
  const [{ stockists }, { brands }] = await Promise.all([
    stockistApi.list({}),
    shopApi.brands(),
  ]);

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 20px' }}>
      <h1>Find a Stockist</h1>
      <p style={{ color: '#666' }}>
        Pawvy brands are available at pet stores, groomers, and vet clinics across Singapore.
        Filter by brand or region to find one near you.
      </p>
      <StockistDirectory initialStockists={stockists} brands={brands} />
    </div>
  );
}
