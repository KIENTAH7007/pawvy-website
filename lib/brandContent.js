// Content for each brand's dedicated page. Keyed by the exact brand names
// used in lib/brandSlugs.js (BRAND_SLUGS / what the backend's /api/shop/brands
// returns), so lookups from either place work directly.
//
// IMPORTANT: this copy (especially the FAQ answers) is provisional —
// drafted to get real pages live with something better than "coming soon",
// not final marketing copy. Needs a real content pass before this is
// treated as the definitive word on any brand.
export const BRAND_CONTENT = {
  'Better Bone': {
    tagline: 'Better for your dog, better for the planet',
    description: "Plant-based, biodegradable chews built to satisfy a real chewer — without the guilt of another landfill-bound plastic toy. Made from natural, food-safe ingredients, BetterBone provides a durable chewing experience that helps support dental hygiene by reducing plaque and tartar buildup, while satisfying a dog's natural chewing instinct.",
    exclusive: true,
    faqs: [
      ['Is BetterBone safe for puppies?', 'Most BetterBone chews are sized and formulated for specific life stages — check the individual product listing for the recommended age range before giving it to a puppy.'],
      ['Is Pawvy the exclusive distributor of BetterBone in Singapore?', 'Yes — Pawvy is the exclusive Singapore distributor of BetterBone.'],
      ['Where can I buy BetterBone products?', 'Through any of our 107+ retail and grooming partners islandwide — check our Stockist page to find one near you.'],
      ['How should I store BetterBone chews?', 'Keep in a cool, dry place away from direct sunlight, as you would with any natural chew product.'],
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
        heading: 'Different Durability Levels',
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
            label: 'Medium', level: 2, caption: 'Average chewer',
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
    faqs: [
      ['What kind of products does Lillidale make?', 'A range spanning grooming (like waterless shampoo) through to health supplements such as joint support — see our Stockist partners for what\'s in stock near you.'],
      ['Is Pawvy the exclusive distributor of Lillidale in Singapore?', 'Yes — Pawvy is the exclusive Singapore distributor of Lillidale.'],
      ['Are Lillidale products vet-formulated?', 'Lillidale draws on more than 30 years of veterinary medicine experience in its formulations.'],
      ['Where can I try Lillidale products?', 'Through our retail and grooming partners islandwide — check our Stockist page.'],
    ],
    // Lillidale is structurally different from Better Bone / Puzzle Feeder /
    // East Sea Brother: it isn't one product family, it's three distinct
    // sub-ranges (Supplements, Antimicrobial healthcare, Wellness) totaling
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
    // Guard) and Antimicrobial healthcare item_series naming was NOT
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
            body: "Daily pellets that support joints, gut, coat and dental health.",
          },
          {
            anchor: 'antimicrobial',
            image: '/brand-features/lillidale/pillar-antimicrobial.jpg',
            heading: 'Antimicrobial healthcare',
            body: "All-natural, hypochlorous acid-based care that's gentle, fast-acting and safe around wounds, ears, eyes and everyday hygiene.",
          },
          {
            anchor: 'wellness',
            image: '/brand-features/lillidale/pillar-wellness.jpg',
            heading: 'Wellness',
            body: "Everyday grooming and skin essentials for between the big stuff.",
          },
        ],
      },
      // Real Lillidale customer photos KT sent this session — kept in the
      // order they were provided (ProHealth, Plaque Guard + Dental Spray,
      // Ear Cleanser).
      beforeAfter: {
        eyebrow: 'Real results',
        heading: 'See the difference, not just read about it',
        sub: 'Three real Lillidale customer stories.',
        items: [
          {
            product: 'ProHealth',
            title: 'Itchy skin to a healthy coat',
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
            title: 'Visible tartar reduction in a week',
            beforeImage: '/brand-features/lillidale/plaqueguard-before.jpg',
            afterImage: '/brand-features/lillidale/plaqueguard-after.jpg',
            orientation: 'vertical',
            beforeTag: 'Day 1',
            afterTag: 'Day 7',
            beforeLabel: 'Day 1: tartar buildup',
            afterLabel: 'Day 7: reduced tartar',
            source: '@kokohoney1103, Plaque Guard mixed into meals daily, Dental Spray between brushes',
          },
          {
            product: 'Ear Cleanser',
            title: 'From frequent scratching to itch-free',
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
          sub: 'Daily pellets, all made in the UK.',
          items: [
            {
              name: 'ProJoint for Dogs', fitFor: '200g · 500g · 2kg',
              variants: [
                { label: '500g', seriesIncludes: 'ProJoint', seriesExcludes: ['Cat'], variationIncludes: '500g', image: '/brand-features/lillidale/sku-projoint-500g.jpg' },
                { label: '200g', seriesIncludes: 'ProJoint', seriesExcludes: ['Cat'], variationIncludes: '200g', image: '/brand-features/lillidale/sku-projoint-200g.jpg' },
                { label: '2kg', seriesIncludes: 'ProJoint', seriesExcludes: ['Cat'], variationIncludesAny: ['2kg', '2 kg', '2000g'], image: '/brand-features/lillidale/sku-projoint-2kg.jpg' },
              ],
            },
            {
              name: 'ProHealth for Dogs', fitFor: '200g · 500g · 2kg',
              variants: [
                { label: '500g', seriesIncludes: 'ProHealth', variationIncludes: '500g', image: '/brand-features/lillidale/sku-prohealth-500g.jpg' },
                { label: '200g', seriesIncludes: 'ProHealth', variationIncludes: '200g', image: '/brand-features/lillidale/sku-prohealth-200g.jpg' },
                { label: '2kg', seriesIncludes: 'ProHealth', variationIncludesAny: ['2kg', '2 kg', '2000g'], image: '/brand-features/lillidale/sku-prohealth-2kg.jpg' },
              ],
            },
            {
              name: 'Plaque Guard', fitFor: '60g',
              variants: [
                { label: '60g', seriesIncludes: 'Plaque Guard', variationIncludes: '60', image: '/brand-features/lillidale/sku-plaqueguard.jpg' },
              ],
            },
          ],
        },
        {
          anchor: 'antimicrobial',
          alt: true,
          eyebrow: 'Antimicrobial healthcare',
          heading: 'Gentle, fast-acting antimicrobial care',
          sub: "All-natural, hypochlorous acid-based — no stinging, safe for daily use.",
          items: [
            {
              name: 'Sanitizing Spray', fitFor: '500ml',
              variants: [{ label: '500ml', seriesIncludesAny: ['Sanitising', 'Sanitizing'], image: '/brand-features/lillidale/sku-sanitizingspray.jpg' }],
            },
            {
              name: 'Ear Cleanser', fitFor: '250ml',
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
          heading: 'Everyday grooming & skin essentials',
          sub: 'For between the big stuff.',
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
    description: "Detachable, dishwasher-safe modules that turn mealtime into enrichment — built for the dog who inhales dinner in four seconds flat. With its innovative broken-wave mat design and bone structure, Puzzle Feeder slows down feeding time and encourages natural foraging behaviour in your pets.",
    exclusive: true,
    faqs: [
      ['Is Puzzle Feeder dishwasher-safe?', 'Yes — the modules are designed to be detachable and dishwasher-safe for easy cleaning.'],
      ['Is Pawvy the exclusive distributor of Puzzle Feeder in Singapore?', 'Yes — Pawvy is the exclusive Singapore distributor of Puzzle Feeder.'],
      ['Will this work for a dog that eats too fast?', 'That\'s exactly the problem it\'s designed to solve — the broken-wave mat and bone structure slow down gulping and encourage natural foraging.'],
      ['What sizes are available?', 'Check the individual product listing or ask your nearest stockist for size options suited to your dog.'],
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
        { num: '28', label: 'Day Habit Program' },
      ],
      checklist: {
        eyebrow: 'What it helps prevent',
        heading: 'Say goodbye to...',
        items: ['Choking', 'Vomiting', 'Digestive issues', 'Obesity'],
        badgeHeading: 'Vet Recommended',
        badgeBody: 'Backed by veterinarians for safer, slower eating habits — built with plant-based, non-toxic, BPA-free materials.',
      },
      fitCards: {
        eyebrow: 'Find your fit',
        heading: 'Choose Your Puzzle Feeder',
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
    description: "Simple, traceable ingredients — treats made the way you would want to feed your own dog. Made with single ingredients and minimal processing, these treats provide a natural source of protein and Omega-3 fatty acids to support your pet's wellness, free from unnecessary artificial additives.",
    exclusive: true,
    faqs: [
      ['What ingredients are in Eastsea Brother treats?', 'Single-ingredient, minimally processed treats — check the individual product packaging for the exact ingredient list.'],
      ['Is Pawvy the exclusive distributor of Eastsea Brother in Singapore?', 'Yes — Pawvy is the exclusive Singapore distributor of Eastsea Brother.'],
      ['Are these treats suitable for sensitive stomachs?', 'The single-ingredient, minimal-processing approach is often gentler on sensitive stomachs, but always introduce a new treat gradually and watch for reactions.'],
      ['Where can I buy Eastsea Brother treats?', 'Through our retail partners islandwide — check our Stockist page.'],
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
        body: "Pure taste, no additives. Eastsea Brother brings premium human-grade seafood, wild-caught from Korea's East Sea in Goseong, Gangwon-do, to pets that deserve the nutritious treats.",
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
        sub: 'Pollack, Salmon and Flatfish each come in more than one size — Add to Cart opens a picker for those.',
        // hex is a neutral count-indicator here, not a meaningful color
        // (these are sizes, not colors) — same swatch dots just read as
        // "how many options" rather than a color preview.
        //
        // Salmon: KT confirmed the real DB value is still "115g"
        // (EFDF-S115...) even though the actual product is now 120g — the
        // supplier changed size but the database wasn't renamed, and KT
        // doesn't want to touch it. So the customer-facing label here says
        // "120g" while variationIncludes still searches for "115" to find
        // the real record — display and matching are deliberately
        // decoupled for this one option.
        items: [
          {
            name: 'Pollack', fitFor: 'White fish · 3 sizes',
            variants: [
              { label: '125g', hex: '#B8B2A6', seriesIncludes: 'Pollack', seriesExcludes: ['Stick'], variationIncludes: '125', image: '/brand-features/eastseabrother/sku-pollack-125.jpg' },
              { label: '60g', hex: '#B8B2A6', seriesIncludes: 'Pollack', seriesExcludes: ['Stick'], variationIncludes: '60', image: '/brand-features/eastseabrother/sku-pollack-60.jpg' },
              { label: 'Stick 70g', hex: '#B8B2A6', seriesIncludes: 'Pollack', variationIncludes: 'Stick', image: '/brand-features/eastseabrother/sku-pollack-stick-70.jpg' },
            ],
          },
          {
            name: 'Salmon', fitFor: 'Red fish · 2 sizes',
            variants: [
              { label: '120g', hex: '#B8B2A6', seriesIncludes: 'Salmon', variationIncludes: '115', image: '/brand-features/eastseabrother/sku-salmon-115.jpg' },
              { label: '55g', hex: '#B8B2A6', seriesIncludes: 'Salmon', variationIncludes: '55', image: '/brand-features/eastseabrother/sku-salmon-55.jpg' },
            ],
          },
          {
            name: 'Flatfish', fitFor: 'White fish · 2 sizes',
            variants: [
              { label: '110g', hex: '#B8B2A6', seriesIncludes: 'Flatfish', variationIncludes: '110', image: '/brand-features/eastseabrother/sku-flatfish-110.jpg' },
              { label: '55g', hex: '#B8B2A6', seriesIncludes: 'Flatfish', variationIncludes: '55', image: '/brand-features/eastseabrother/sku-flatfish-55.jpg' },
            ],
          },
          {
            name: 'Capelin', fitFor: 'Whole fish',
            variants: [
              { label: '125g', hex: '#B8B2A6', seriesIncludes: 'Capelin', variationIncludes: '125', image: '/brand-features/eastseabrother/sku-capelin-125.jpg' },
            ],
          },
          {
            name: 'Sandlance', fitFor: 'Whole fish',
            variants: [
              { label: '100g', hex: '#B8B2A6', seriesIncludes: 'Sandlance', variationIncludes: '100', image: '/brand-features/eastseabrother/sku-sandlance-100.jpg' },
            ],
          },
          {
            name: 'Green Lipped Mussels', fitFor: 'Joint support',
            variants: [
              { label: '70g', hex: '#B8B2A6', seriesIncludes: 'Mussel', variationIncludes: '70', image: '/brand-features/eastseabrother/sku-mussels-70.jpg' },
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
    faqs: [
      ['How much Salmoil should I give my dog?', 'Dosage depends on your dog\'s weight and the specific product — always follow the label\'s feeding guide, or check with your vet.'],
      ['Is Pawvy the exclusive distributor of Salmoil in Singapore?', 'Yes — Pawvy is the exclusive Singapore distributor of Salmoil.'],
      ['Does Salmoil need to be refrigerated?', 'Most bottles are shelf-stable unopened, but refrigeration after opening is recommended to preserve freshness — check your specific product\'s label.'],
      ['Can cats have Salmoil too?', 'Some Salmoil products are formulated for both cats and dogs — check the individual listing to confirm before feeding.'],
    ],
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
  },
};
