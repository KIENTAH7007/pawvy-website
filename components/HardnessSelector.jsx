'use client';

import { useState } from 'react';

// BetterBone hardness selector (Aug 2026, per KT — from the original UX
// review's "turn the existing guidance into a recommendation tool"
// suggestion). Deliberately reuses each level's own `caption` as the
// button label (e.g. "Teething puppy, senior dog") rather than writing
// new copy — the guidance already existed on the cards below, this is
// just making it interactive, not inventing new recommendations.
export default function HardnessSelector({ levels }) {
  const [selected, setSelected] = useState(null);

  function handleSelect(label) {
    setSelected(label);
    const el = document.getElementById(`durability-card-${label.toLowerCase()}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('durability-card-highlight');
    window.setTimeout(() => el.classList.remove('durability-card-highlight'), 1800);
  }

  return (
    <div className="hardness-selector">
      <div className="hardness-selector-label">How does your dog chew?</div>
      <div className="hardness-selector-options">
        {levels.map(lvl => (
          <button
            key={lvl.label}
            type="button"
            className={`hardness-selector-btn${selected === lvl.label ? ' active' : ''}`}
            onClick={() => handleSelect(lvl.label)}
          >
            {lvl.caption}
          </button>
        ))}
      </div>
      {selected && (
        <div className="hardness-selector-result">
          We'd recommend: <strong>{selected}</strong>
        </div>
      )}
    </div>
  );
}
