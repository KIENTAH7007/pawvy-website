// Content for each brand's dedicated page. Keyed by the exact brand names
// used in lib/brandSlugs.js (BRAND_SLUGS / what the backend's /api/shop/brands
// returns), so lookups from either place work directly.

// Turns an FAQ question into a stable anchor id, e.g. for deep-linking a
// product page's "see our sizing guide" link straight to the matching FAQ
// answer. Shared by the FAQ list (which sets the id) and anywhere else
// that needs to build the same link (e.g. the product detail page).
export function faqSlug(question) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
//
// IMPORTANT: this copy (especially the FAQ answers) is provisional —
// drafted to get real pages live with something better than "coming soon",
// not final marketing copy. Needs a real content pass before this is
// treated as the definitive word on any brand.
export const BRAND_CONTENT = {
  'Better Bone': {
    tagline: 'Better for your dog, better for the planet',
    description: "Made from natural, food-safe ingredients, BetterBone provides a durable chewing experience that helps support dental hygiene by reducing plaque and tartar buildup, while satisfying a dog's natural chewing instinct.",
    exclusive: true,
    faqs: [
      ['Is BetterBone safe for puppies?', "BetterBone is ideal for puppies to help alleviate teething pain, promote good dental health, and encourage chewing in a non-destructive way (in other words, keep them from destroying your couch or favorite running shoes). Since puppies have gentler teeth that are still growing in, we recommend the Soft BetterBone durability, which is softer on teeth."],
      ['What is BetterBone made from?', "BetterBone is a plant-based dog chew toy made with Vernovo\u2122 material by Blue Standard. BetterBone's proprietary formula combines GMO-free plant-derived cellulose and GMO-free plant extracts to create a durable, splinter-resistant chew bone that's designed to be safer for dogs and better for the planet."],
      ['How long does BetterBone last?', "Every dog chews differently, so no two BetterBones will wear at the same rate. Lifespan depends on your dog's size, chewing style, chewing frequency, and the durability level selected. For the longest-lasting experience, choose the correct size and durability for your dog. Aggressive chewers may benefit from sizing up or selecting a harder density, while moderate and gentle chewers can enjoy months of regular enrichment from a single BetterBone."],
      ["My dog's BetterBone is flaking - is that ok?", "Yes! Your dog's BetterBone chew toy is designed to flake\u2014not splinter\u2014for a safer chewing experience. These small granules (usually the size of a grain of rice or piece of oatmeal) prevent sharp shards from breaking off, which could injure your dog's mouth. While flakes are normal, large chunks of bone breaking off are not. If your dog wears down the bone easily, we recommend moving up a durability level."],
      ["When should I replace my dog's BetterBone?", "Inspect your BetterBone regularly and replace it when it shows moderate signs of wear or becomes small enough to present a swallowing hazard. As with any dog chew toy, choosing the correct size and durability\u2014and replacing worn products when needed\u2014helps ensure a safe and enjoyable chewing experience."],
      ["My dog's gums bleed a little when they chew their toy \u2013 is this normal?", "A small amount of gum bleeding can happen if your dog has sensitive gums, existing dental disease, or is chewing too aggressively. If the bleeding is minor and stops quickly, it may not be cause for concern. However, persistent bleeding, swollen gums, signs of pain, or frequent bleeding should be evaluated by your veterinarian. If your dog is new to BetterBone, consider switching to a softer density and always supervise chewing sessions."],
      ["Is BetterBone good for my dog's teeth?", "Yes! BetterBone features dental-enrichment textures that help gently clean teeth, massage gums, and reduce plaque buildup as your dog chews. The textured surfaces keep dogs mentally engaged while supporting healthy chewing habits and better oral health. For the safest chewing experience, always choose the durability level that matches your dog's age, size, and chew strength."],
      ['What makes BetterBone different from other dog chew toys?', "BetterBone combines durability, enrichment, safety, and sustainability in one innovative chew toy. Made from plant-based materials, BetterBone is designed to be gentler on teeth, splinter-resistant, and available in multiple durability levels for every type of chewer. It also features dental-enrichment textures and hypoallergenic vegetarian scent infusions to keep dogs engaged and satisfied."],
    ],
    // Optional deep-dive sections rendered between the brand's hero and
    // and the FAQ (see components/BrandDeepDive.jsx). Only Better Bone has
    // this filled in for now — KT approving the design here first before
    // it's built out for the other 5 brands.
    //
    // Durability cards combine BOTH the lifestyle dog photo AND the product
    // packaging shot per KT's request (Option 1 from the two mockups shown —
    // packaging shot as a small inset badge over the dog photo, so the
    // product and the dog using it are tied together in one card instead of
    // two separate repeated grids).
    deepDive: {
      chew: {
        heading: 'The Better Chew',
        intro: "BetterBone is built around your dog's natural chewing habits and dental health — without the health risks that come with rawhide, nylon, or plastic toys.",
        body: "Made from just two food-grade ingredients, BetterBone skips artificial flavours and smells entirely. The classic bone is fully hypoallergenic, making it a safe choice for dogs with sensitive stomachs or skin — and with three durability levels, there's a BetterBone matched to exactly how your dog chews.",
        image: '/brand-features/betterbone/chew-hero.jpg',
      },
      durability: {
        eyebrow: 'For gentle to heavy chewers',
        heading: 'Three Durability Levels',
        sub: 'BetterBone offers three hardness levels for different types of chewing behavior.',
        // seriesIncludes/variationIncludes drive the Add to Cart button
        // (ProductAddButton.jsx) — dynamic discovery rather than a fixed
        // guessed list of sizes/flavors: whatever real BetterBone products
        // exist with "Soft"/"Medium"/"Hard" in their variation text show up
        // automatically as options, each with its own real size/flavor
        // label and live photo. Safer than hardcoding sizes we're not sure
        // exist, and stays correct if the catalog changes.
        //
        // seriesIncludes is "Better Bone" WITH A SPACE — that's the actual
        // backend/database key (see brand-naming notes elsewhere in this
        // file / project memory). "BetterBone" with no space is only the
        // marketing/display spelling; searching for it against item_series
        // never matches anything, which is exactly why every card showed
        // "Unavailable" — same class of bug as the earlier Puzzle Feeder
        // "Name — Color" issue, different root cause.
        levels: [
          {
            label: 'Soft', level: 1, caption: 'Teething puppy, senior dog',
            image: '/brand-features/betterbone/durability-soft.jpg',
            productImage: '/brand-features/betterbone/pack-soft.jpg',
            productName: '40% softer than nylon',
            seriesIncludes: 'Better Bone', variationIncludes: 'Soft',
          },
          {
            label: 'Moderate', level: 2, caption: 'Average chewer',
            image: '/brand-features/betterbone/durability-medium.jpg',
            productImage: '/brand-features/betterbone/pack-medium.jpg',
            productName: '15% softer than nylon',
            seriesIncludes: 'Better Bone', variationIncludes: 'Medium',
          },
          {
            label: 'Hard', level: 3, caption: 'Heavy chewer, constant gnawing',
            image: '/brand-features/betterbone/durability-hard.jpg',
            productImage: '/brand-features/betterbone/pack-hard.jpg',
            productName: 'The real deal',
            seriesIncludes: 'Better Bone', variationIncludes: 'Hard',
          },
        ],
      },
      // "Find The Bone" CTA removed on KT's request — folded into the FAQ
      // section instead, which now carries the same navy design/color that
      // this CTA used to have (see .faq in globals.css).
    },
  },
  'Lillidale': {
    tagline: 'UK-formulated care, from bath to joint support',
    description: "A UK company with more than 30 years' experience in veterinary medicine and animal health, Lillidale offers all-natural, science-backed products for pets — including supplements, grooming, and skincare, from waterless shampoo to joint supplements.",
    exclusive: true,
    // Unlike Salmoil (where every SKU is a fish-oil bottle and the sizing
    // question applies brand-wide, so this is just a string there),
    // Lillidale spans three unrelated sub-ranges and only the three
    // Supplements SKUs (ProJoint/ProHealth/Plaque Guard) have a real
    // dosage-by-weight decision to make — a grooming shampoo or an HOCl
    // spray doesn't need a "how much should I feed" link. So this is a
    // FUNCTION here: given the product, return the matching FAQ question
    // string, or null to skip the link entirely. app/shop/[id]/page.js
    // supports both shapes (string OR function) — see the comment there.
    //
    // All three products share ONE FAQ question/answer (not one entry
    // per product) — first version tried one-per-product, but that made
    // the FAQ list itself longer, trading one problem for another. This
    // version keeps a single FAQ entry, with a CSS-only tab selector
    // INSIDE the answer so the customer picks their product and sees
    // only that table — no scrolling past the other two, and no new
    // FAQ entries added to the list. See the tab markup below for how.
    sizeGuideFaqQuestion: (product) => {
      const text = `${product.item_series || ''} ${product.variation || ''}`;
      return /ProJoint|ProHealth|Plaque Guard/i.test(text)
        ? 'How much should I feed, and how long will each size last?'
        : null;
    },
    faqs: [
      ['Where are the products manufactured?', 'Lillidale products are proudly made in the UK.'],
      ['When can I start feeding ProJoint?', "The exact age to start feeding a maintenance level of Lillidale ProJoint depends on the breed and situation. For example, for a large dog breed prone to joint issues, working dogs or those competing in agility, starting them on a maintenance level as young as 1 year old can be beneficial. For other dog breeds or cats that are not prone to issues and not quite as active, it may be worth considering adding a maintenance level after 2 years of age."],
      ['Is Lillidale ProJoint safe for dogs/cats with sensitive stomachs?', 'Lillidale ProJoint contains gentle natural ingredients and is generally OK for dogs/cats with sensitive stomachs, as it also contains ingredients that can help improve gut wall function. For dogs/cats with sensitive stomachs, we recommend adding Lillidale ProHealth to fully support their gut, immune system, skin, coat, and eye health, specifically focusing on gut health through high-quality ProHealth, which is a combination of probiotics, pre-biotics, and post-biotics.'],
      ['Why does Lillidale use pelletized feed?', `
        <p>Besides the convenience factor, as pellets can be easily fed directly or added to a meal, there are two other key advantages of pellets over powder.</p>
        <ol>
          <li>The ingredients in supplements, like <a href="https://www.lillidale.sg/blogs/pets/optimising-pet-health-introducing-projoint-and-prohealth-supplements-for-dogs-and-cats" target="_blank" rel="noopener noreferrer">Lillidale ProJoint &amp; ProHealth</a>, vary in both quantity and density. Mixing these ingredients is carefully controlled to ensure proper dispersion, but storage, transportation, and measuring can cause them to separate. This means that the first scoop of a powdered supplement may have different proportions than the last. However, this issue is completely avoided with the pelleting process, ensuring consistent dosing every time.</li>
          <li>Pelletizing feed compresses the ingredients, forcing out air and reducing exposure to oxygen and humidity — the two main causes of spoilage and oxidation.</li>
        </ol>
      `],
      ['How do I know if my dog needs Lillidale ProHealth?', `
        <p>Obvious signs include soft/hard stools, excessive smells and your dog spending too much time licking his bottom. This indicates sub-optimal digestive processes.</p>
        <p>Listlessness and disinterest may indicate gastric discomfort and a mild immune response. This can be due to gastric upset (gut bug), ingested toxins from natural sources scavenged during walks or even a mild allergic reaction. These cues will cause disruption of the microbiota as well as challenging the gut barrier mechanisms.</p>
        <p>Lacklustre coat, flaky skin and dull eyes all indicate a lack of bioactive components such as antioxidants and essential oils.</p>
        <p>More severe symptoms should be referred to a veterinary surgeon, after which — as above — the gut may need to be "reset."</p>
        <p>These examples are associated with a microbiome that is non-functioning optimally, and the introduction of ProHealth will help return the whole system to 100%. The microbiome is the "gatekeeper" to all the subsequent metabolic functions in the dog, and its smooth running is the base for maintaining a healthy animal.</p>
      `],
      ['Is Lillidale ProHealth safe for dogs with sensitive stomachs?', 'Absolutely. Ingredients and levels are designed to support the microbiome, from optimising the microbial populations through enhancing the mucilage gut barrier to supporting the gut-based immune system. Key bioactives also help regulate the absorptive function of the gut wall, which helps with sensitivity.'],
      ['Can Lillidale ProHealth be taken with other medications?', `
        <p>Whilst the ingredients of ProHealth are not known to interact with prescribed medication, it is always advisable to consult your vet if your dog is being prescribed medicines.</p>
        <p>If your dog has been prescribed a course of antibiotics, this may well disrupt gut microbiota, and subsequent introduction of ProHealth may be beneficial.</p>
      `],
      // CSS-only tab selector: three radio inputs (visually hidden) +
      // three <label>s styled as pill buttons, clicking a label checks
      // its radio, and CSS sibling selectors show only the matching
      // panel. No JavaScript needed — same "prefer a native/declarative
      // mechanism over a JS-dependent one" approach already used for the
      // FAQ auto-open behavior elsewhere on this site (see
      // components/FaqAutoOpen.jsx). Matching CSS lives in
      // app/globals.css under ".feed-tabs". Defaults to ProHealth
      // selected (the bestseller) since radio #1 has the `checked`
      // attribute in the raw HTML string below.
      //
      // Kept as-is per KT — this entry is specifically the target of the
      // "Not sure which size to get?" links on the ProHealth/ProJoint/
      // Plaque Guard product pages (see sizeGuideFaqQuestion above), so
      // it stays even though the rest of the FAQ list was fully replaced.
      ['How much should I feed, and how long will each size last?', `
        <div class="feed-tabs">
          <input type="radio" name="feed-tab" id="feed-tab-prohealth" checked>
          <input type="radio" name="feed-tab" id="feed-tab-projoint">
          <input type="radio" name="feed-tab" id="feed-tab-plaqueguard">
          <div class="feed-tabs-nav">
            <label for="feed-tab-prohealth">ProHealth</label>
            <label for="feed-tab-projoint">ProJoint</label>
            <label for="feed-tab-plaqueguard">Plaque Guard</label>
          </div>

          <div class="feed-panel" data-panel="prohealth">
            <p>Daily measure by weight (1 level measure = 3.5g; 5ml scoop included):</p>
            <div class="faq-table-wrap">
              <table class="faq-table">
                <thead><tr><th>Dog weight</th><th>Maintenance</th><th>Full Support</th></tr></thead>
                <tbody>
                  <tr><td>Up to 5kg</td><td>2/3 (2g)</td><td>1 (3.5g)</td></tr>
                  <tr><td>5\u201315kg</td><td>1 (3.5g)</td><td>1\u00bd (5g)</td></tr>
                  <tr><td>16\u201330kg</td><td>2 (7g)</td><td>3 (10.5g)</td></tr>
                  <tr><td>31\u201350kg</td><td>3 (10.5g)</td><td>4 (14g)</td></tr>
                  <tr><td>&gt;50kg</td><td>4 (14g)</td><td>6 (21g)</td></tr>
                  <tr><td>Cats, up to 15kg</td><td colspan="2">2\u20133g/day (about 2/3 of a scoop)</td></tr>
                </tbody>
              </table>
            </div>
            <p>How long each size lasts, at Maintenance dose (Full Support roughly halves these):</p>
            <div class="faq-table-wrap">
              <table class="faq-table">
                <thead><tr><th>Size</th><th>Up to 5kg</th><th>6\u201315kg</th><th>16\u201330kg</th><th>31\u201350kg</th><th>&gt;50kg</th></tr></thead>
                <tbody>
                  <tr><td>200g</td><td>57\u2013100 days</td><td>40\u201357 days</td><td>19\u201328 days</td><td>14\u201319 days</td><td>9\u201314 days</td></tr>
                  <tr><td>500g</td><td>142\u2013250 days</td><td>100\u2013142 days</td><td>47\u201371 days</td><td>35\u201347 days</td><td>23\u201335 days</td></tr>
                  <tr><td>2kg</td><td>571\u20131000 days</td><td>400\u2013571 days</td><td>190\u2013285 days</td><td>143\u2013190 days</td><td>95\u2013143 days</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="feed-panel" data-panel="projoint">
            <p>Daily measure by weight (1 level measure = 10g):</p>
            <div class="faq-table-wrap">
              <table class="faq-table">
                <thead><tr><th>Dog weight</th><th>Maintenance</th><th>Full Support</th></tr></thead>
                <tbody>
                  <tr><td>Up to 15kg</td><td>1/4</td><td>1/2</td></tr>
                  <tr><td>16\u201330kg</td><td>1/2</td><td>1</td></tr>
                  <tr><td>31\u201360kg</td><td>1</td><td>2</td></tr>
                  <tr><td>&gt;60kg</td><td colspan="2">1/2 to 1 measure per 30kg bodyweight</td></tr>
                  <tr><td>Cats, up to 15kg</td><td colspan="2">1/4 to 1/2 measure/day</td></tr>
                </tbody>
              </table>
            </div>
            <p>How long each size lasts, at Maintenance dose:</p>
            <div class="faq-table-wrap">
              <table class="faq-table">
                <thead><tr><th>Size</th><th>Up to 15kg</th><th>16\u201330kg</th><th>31\u201360kg</th></tr></thead>
                <tbody>
                  <tr><td>200g</td><td>40\u201380 days</td><td>20\u201340 days</td><td>10\u201320 days</td></tr>
                  <tr><td>500g</td><td>100\u2013200 days</td><td>50\u2013100 days</td><td>25\u201350 days</td></tr>
                  <tr><td>2kg</td><td>400\u2013800 days</td><td>200\u2013400 days</td><td>100\u2013200 days</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="feed-panel" data-panel="plaqueguard">
            <p>Daily measure by weight (1 level measure = 1g), 60g jar:</p>
            <div class="faq-table-wrap">
              <table class="faq-table">
                <thead><tr><th>Dog weight</th><th>Measure/day</th><th>60g will last</th></tr></thead>
                <tbody>
                  <tr><td>Up to 15kg</td><td>1/2 (0.5g)</td><td>~120 days</td></tr>
                  <tr><td>16\u201330kg</td><td>1 (1g)</td><td>~60 days</td></tr>
                  <tr><td>31\u201360kg</td><td>1\u00bd (1.5g)</td><td>~40 days</td></tr>
                  <tr><td>Cats</td><td colspan="2">0.5\u20131g/day depending on weight</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `],
    ],
    // Lillidale is structurally different from Better Bone / Puzzle Feeder /
    // East Sea Brother: it isn't one product family, it's three distinct
    // sub-ranges (Supplements, Antimicrobial Care, Wellness) totaling
    // 13 SKUs. So this page uses three NEW section shapes instead of the
    // existing chew/durability or intro/featureSplit ones — see `pillars`,
    // `beforeAfter`, and `fitCardGroups` in components/BrandDeepDive.jsx.
    // Section order (KT-approved): pillars nav -> before/after -> three
    // shop grids, one per pillar. No hero/FAQ/CTA duplication — those
    // already exist on the shared brand-page template (app/brands/[slug]
    // /page.js), so this deepDive block only covers what's new to Lillidale.
    //
    // MATCHING RISK — READ BEFORE TOUCHING: the Pawvy App's Products page
    // confirms the Wellness range's item_series follows the East Sea
    // Brother-style convention (SKU code + "Lillidale Grooming", e.g.
    // "L0232 Lillidale Grooming") with the real descriptive name + size
    // living in `variation` instead (e.g. "Lazy Wash 200ml") — so
    // seriesIncludes terms below for Wellness are checked against
    // findMatches()'s combined item_series+variation text, same safety net
    // as every other brand. HOWEVER: Supplements (ProJoint/ProHealth/Plaque
    // Guard) and Antimicrobial Care item_series naming was NOT
    // confirmed against a real Pawvy App screenshot this session — the
    // seriesIncludes terms for those two groups are a best guess based on
    // product packaging/marketing text only. Per the standing project
    // lesson (two real bugs this session traced back to exactly this),
    // do a real click-through Add to Cart test on every card in all three
    // groups after deploy — don't trust a clean build here.
    deepDive: {
      pillars: {
        heading: 'One brand, three ways to care for your pet',
        sub: 'Lillidale spans supplements, antimicrobial healthcare, and everyday wellness — jump to what your pet needs.',
        items: [
          {
            anchor: 'supplements',
            image: '/brand-features/lillidale/pillar-supplements.jpg',
            heading: 'Supplements',
            body: "Daily support for joint, gut, coat and dental health.",
          },
          {
            anchor: 'antimicrobial',
            image: '/brand-features/lillidale/pillar-antimicrobial.jpg',
            heading: 'Antimicrobial Care',
            body: "All-natural, hypochlorous acid-based care that's gentle, fast-acting and safe around wounds, ears, eyes and everyday hygiene.",
          },
          {
            anchor: 'wellness',
            image: '/brand-features/lillidale/pillar-wellness.jpg',
            heading: 'Wellness',
            body: "Everyday grooming and skincare essentials for the day before the big days.",
          },
        ],
      },
      // Real Lillidale customer photos KT sent this session — kept in the
      // order they were provided (ProHealth, Plaque Guard + Dental Spray,
      // Ear Cleanser).
      beforeAfter: {
        eyebrow: 'Real results',
        heading: 'See the difference, not just read about it',
        sub: 'Real customer testimonials.',
        items: [
          {
            product: 'ProHealth',
            productImages: ['/brand-features/lillidale/sku-prohealth-500g.jpg'],
            title: 'Itchy skin to healthy coat',
            beforeImage: '/brand-features/lillidale/prohealth-before.jpg',
            afterImage: '/brand-features/lillidale/prohealth-after.jpg',
            beforeTag: 'Before, Aug 2024',
            afterTag: 'After, Sep 2024',
            beforeLabel: 'Before, Aug 2024: itchy skin, soft stool',
            afterLabel: 'After, Sep 2024: fur regrowth, firm stool',
            source: '@zaithelilrascal',
          },
          {
            product: 'Plaque Guard + Dental Spray',
            productImages: ['/brand-features/lillidale/sku-plaqueguard.jpg', '/brand-features/lillidale/sku-dentalspray.jpg'],
            title: 'Visible tartar reduction in a week',
            beforeImage: '/brand-features/lillidale/plaqueguard-before.jpg',
            afterImage: '/brand-features/lillidale/plaqueguard-after.jpg',
            orientation: 'vertical',
            beforeTag: 'Day 1',
            afterTag: 'Day 7',
            beforeLabel: 'Day 1: tartar buildup',
            afterLabel: 'Day 7: reduced tartar',
            source: '@kokohoney1103',
          },
          {
            product: 'Ear Cleaner',
            productImages: ['/brand-features/lillidale/sku-earcleanser.jpg'],
            title: 'Frequent scratching to itch-free ears',
            beforeImage: '/brand-features/lillidale/earcleanser-before.jpg',
            afterImage: '/brand-features/lillidale/earcleanser-after.jpg',
            beforeTag: 'Before',
            afterTag: 'After',
            beforeLabel: 'Before: ear infection, frequent scratches',
            afterLabel: 'After: clean ears, itch-free',
            source: '@tangyuan.muahchee',
          },
        ],
      },
      // Three shop grids, one per pillar, in pillar order. Explicit
      // `variants` (not dynamic discovery) for all three groups — Lillidale's
      // sizes are small, fixed line-ups per product, and explicit mode lets
      // each size show its own curated photo (500g shown by default on the
      // card; the Add to Cart modal swaps to the matching photo for
      // whichever size the customer picks — see fit-modal-image-wrap in
      // ProductAddButton.jsx, no new logic needed for this since explicit
      // mode already renders `current.image` per selected variant).
      fitCardGroups: [
        {
          anchor: 'supplements',
          eyebrow: 'Supplements',
          heading: 'Joint, gut & dental support',
          sub: 'Made in the UK',
          items: [
            {
              name: 'ProJoint - Joint Supplement', fitFor: '200g · 500g · 2kg',
              variants: [
                { label: '200g', seriesIncludes: 'ProJoint', seriesExcludes: ['Cat'], variationIncludes: '200g', image: '/brand-features/lillidale/sku-projoint-200g.jpg' },
                { label: '500g', default: true, seriesIncludes: 'ProJoint', seriesExcludes: ['Cat'], variationIncludes: '500g', image: '/brand-features/lillidale/sku-projoint-500g.jpg' },
                { label: '2kg', seriesIncludes: 'ProJoint', seriesExcludes: ['Cat'], variationIncludesAny: ['2kg', '2 kg', '2000g'], image: '/brand-features/lillidale/sku-projoint-2kg.jpg' },
              ],
            },
            {
              name: 'ProHealth - Pre-, Pro-, Postbiotics', fitFor: '200g · 500g · 2kg',
              variants: [
                { label: '200g', seriesIncludes: 'ProHealth', variationIncludes: '200g', image: '/brand-features/lillidale/sku-prohealth-200g.jpg' },
                { label: '500g', default: true, seriesIncludes: 'ProHealth', variationIncludes: '500g', image: '/brand-features/lillidale/sku-prohealth-500g.jpg' },
                { label: '2kg', seriesIncludes: 'ProHealth', variationIncludesAny: ['2kg', '2 kg', '2000g'], image: '/brand-features/lillidale/sku-prohealth-2kg.jpg' },
              ],
            },
            {
              name: 'Plaque Guard - Dental Health', fitFor: '60g',
              variants: [
                { label: '60g', seriesIncludes: 'Plaque Guard', variationIncludes: '60', image: '/brand-features/lillidale/sku-plaqueguard.jpg' },
              ],
            },
          ],
        },
        {
          anchor: 'antimicrobial',
          alt: true,
          eyebrow: 'Antimicrobial Care',
          heading: 'Gentle, all-natural and fast acting',
          sub: "Non-stinging, safe for daily use.",
          items: [
            {
              name: 'Sanitizing Spray', fitFor: '500ml',
              variants: [{ label: '500ml', seriesIncludesAny: ['Sanitising', 'Sanitizing'], image: '/brand-features/lillidale/sku-sanitizingspray.jpg' }],
            },
            {
              name: 'Ear Cleaner', fitFor: '250ml',
              variants: [{ label: '250ml', seriesIncludes: 'Ear', image: '/brand-features/lillidale/sku-earcleanser.jpg' }],
            },
            {
              name: 'Dental Spray', fitFor: '250ml',
              variants: [{ label: '250ml', seriesIncludes: 'Dental', image: '/brand-features/lillidale/sku-dentalspray.jpg' }],
            },
            {
              name: 'Eye Cleanser', fitFor: '65ml',
              variants: [{ label: '65ml', seriesIncludes: 'Eye Cleanser', image: '/brand-features/lillidale/sku-eyecleanser.jpg' }],
            },
            {
              name: 'Wound Care', fitFor: '65ml',
              variants: [{ label: '65ml', seriesIncludes: 'Wound', seriesExcludes: ['Cream'], image: '/brand-features/lillidale/sku-woundcare.jpg' }],
            },
          ],
        },
        {
          anchor: 'wellness',
          eyebrow: 'Wellness',
          heading: 'Everyday grooming and skincare essentials',
          sub: 'For the day before the big days.',
          items: [
            {
              name: 'Lazy Wash (no-rinse shampoo)', fitFor: '200ml',
              variants: [{ label: '200ml', seriesIncludes: 'Lazy Wash', image: '/brand-features/lillidale/sku-lazywash.jpg' }],
            },
            {
              name: 'Paw & Nose Balm', fitFor: '30g',
              variants: [{ label: '30g', seriesIncludes: 'Paw & Nose', image: '/brand-features/lillidale/sku-pawnosebalm.jpg' }],
            },
            {
              name: 'Wound Cream', fitFor: '100g',
              variants: [{ label: '100g', seriesIncludes: 'Wound Cream', image: '/brand-features/lillidale/sku-woundcream.jpg' }],
            },
            {
              name: 'Skin Ointment', fitFor: '125g',
              variants: [{ label: '125g', seriesIncludes: 'Skin Ointment', image: '/brand-features/lillidale/sku-skinointment.jpg' }],
            },
            {
              name: 'Sunblock Powder', fitFor: '35g',
              variants: [{ label: '35g', seriesIncludes: 'Sunblock', image: '/brand-features/lillidale/sku-sunblock.jpg' }],
            },
          ],
        },
      ],
    },
  },
  'Puzzle Feeder': {
    tagline: 'Slows the gulp, keeps the mind busy',
    description: "Detachable, dishwasher-safe modules that turn mealtime into enrichment - built for the dog who inhales dinner before you know it.",
    exclusive: true,
    faqs: [
      ['What happens when a dog ingests its food too fast?', 'Dogs that eat too fast swallow excess air, which can cause serious digestive issues ranging from vomiting to the life-threatening condition known as bloat (GDV). Slow feeding also improves digestion and weight management by giving the brain enough time to register fullness. Puzzle Feeder helps encourage healthier eating habits in dogs.'],
      ['How do I introduce a puzzle feeder to my dog?', 'Start with the easiest setting and guide your dog with treats or encouragement. Let them succeed quickly at first to build interest and confidence before moving to harder levels.'],
      ['How do I clean a puzzle feeder?', 'Most are dishwasher-safe or can be hand-washed with warm soapy water. Regular cleaning after each use prevents bacteria buildup in the grooves and compartments.'],
    ],
    // Deep-dive sections — approved layout, still using placeholder boxes
    // for the "Choose Your Fit" product cards until KT exports real photos
    // from the Pawvy App's Products page (Export Images button already
    // built there). Intro/feature-split use the real photos KT sent.
    deepDive: {
      intro: {
        eyebrow: 'Slow feeder that works',
        heading: 'Puzzle\nFeeder',
        body: "Transform every meal into an enriching adventure. Designed to encourage natural foraging, exploration, and problem-solving, Puzzle Feeder keeps curious minds engaged and challenged.",
        image: '/brand-features/puzzlefeeder/intro-hero.jpg',
      },
      featureSplit: {
        eyebrow: 'Engaging mealtime experience',
        heading: 'Turn mealtime into an enriching session',
        body: "The bone-shaped design encourages dogs to navigate obstacles to reach their food — slowing down eating and easing gulping, bloating, and digestive discomfort.\n\nA thoughtfully designed double-layer bowl structure adds function to every meal, keeping pets mentally engaged while promoting healthier eating habits.",
        image: '/brand-features/puzzlefeeder/feature-split.jpg',
        imagePosition: 'left',
      },
      stats: [
        { num: '3', label: 'Modular Components' },
        { num: '4', label: 'Feeding Modes' },
        { num: '15×', label: 'Slower Mealtimes' },
        { num: '28', label: 'Days Training' },
      ],
      checklist: {
        eyebrow: 'What it helps prevent',
        heading: 'Say goodbye to...',
        items: ['Choking', 'Vomiting', 'Digestive issues', 'Obesity'],
        badgeHeading: 'Vet Recommended',
        badgeBody: 'Backed by veterinarians for safer, slower eating habits — built with plant-based, non-toxic, BPA-free materials.',
      },
      fitCards: {
        eyebrow: 'Find the one',
        heading: "Choose Your Pup's Puzzle Feeder",
        sub: 'Six ways to slow down mealtime and keep curious minds engaged.',
        // Split into 6 individual cards per Janice's direction, each with
        // an Add to Cart button (see ProductAddButton.jsx).
        //
        // BUG FIX: earlier `match` values searched for a combined
        // "Name — Color" string (e.g. "Puzzle Feeder — Green") which never
        // exists as a literal value in the database — item_series and
        // variation are separate columns, and the dash is only inserted
        // for display (ProductCard.jsx). Every card now matches
        // seriesIncludes against item_series and variationIncludes against
        // variation as two separate checks — see findMatches() in
        // ProductAddButton.jsx.
        //
        // Lickpop is one product (its "green/teal" is one item's two-tone
        // look, not two SKUs) so it's single-variant. Feeder Lite's
        // "orange" option is catalogued as a different product name
        // ("Puzzle Lick Bowl Lite") rather than a color of the same item —
        // handled with seriesIncludesAny (matches either name).
        items: [
          {
            name: 'Puzzle Feeder', fitFor: 'Suitable for M–L dogs',
            variants: [
              { label: 'Green', hex: '#5C846A', seriesIncludes: 'Puzzle Feeder', seriesExcludes: ['Lite', 'Swirl', 'Accessory'], variationIncludes: 'Green', image: '/brand-features/puzzlefeeder/fit-feeder-green.jpg' },
              { label: 'Pink', hex: '#A17E78', seriesIncludes: 'Puzzle Feeder', seriesExcludes: ['Lite', 'Swirl', 'Accessory'], variationIncludes: 'Pink', image: '/brand-features/puzzlefeeder/fit-feeder-pink.jpg' },
            ],
          },
          {
            name: 'Puzzle Feeder Swirl', fitFor: 'A different way to slow feed',
            variants: [
              { label: 'Purple', hex: '#3F2469', seriesIncludes: 'Puzzle Feeder Swirl', variationIncludes: 'Purple', image: '/brand-features/puzzlefeeder/fit-swirl.jpg' },
            ],
          },
          {
            name: 'Puzzle Feeder Lite', fitFor: 'Suitable for S–M dogs',
            variants: [
              { label: 'Green', hex: '#7BB636', seriesIncludes: 'Puzzle Feeder Lite', variationIncludes: 'Green', image: '/brand-features/puzzlefeeder/fit-lite-green.jpg' },
              { label: 'Orange', hex: '#E2A83D', seriesIncludesAny: ['Puzzle Lick Bowl Lite', 'Puzzle Feeder Lite'], variationIncludes: 'Orange', image: '/brand-features/puzzlefeeder/fit-lite-orange.jpg' },
            ],
          },
          {
            name: 'Puzzle Lickpop', fitFor: 'For food-motivated lickers',
            variants: [
              { label: 'Green', hex: '#9AD16A', seriesIncludes: 'Puzzle Lickpop', variationIncludes: 'Green', image: '/brand-features/puzzlefeeder/fit-enrichment.jpg' },
            ],
          },
          {
            name: 'Puzzle Tumbler', fitFor: 'Roll, dispense, repeat',
            variants: [
              { label: 'S/M · Green/Orange', hex: '#FFAA01', seriesIncludes: 'Puzzle Tumbler', variationIncludes: 'S/M', image: '/brand-features/puzzlefeeder/fit-tumbler-orange.jpg' },
              { label: 'L/XL · Pink/Cyan', hex: '#F4D0C4', seriesIncludes: 'Puzzle Tumbler', variationIncludes: 'L/XL', image: '/brand-features/puzzlefeeder/fit-tumbler-pink.jpg' },
            ],
          },
          {
            name: 'Puzzle Mat', fitFor: 'Great for treats & spreads',
            variants: [
              { label: 'Green', hex: '#54B89D', seriesIncludes: 'Puzzle Mat', variationIncludes: 'Green', image: '/brand-features/puzzlefeeder/fit-mat.jpg' },
            ],
          },
        ],
      },
    },
  },
  'East Sea Brother': {
    tagline: 'Korean-made treats, closely sourced',
    description: "Simple, traceable ingredients. Made with single ingredients and minimal processing, these treats provide a natural source of protein and Omega-3 fatty acids to support your pet's wellness, free from unnecessary artificial additives.",
    exclusive: true,
    faqs: [
      ['What health benefits do Eastsea Brother treats offer?', 'They are naturally rich in unsaturated fatty acids including DHA and Omega-3, which support healthy skin and coat, normal circulatory wellness, and provide antioxidant support. They also contain ETA, which helps reduce inflammation and improve skin health.'],
      ['How long is the shelf life?', 'By keeping moisture levels below 5% and sodium at a strictly controlled 0.1%, the freeze-dried treats are shelf-stable until the indicated expiry date even after it is opened.'],
      ['Are they suitable for both cats and dogs?', 'Yes — they are suitable for both cats and dogs older than 3 months.'],
    ],
    // Approved design: intro + freeze-dried feature split (reusing the
    // shapes already built for Puzzle Feeder), a "Which Fish" category
    // breakdown (fishGroups — new shape, each category is one atomic
    // grouped block so it can't visually break apart on narrow screens),
    // and a 6-card "Shop by Fish" section reusing fitCards/ProductAddButton
    // as-is (same component Puzzle Feeder and BetterBone already use).
    deepDive: {
      intro: {
        eyebrow: 'Freshness that the sea offers',
        heading: 'Eastsea\nBrother',
        body: "Pure taste, no additives. Eastsea Brother brings premium human-grade seafood to pets that deserve the nutritious treats.",
        image: '/brand-features/eastseabrother/intro-hero.jpg',
      },
      featureSplit: {
        eyebrow: 'The products',
        heading: 'Freeze-dried',
        body: "Made with no preservatives or artificial additives, Eastsea Brother's freeze-dried treats offer pure, natural nutrition with a stable shelf life — perfect for training, rewarding, or a little extra love.",
        image: '/brand-features/eastseabrother/feature-split.jpg',
        imagePosition: 'left',
      },
      fishGroups: {
        eyebrow: 'Find the right fit',
        heading: 'Which Fish For Your Furkid?',
        sub: 'Five fish, three groups — every one brings something a little different to the bowl.',
        groups: [
          {
            key: 'white', color: '#E8CE85', label: 'White Fish', benefit: 'Low fat & calories, gentle for low-allergy diets',
            fish: [
              { name: 'Pollack', icon: '/brand-features/eastseabrother/fish-pollack.png' },
              { name: 'Flatfish', icon: '/brand-features/eastseabrother/fish-flatfish.png' },
            ],
          },
          {
            key: 'red', color: '#E8916E', label: 'Red Fish', benefit: 'Rich in Omega-3 & DHA',
            fish: [
              { name: 'Salmon', icon: '/brand-features/eastseabrother/fish-salmon.png' },
            ],
          },
          {
            key: 'whole', color: '#7FB0AA', label: 'Whole Fish', benefit: 'Bone & roe, calcium, amino acids & Omega-3',
            fish: [
              { name: 'Capelin', icon: '/brand-features/eastseabrother/fish-capelin.png' },
              { name: 'Sandlance', icon: '/brand-features/eastseabrother/fish-sandlance.png' },
            ],
          },
        ],
      },
      fitCards: {
        eyebrow: 'Shop by fish',
        heading: 'Every Catch, One Standard',
        sub: 'Whether it is for training, rewarding or just feasting - there is one for your pup',
        // Swatch colors now reuse the exact same palette as the "Which
        // Fish For Your Furkid?" section above (fishGroups: White Fish
        // #E8CE85, Red Fish #E8916E, Whole Fish #7FB0AA) — every size
        // variant within one fish keeps that fish's color (a size isn't
        // a different color, so there's no reason to vary it further),
        // giving each card a distinct identity instead of the previous
        // flat neutral gray, while staying visually consistent with the
        // color-coding a customer already saw earlier on this same page.
        // Green Lipped Mussels doesn't belong to any of those 3 existing
        // categories, so it gets its own new color (a sage green,
        // distinct from the Whole Fish teal) rather than borrowing one
        // that would misleadingly suggest it's grouped with a category
        // it isn't part of.
        //
        // Update: KT provided a fully distinct hex per fish (no longer
        // grouped by white/red/whole-fish family) — Pollack #6FA6C9,
        // Salmon #F1ABB5, Flatfish #F1BD83, Capelin #02A88F, Sandlance
        // #B683C6, Pollack Stick #DBBE55, Green Lipped Mussels #314249.
        // These intentionally no longer match the fishGroups section's
        // colors above — that's a deliberate KT decision, not an
        // oversight.
        //
        // Salmon: was previously decoupled here (displayed "120g" while
        // matching the real DB text "115g", since KT hadn't renamed the
        // underlying product records yet). KT has since renamed them in
        // Pawvy App (115g->120g, 55g->60g), so display and matching are
        // no longer split — variationIncludes below now searches for the
        // real, current text directly, same as every other fish on this
        // page.
        items: [
          {
            name: 'Pollack', fitFor: 'White fish · 2 sizes',
            variants: [
              { label: '125g', hex: '#6FA6C9', seriesIncludes: 'Pollack', seriesExcludes: ['Stick'], variationIncludes: '125', image: '/brand-features/eastseabrother/sku-pollack-125.jpg' },
              { label: '60g', hex: '#6FA6C9', halfPack: true, seriesIncludes: 'Pollack', seriesExcludes: ['Stick'], variationIncludes: '60', image: '/brand-features/eastseabrother/sku-pollack-60.jpg' },
            ],
          },
          {
            name: 'Salmon', fitFor: 'Red fish · 2 sizes',
            variants: [
              { label: '120g', hex: '#F1ABB5', seriesIncludes: 'Salmon', variationIncludes: '120', image: '/brand-features/eastseabrother/sku-salmon-115.jpg' },
              { label: '60g', hex: '#F1ABB5', halfPack: true, seriesIncludes: 'Salmon', variationIncludes: '60', image: '/brand-features/eastseabrother/sku-salmon-55.jpg' },
            ],
          },
          {
            name: 'Flatfish', fitFor: 'White fish · 2 sizes',
            variants: [
              { label: '110g', hex: '#F1BD83', seriesIncludes: 'Flatfish', variationIncludes: '110', image: '/brand-features/eastseabrother/sku-flatfish-110.jpg' },
              { label: '55g', hex: '#F1BD83', halfPack: true, seriesIncludes: 'Flatfish', variationIncludes: '55', image: '/brand-features/eastseabrother/sku-flatfish-55.jpg' },
            ],
          },
          {
            name: 'Capelin', fitFor: 'Whole fish',
            variants: [
              { label: '125g', hex: '#02A88F', seriesIncludes: 'Capelin', variationIncludes: '125', image: '/brand-features/eastseabrother/sku-capelin-125.jpg' },
            ],
          },
          {
            name: 'Sandlance', fitFor: 'Whole fish',
            variants: [
              { label: '100g', hex: '#B683C6', seriesIncludes: 'Sandlance', variationIncludes: '100', image: '/brand-features/eastseabrother/sku-sandlance-100.jpg' },
            ],
          },
          {
            // Split out from the Pollack card into its own, per KT.
            // Now has its own distinct color (#DBBE55) rather than
            // matching Pollack's — KT wants each product visually
            // distinct now, not grouped by fish family.
            name: 'Pollack Stick', fitFor: 'White fish · Dental chew format',
            variants: [
              { label: '70g', hex: '#DBBE55', seriesIncludes: 'Pollack', variationIncludes: 'Stick', image: '/brand-features/eastseabrother/sku-pollack-stick-70.jpg' },
            ],
          },
          {
            name: 'Green Lipped Mussels', fitFor: 'Joint support',
            variants: [
              { label: '70g', hex: '#314249', seriesIncludes: 'Mussel', variationIncludes: '70', image: '/brand-features/eastseabrother/sku-mussels-70.jpg' },
            ],
          },
        ],
      },
    },
  },
  'Salmoil': {
    tagline: 'Norwegian-grade omega-3, from real salmon',
    description: "Cold-pressed fish oil for coat, joints, and heart health — the kind of everyday supplement a vet would actually recommend. Salmoil's carefully formulated recipes combine salmon fish oil with functional ingredients to deliver targeted health benefits, making it a trusted choice for pet owners seeking a convenient and effective daily wellness supplement.",
    exclusive: true,
    // Referenced by the product detail page (app/shop/[id]/page.js) to
    // build a "see our sizing guide" link straight to this FAQ answer —
    // must exactly match one of the question strings in `faqs` below.
    sizeGuideFaqQuestion: 'Which Salmoil size should I get \u2014 150ml, 250ml, or 500ml?',
    faqs: [
      ['How much Salmoil should I give my dog?', `
        <p>Dosage scales with your dog's weight (1 teaspoon \u2248 5ml). Cats get a flat 1 teaspoon daily regardless of weight.</p>
        <div class="faq-table-wrap">
          <table class="faq-table">
            <thead><tr><th>Pet</th><th>Daily dose</th></tr></thead>
            <tbody>
              <tr><td>Dog, 5kg</td><td>1 tsp (5ml)</td></tr>
              <tr><td>Dog, 10kg</td><td>1.5 tsp (7.5ml)</td></tr>
              <tr><td>Dog, 15kg</td><td>2 tsp (10ml)</td></tr>
              <tr><td>Dog, 20kg</td><td>2.5 tsp (12.5ml)</td></tr>
              <tr><td>Dog, 30kg</td><td>3.5 tsp (17.5ml)</td></tr>
              <tr><td>Cat, any weight</td><td>1 tsp (5ml)</td></tr>
            </tbody>
          </table>
        </div>
      `],
      ['Which Salmoil size should I get \u2014 150ml, 250ml, or 500ml?', `
        <p>Once opened, Salmoil is best used within 2\u20133 months \u2014 so the right size depends on how fast your pet's daily dose will finish the bottle:</p>
        <div class="faq-table-wrap">
          <table class="faq-table">
            <thead><tr><th>Bottle</th><th>Cat / 5kg dog</th><th>10kg dog</th><th>15kg dog</th><th>20kg dog</th><th>30kg dog</th></tr></thead>
            <tbody>
              <tr><td>150ml</td><td>~30 days</td><td>~20 days</td><td>~15 days</td><td>~12 days</td><td>~9 days</td></tr>
              <tr><td>250ml</td><td>~50 days</td><td>~33 days</td><td>~25 days</td><td>~20 days</td><td>~14 days</td></tr>
              <tr><td>500ml</td><td>~100 days</td><td>~67 days</td><td>~50 days</td><td>~40 days</td><td>~29 days</td></tr>
            </tbody>
          </table>
        </div>
        <p>For cats and small dogs, 150ml or 250ml is usually the better fit. Dogs 20kg and up comfortably finish a 500ml bottle within the recommended window, making it the more economical choice.</p>
      `],
      ['Is Pawvy the exclusive distributor of Salmoil in Singapore?', 'Yes — Pawvy is the exclusive Singapore distributor of Salmoil.'],
      ['Does Salmoil need to be refrigerated?', 'Most bottles are shelf-stable unopened, but refrigeration after opening is recommended to preserve freshness — check your specific product\'s label.'],
      ['Can cats have Salmoil too?', 'Some Salmoil products are formulated for both cats and dogs — check the individual listing to confirm before feeding.'],
    ],
    // Reuses two existing shapes (`intro` with its optional `values` grid,
    // and `fitCardGroups` — same shop-grid pattern as Lillidale) and adds
    // one new shape, `selector`: an interactive hover/click ingredient
    // highlight panel. See components/BrandDeepDive.jsx for all three.
    //
    // MATCHING RISK — read before touching: seriesIncludes terms below
    // (Kidney/Gut/Dental/Coat/Joint Wellness, Ricetta N°0x) are a best
    // guess from the product photos/packaging text, same as every other
    // brand's first pass — not yet confirmed against a real Pawvy App
    // screenshot of Salmoil's actual item_series/variation values. Do a
    // real click-through on all 5 recipes × 3 sizes after deploy, same
    // lesson as Lillidale's Sanitising Spray / 2kg bugs earlier.
    deepDive: {
      intro: {
        eyebrow: 'Functional Wellness · Made in Italy',
        heading: 'Not just the usual salmon oil',
        body: "Formulated by a pet nutritionist and made in Italy since 2005, Salmoil packs more Omega-3 into every bottle than any dry or wet pet food — five recipes, each built around a specific need, from kidney support to joint health.",
        image: '/brand-features/salmoil/intro-photo.jpg',
        values: [
          { title: 'Aluminum bottle', body: "Airtight, pumpless aluminum packaging shields the oil from oxidation better than plastic — maximum freshness and nutritional value." },
          { title: 'ASC certified', body: "Only ASC-certified suppliers, fish raised in \u2018Good\u2019 or \u2018Very Good\u2019 rated water \u2014 a safer, lower-contaminant source of Omega-3." },
          { title: 'Functional blend', body: "More than fish oil \u2014 each recipe combines salmon oil with a functional ingredient like Devil's Claw or olive oil for a specific benefit." },
        ],
      },
      selector: {
        eyebrow: 'Not just fish oil',
        heading: 'Every recipe has its own functional edge',
        sub: "Every Salmoil recipe starts from the same Norwegian salmon oil Omega-3 base \u2014 what changes is the one functional ingredient added on top for a specific benefit. Click a recipe (or hover, on desktop) to see what that is.",
        items: [
          { id: 'kidney', recipeName: 'Kidney Wellness', ingredient: 'Olive Oil', color: '#3C8A4F', image: '/brand-features/salmoil/selector-kidney.jpg' },
          { id: 'gut', recipeName: 'Gut Wellness', ingredient: 'Krill', color: '#E07A2E', image: '/brand-features/salmoil/selector-gut.jpg' },
          { id: 'dental', recipeName: 'Dental Wellness', ingredient: 'Ascophyllum Seaweed', color: '#C9A227', image: '/brand-features/salmoil/selector-dental.jpg' },
          { id: 'coat', recipeName: 'Beauty of the Coat', ingredient: 'Flaxseed Oil', color: '#7B4EA3', image: '/brand-features/salmoil/selector-coat.jpg' },
          { id: 'joint', recipeName: 'Joint Wellness', ingredient: "Green-Lipped Mussel & Devil's Claw", color: '#D63E7A', image: '/brand-features/salmoil/selector-joint.jpg' },
        ],
      },
      fitCardGroups: [
        {
          anchor: 'recipes',
          eyebrow: 'Recipes',
          heading: 'Five recipes, one for every need',
          sub: 'Each recipe comes in 3 sizes \u2014 pick your recipe, then choose the size that fits.',
          items: [
            {
              name: 'Kidney Wellness', fitFor: '150ml \u00b7 250ml \u00b7 500ml',
              variants: [
                { label: '150ml', seriesIncludes: 'Kidney Wellness', variationIncludes: '150', forceImage: true, image: '/brand-features/salmoil/sku-kidney-150.jpg' },
                { label: '250ml', default: true, seriesIncludes: 'Kidney Wellness', variationIncludes: '250', forceImage: true, image: '/brand-features/salmoil/sku-kidney-250.jpg' },
                { label: '500ml', seriesIncludes: 'Kidney Wellness', variationIncludes: '500', forceImage: true, image: '/brand-features/salmoil/sku-kidney-500.jpg' },
              ],
            },
            {
              name: 'Gut Wellness', fitFor: '150ml \u00b7 250ml \u00b7 500ml',
              variants: [
                { label: '150ml', seriesIncludes: 'Gut Wellness', variationIncludes: '150', forceImage: true, image: '/brand-features/salmoil/sku-gut-150.jpg' },
                { label: '250ml', default: true, seriesIncludes: 'Gut Wellness', variationIncludes: '250', forceImage: true, image: '/brand-features/salmoil/sku-gut-250.jpg' },
                { label: '500ml', seriesIncludes: 'Gut Wellness', variationIncludes: '500', forceImage: true, image: '/brand-features/salmoil/sku-gut-500.jpg' },
              ],
            },
            {
              name: 'Dental Wellness', fitFor: '150ml \u00b7 250ml \u00b7 500ml',
              variants: [
                { label: '150ml', seriesIncludes: 'Odor Control', variationIncludes: '150', forceImage: true, image: '/brand-features/salmoil/sku-dental-150.jpg' },
                { label: '250ml', default: true, seriesIncludes: 'Odor Control', variationIncludes: '250', forceImage: true, image: '/brand-features/salmoil/sku-dental-250.jpg' },
                { label: '500ml', seriesIncludes: 'Odor Control', variationIncludes: '500', forceImage: true, image: '/brand-features/salmoil/sku-dental-500.jpg' },
              ],
            },
            {
              name: 'Beauty of the Coat', fitFor: '150ml \u00b7 250ml \u00b7 500ml',
              variants: [
                { label: '150ml', seriesIncludes: 'Coat', variationIncludes: '150', forceImage: true, image: '/brand-features/salmoil/sku-coat-150.jpg' },
                { label: '250ml', default: true, seriesIncludes: 'Coat', variationIncludes: '250', forceImage: true, image: '/brand-features/salmoil/sku-coat-250.jpg' },
                { label: '500ml', seriesIncludes: 'Coat', variationIncludes: '500', forceImage: true, image: '/brand-features/salmoil/sku-coat-500.jpg' },
              ],
            },
            {
              name: 'Joint Wellness', fitFor: '150ml \u00b7 250ml \u00b7 500ml',
              variants: [
                { label: '150ml', seriesIncludes: 'Joint Wellness', variationIncludes: '150', forceImage: true, image: '/brand-features/salmoil/sku-joint-150.jpg' },
                { label: '250ml', default: true, seriesIncludes: 'Joint Wellness', variationIncludes: '250', forceImage: true, image: '/brand-features/salmoil/sku-joint-250.jpg' },
                { label: '500ml', seriesIncludes: 'Joint Wellness', variationIncludes: '500', forceImage: true, image: '/brand-features/salmoil/sku-joint-500.jpg' },
              ],
            },
          ],
        },
      ],
    },
  },
  'GiGwi': {
    tagline: 'Playful design, durable build',
    description: "Bright, bold toys engineered to survive the dogs that destroy everything else — without sacrificing the fun. Toys made for dogs that play hard, built to hold up to real chewing and real fetch sessions.",
    exclusive: false,
    faqs: [
      ['Is GiGwi exclusively distributed by Pawvy?', 'No — unlike our other brands, Pawvy is not the exclusive distributor of GiGwi. We carry a curated selection because we rate the quality.'],
      ['Are GiGwi toys durable for heavy chewers?', 'GiGwi is designed with durability in mind for dogs that play and chew hard — but no toy is fully indestructible, so supervise play as you normally would.'],
      ['Where can I find GiGwi products?', 'Check our Stockist page for partners carrying GiGwi near you.'],
      ['What age range are GiGwi toys suited for?', 'Ranges vary by product — check the individual listing for size and age guidance.'],
    ],
    // GiGwi is structurally unlike every other brand here: 100+ SKUs, no
    // individually curated products. `intro` (with its `values` grid,
    // same shape Salmoil uses) and `categoryIntro` (a new 4-card shape)
    // are ordinary curated content. `browser` is the real work — see
    // components/CategoryBrowser.jsx for the matching/grouping/shuffle
    // logic, and its own comment for the SKU-prefix matching-risk note.
    // This entire `tabs` structure was generated from KT's
    // GIGWI_WEBSITE_WORKING_FILE.xlsx (Category / SKU Prefix / Need
    // Grouping / Group Name/Card Name / Sizes / Featured columns) — not
    // hand-written, so if a card looks wrong the fix is almost always in
    // the source spreadsheet, not here.
    deepDive: {
      intro: {
        eyebrow: 'Reinventing Playtime · Since 2010',
        heading: 'Toys built to actually survive playtime',
        body: "Founded in Hong Kong in 2010, GiGwi designs interactive, durable toys for dogs and cats — starting with the toy that started it all, the GiGwi Signature Ball: tough TPR construction, a built-in squeaker, and a ridged surface for chewing, built to survive fetch after fetch.",
        image: '/brand-features/gigwi/intro-photo.jpg',
        values: [
          { title: 'Safety certified', body: 'Every toy meets ASTM F963 (US), EN71 (EU), or local safety certification \u2014 checked before it ever reaches a shelf.' },
          { title: 'Multiple materials, one toy', body: 'Different textures in a single toy encourage longer, more engaged playtime instead of losing interest after five minutes.' },
          { title: 'Made to be loved', body: 'Vibrant colors and lifelike designs \u2014 GiGwi toys are made to be picked first out of the pile, not just tolerated.' },
        ],
      },
      categoryIntro: {
        eyebrow: 'Every dog needs all four',
        heading: 'Toys that cover every need',
        sub: "Ball, Chew, Plush, and Enrichment aren't just categories \u2014 each one meets a different, real need for your dog.",
        items: [
          { title: 'Ball', color: '#F36F4A', image: '/brand-features/gigwi/icon-ball.png', body: 'Physical exercise and the fetch-and-chase instinct \u2014 burns energy and strengthens the bond through play.' },
          { title: 'Chew', color: '#B4D93C', image: '/brand-features/gigwi/icon-chew.png', body: 'Satisfies a natural instinct, supports dental health, and gives an appropriate outlet instead of the furniture.' },
          { title: 'Plush', color: '#F9DAD9', image: '/brand-features/gigwi/icon-plush.png', body: "Comfort and security \u2014 a soft companion for downtime, crate training, or a puppy's first nights home." },
          { title: 'Enrichment', color: '#7B9FE0', image: '/brand-features/gigwi/icon-enrichment.png', body: 'Mental stimulation through puzzles and treat-dispensing play \u2014 reduces boredom and destructive behavior.' },
        ],
      },
      browser: {
        eyebrow: 'The full range',
        heading: 'Shop by category',
        sub: "Every product below is pulled live from the real GiGwi catalog \u2014 add a new SKU in the Pawvy App and it can show up here automatically.",
      tabs: [
        { id: "ball", label: "Ball", cards: [
          { type: 'single', name: "Neon Glow Ball", skuPrefix: "3019", featured: false },
          { type: 'group', name: "Orange Tennis Ball", featured: true, variants: [{ label: "S (D - 4.8CM)", skuPrefix: "4162" }] },
          { type: 'group', name: "Pineapple Tennis Ball", featured: true, variants: [{ label: "S (D - 4.8CM)", skuPrefix: "4163" }, { label: "M (D - 6.4CM)", skuPrefix: "4166" }] },
          { type: 'group', name: "Mangosteen Tennis Ball", featured: true, variants: [{ label: "M (D - 6.4CM)", skuPrefix: "4167" }] },
          { type: 'group', name: "Pop-pals Extra Durable", featured: false, variants: [{ label: "M (D - 6.4CM)", skuPrefix: "4175" }, { label: "L (D - 7.6CM)", skuPrefix: "8516" }] },
          { type: 'group', name: "Tennis Ball Originals", featured: true, variants: [{ label: "XS (D - 4.0CM)", skuPrefix: "6118" }, { label: "S (D - 4.8CM)", skuPrefix: "6119" }, { label: "M (D - 6.4CM)", skuPrefix: "6120" }, { label: "L (D - 8.0CM)", skuPrefix: "6290" }] },
          { type: 'group', name: "Red/Purple Signature Ball", featured: true, variants: [{ label: "S (D - 5.0CM)", skuPrefix: "6193" }, { label: "M (D - 6.4CM)", skuPrefix: "6296" }, { label: "L (D - 7.8CM)", skuPrefix: "6298" }] },
          { type: 'group', name: "Blue/Purple Signature Ball", featured: true, variants: [{ label: "L (D - 7.8CM)", skuPrefix: "6195" }, { label: "S (D - 5.0CM)", skuPrefix: "6295" }, { label: "M (D - 6.4CM)", skuPrefix: "6297" }] },
          { type: 'group', name: "Blue/Orange Signature Ball", featured: true, variants: [{ label: "S (D - 5.0CM)", skuPrefix: "6294" }, { label: "L (D - 7.8CM)", skuPrefix: "6299" }] },
          { type: 'group', name: "Signature Ball Combo Set", featured: true, variants: [{ label: "S - 3pcs", skuPrefix: "6409" }, { label: "M - 2pcs", skuPrefix: "6410" }, { label: "L - 2pcs", skuPrefix: "6411" }] },
          { type: 'single', name: "Whistling Ball", skuPrefix: "8467", featured: false },
          { type: 'single', name: "Jumball Basketball", skuPrefix: "8493", featured: false },
        ] },
        { id: "chew", label: "Chew", cards: [
          { type: 'single', name: "Squeaker Corn with Rope", skuPrefix: "4257", featured: false },
          { type: 'single', name: "Extra Durable Johnny Stick", skuPrefix: "6188", featured: false },
          { type: 'single', name: "Blue/Orange Johnny Stick", skuPrefix: "6190", featured: true },
          { type: 'single', name: "Blue/Purple Johnny Stick", skuPrefix: "6191", featured: true },
          { type: 'single', name: "Blue/Purple Cat", skuPrefix: "6702", featured: false },
          { type: 'single', name: "Pink/Purple Fox", skuPrefix: "6703", featured: false },
          { type: 'single', name: "Blue/Purple Bear", skuPrefix: "6708", featured: false },
          { type: 'single', name: "Blue/Purple Hippo", skuPrefix: "6710", featured: false },
          { type: 'single', name: "Pink/Purple Hippo", skuPrefix: "6711", featured: false },
          { type: 'single', name: "Green Alligator", skuPrefix: "6983", featured: false },
          { type: 'single', name: "Yellow Dino", skuPrefix: "6984", featured: false },
          { type: 'group', name: "Wooden Antler", featured: true, variants: [{ label: "XS (L - 10.0CM)", skuPrefix: "8455" }, { label: "S (L - 14.0CM)", skuPrefix: "8456" }, { label: "M (L - 19.0CM)", skuPrefix: "8457" }, { label: "L (L - 22.8CM)", skuPrefix: "8477" }] },
          { type: 'single', name: "Blue Raccoon with Rope", skuPrefix: "8474", featured: false },
          { type: 'single', name: "S-Bone", skuPrefix: "8486", featured: false },
          { type: 'single', name: "Multi-sounds Bone", skuPrefix: "8491", featured: true },
          { type: 'single', name: "Toothbrush Stick", skuPrefix: "8513", featured: true },
        ] },
        { id: "plush", label: "Plush", cards: [
          { type: 'single', name: "Dinosaur with Backpack", skuPrefix: "4108", featured: true },
          { type: 'single', name: "Fox with Backpack", skuPrefix: "4110", featured: true },
          { type: 'single', name: "Elephant with Squeaker", skuPrefix: "4172", featured: true },
          { type: 'single', name: "Bell Pepper with Crinkle Paper", skuPrefix: "4177", featured: false },
          { type: 'single', name: "Dinosaur with Squeaker", skuPrefix: "4263", featured: true },
          { type: 'single', name: "Raccoon with Sponge Squeaker", skuPrefix: "6075", featured: true },
          { type: 'single', name: "Embroidery Owl", skuPrefix: "6134", featured: false },
          { type: 'single', name: "Embroidery Lion", skuPrefix: "6136", featured: false },
          { type: 'single', name: "Dog with Refillable Squeaker", skuPrefix: "6222", featured: false },
          { type: 'single', name: "Elephant with Refillable Squeaker", skuPrefix: "6227", featured: false },
          { type: 'single', name: "Elephant with Ropey Hand", skuPrefix: "6285", featured: false },
          { type: 'single', name: "Crunchy Neck Dog", skuPrefix: "6529", featured: false },
          { type: 'single', name: "Crunchy Neck Rabbit", skuPrefix: "6531", featured: false },
          { type: 'single', name: "Crunchy Neck Duck", skuPrefix: "6625", featured: false },
          { type: 'single', name: "Elephant with Crinkle Paper", skuPrefix: "6757", featured: false },
          { type: 'single', name: "Wiry Plushy Monkey", skuPrefix: "6796", featured: true },
          { type: 'single', name: "Wiry Plushy Elephant", skuPrefix: "6797", featured: true },
          { type: 'single', name: "Wiry Plushy Squirrel", skuPrefix: "6798", featured: true },
          { type: 'single', name: "Pig with Bungee Cord", skuPrefix: "6808", featured: false },
          { type: 'single', name: "Rabbit with Bungee Cord", skuPrefix: "6809", featured: false },
          { type: 'single', name: "Monkey with Bungee Cord", skuPrefix: "6810", featured: false },
          { type: 'single', name: "Strawberry Rabbit", skuPrefix: "6969", featured: true },
          { type: 'single', name: "Avocado Frog", skuPrefix: "6970", featured: true },
          { type: 'single', name: "Pineapple Dog", skuPrefix: "6971", featured: true },
          { type: 'single', name: "Blue Rabbit with TPR Body", skuPrefix: "8008", featured: true },
          { type: 'single', name: "Pink Monkey with TPR Body", skuPrefix: "8009", featured: true },
          { type: 'single', name: "Egg Wobble Duck", skuPrefix: "8128", featured: false },
          { type: 'single', name: "Egg Wobble Cock", skuPrefix: "8130", featured: false },
          { type: 'single', name: "Egg Wobble Dino", skuPrefix: "8132", featured: false },
          { type: 'single', name: "Raccoon with Crinkle Paper", skuPrefix: "8377", featured: true },
          { type: 'single', name: "Lion with Crinkle Paper", skuPrefix: "8378", featured: true },
          { type: 'single', name: "Fox with Full Body Squeaker", skuPrefix: "8461", featured: true },
          { type: 'single', name: "Crocodile with Full Body Squeaker", skuPrefix: "8462", featured: true },
          { type: 'single', name: "Lion with Full Body Squeaker", skuPrefix: "8463", featured: true },
          { type: 'single', name: "X-Mas Exclusive Reindeer", skuPrefix: "8534", featured: false },
          { type: 'single', name: "Elephant with TPR Ring", skuPrefix: "8564", featured: false },
        ] },
        { id: "enrichment", label: "Enrichment", cards: [
          { type: 'single', name: "Hamburger & French Fries", skuPrefix: "6963", featured: false },
          { type: 'single', name: "Hot Dog & Root Beer", skuPrefix: "6964", featured: false },
          { type: 'single', name: "Pizza & Ice Cream", skuPrefix: "6965", featured: false },
          { type: 'single', name: "Chicken Snack Bag", skuPrefix: "6966", featured: true },
          { type: 'single', name: "Beef Snack Bag", skuPrefix: "6968", featured: true },
          { type: 'single', name: "Wild Hunter Dragon", skuPrefix: "8480", featured: false },
          { type: 'single', name: "Wild Hunter Crocodile", skuPrefix: "8482", featured: false },
          { type: 'single', name: "Size M Red Bulb", skuPrefix: "8489", featured: false },
          { type: 'single', name: "Size S Blue Bulb", skuPrefix: "8508", featured: false },
          { type: 'single', name: "Size L Purple Bulb", skuPrefix: "8509", featured: false },
          { type: 'single', name: "Hide N' Seek Fast Food Bag", skuPrefix: "8562", featured: true },
        ] },
        { id: "cat", label: "Cat", cards: [
          { type: 'single', name: "Cat Wand with Silvervine", skuPrefix: "7185", featured: true },
          { type: 'single', name: "Bee with Beehive", skuPrefix: "7415", featured: false },
          { type: 'single', name: "Caterpillar with Apple", skuPrefix: "7416", featured: false },
          { type: 'single', name: "Caterpillar with Catnip", skuPrefix: "7456", featured: false },
          { type: 'single', name: "Interactive Vibrating Bee", skuPrefix: "7470", featured: true },
          { type: 'single', name: "Flamingo Finger Teaser", skuPrefix: "7471", featured: false },
          { type: 'single', name: "Leatherette Duck with Silvervine", skuPrefix: "7527", featured: true },
        ] },
      ],
      },
    },
  },
};
