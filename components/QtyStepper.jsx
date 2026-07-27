'use client';

import React, { useState, useEffect } from 'react';

// Identical logic to the Vite version (itself matching the Order Portal's
// QtyStepper exactly — see git history for the input-focus-loss bug this
// avoids). 'use client' since it uses hooks/local interactive state.
export default function QtyStepper({ value, onChange, disabled }) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => { setRaw(String(value)); }, [value]);

  function commit() {
    const n = parseInt(raw, 10);
    if (!raw || isNaN(n) || n < 1) { setRaw('1'); onChange(1); return; }
    onChange(n);
    setRaw(String(n));
  }

  function step(delta) {
    const next = Math.max(1, value + delta);
    setRaw(String(next));
    onChange(next);
  }

  return (
    <div className="qty-stepper" style={{ opacity: disabled ? 0.4 : 1 }}>
      <button type="button" disabled={disabled} onClick={() => step(-1)}>−</button>
      <input
        type="number"
        min="1"
        value={raw}
        disabled={disabled}
        onChange={e => setRaw(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') { commit(); e.target.blur(); } }}
        style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 14, color: 'var(--navy)', border: 'none', background: 'transparent' }}
      />
      <button type="button" disabled={disabled} onClick={() => step(1)}>+</button>
    </div>
  );
}
