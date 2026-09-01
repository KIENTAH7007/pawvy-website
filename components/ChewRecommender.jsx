'use client';

import HardnessSelector from './HardnessSelector';

// Same real component and interaction as BetterBone's "How does your
// dog chew?" selector (components/HardnessSelector.jsx) — tap a
// chewing-style option, it scrolls to and briefly highlights the
// matching card in the grid below. Labels here are single words for
// the same reason BetterBone's are ("Soft"/"Moderate"/"Hard") — the
// selected label is used directly as the scroll-target id suffix.
const CHEW_LEVELS = [
  { label: 'Gullet', caption: 'Very gentle / new to chews' },
  { label: 'Tripe', caption: 'Light chewer' },
  { label: 'Trachea', caption: 'Moderate chewer' },
  { label: 'Headskin', caption: 'Determined chewer' },
];

export default function ChewRecommender() {
  return (
    <HardnessSelector
      levels={CHEW_LEVELS}
      question="How does your dog chew?"
      sub="Tap an option to jump to the right pick"
      idPrefix="chew-card-"
    />
  );
}
