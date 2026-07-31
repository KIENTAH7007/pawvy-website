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
        levels: [
          {
            label: 'Soft', level: 1, caption: 'Teething puppy, senior dog',
            image: '/brand-features/betterbone/durability-soft.jpg',
            productImage: '/brand-features/betterbone/pack-soft.jpg',
            productName: 'BetterBone Soft Chew — No Nylon, Hypoallergenic',
            seriesIncludes: 'BetterBone', variationIncludes: 'Soft',
          },
          {
            label: 'Medium', level: 2, caption: 'Average chewer',
            image: '/brand-features/betterbone/durability-medium.jpg',
            productImage: '/brand-features/betterbone/pack-medium.jpg',
            productName: 'BetterBone Medium Chew — No Nylon, Hypoallergenic',
            seriesIncludes: 'BetterBone', variationIncludes: 'Medium',
          },
          {
            label: 'Hard', level: 3, caption: 'Heavy chewer, constant gnawing',
            image: '/brand-features/betterbone/durability-hard.jpg',
            productImage: '/brand-features/betterbone/pack-hard.jpg',
            productName: 'BetterBone Hard Chew — No Nylon, Hypoallergenic',
            seriesIncludes: 'BetterBone', variationIncludes: 'Hard',
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
