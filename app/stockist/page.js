import StockistDirectory from '../../components/StockistDirectory';
import { stockistApi, shopApi } from '../../lib/api';
import { buildOgMeta } from '../../lib/seo';

const TITLE = 'Find a Stockist | Pawvy';
const DESCRIPTION = "Find where to buy Pawvy's pet wellness brands near you in Singapore — filterable by brand and region.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/stockist' },
  ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/stockist' }),
};

export default async function StockistPage() {
  const [{ stockists }, { brands }] = await Promise.all([
    stockistApi.list({}),
    shopApi.brands(),
  ]);

  return (
    <>
      <section className="subhero">
        <div className="blob" />
        <div className="wrap subhero-inner">
          <div className="eyebrow">Nationwide network</div>
          <h1>Find a stockist near you</h1>
          <p className="desc">
            Pawvy brands are available at pet stores, groomers, and vet clinics across Singapore.
            Filter by brand or region to find one near you.
          </p>
        </div>
      </section>

      <div className="section-curve" style={{ background: 'var(--navy)' }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      <StockistDirectory initialStockists={stockists} brands={brands} />

      <section className="cta-band">
        <div className="wrap">
          <h2>Want to carry our brands in your store?</h2>
          <a href="/#enquiry" className="btn btn-orange"><span>Become a stockist</span></a>
        </div>
      </section>
    </>
  );
}
