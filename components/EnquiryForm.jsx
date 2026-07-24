'use client';

import React, { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Client component — the interactive part of an otherwise static Contact
// page. Submits directly to the Pawvy App backend's public /api/enquiries
// endpoint, which fires a Telegram notification to KT/Janice immediately
// (same infrastructure already proven for order alerts) — genuinely faster
// than checking email, per the earlier discussion about live-chat
// alternatives.
export default function EnquiryForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 8, padding: 16, marginTop: 16 }}>
        Thanks for reaching out! We've received your message and will get back to you soon —
        check your email for confirmation.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
      <label>
        Name
        <input value={form.name} onChange={e => update('name', e.target.value)} style={inputStyle} />
      </label>
      <label>
        Email
        <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} />
      </label>
      <label>
        Phone (optional)
        <input value={form.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} />
      </label>
      <label>
        Message
        <textarea
          required rows={5} value={form.message} onChange={e => update('message', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </label>
      {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}
      <button type="submit" disabled={busy} style={{ padding: '10px 16px' }}>
        {busy ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4 };
