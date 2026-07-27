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
      <div className="enq-form" style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--navy)', fontWeight: 700 }}>
          Thanks for reaching out! We've received your message and will get back to you soon —
          check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="enq-form">
      <div className="field">
        <label>Name</label>
        <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
      </div>
      <div className="field">
        <label>Email</label>
        <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="field">
        <label>Phone (optional)</label>
        <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+65 ..." />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea required rows={5} value={form.message} onChange={e => update('message', e.target.value)} placeholder="How can we help?" />
      </div>
      {error && <p style={{ color: 'crimson', fontSize: 13, marginBottom: 14 }}>{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-orange" style={{ width: '100%', justifyContent: 'center' }}>
        <span>{busy ? 'Sending…' : 'Send Message'}</span>
      </button>
    </form>
  );
}
