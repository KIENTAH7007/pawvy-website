'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { customerApi, getSessionToken, setSessionToken } from '../../lib/api';

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [pet, setPet] = useState(null);
  const [balance, setBalance] = useState(0);

  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', instagram_handle: '', preferred_contact_channel: '' });
  const [petForm, setPetForm] = useState({ name: '', breed: '', weight: '', birthday: '', allergies: '', favorite_item: '', chew_power: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPet, setSavingPet] = useState(false);
  const [bonusMessage, setBonusMessage] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (!getSessionToken()) { router.push('/login'); return; }
    load();
  }, []);

  function load() {
    customerApi.me()
      .then(({ customer, pet, buttons_balance }) => {
        setCustomer(customer);
        setPet(pet);
        setBalance(buttons_balance);
        setReferralLink(`${window.location.origin}/signup?ref=${customer.referral_code}`);
        setProfileForm({
          name: customer.name || '', phone: customer.phone || '', address: customer.address || '',
          instagram_handle: customer.instagram_handle || '', preferred_contact_channel: customer.preferred_contact_channel || '',
        });
        if (pet) {
          setPetForm({
            name: pet.name || '', breed: pet.breed || '', weight: pet.weight || '', birthday: pet.birthday || '',
            allergies: pet.allergies || '', favorite_item: pet.favorite_item || '', chew_power: pet.chew_power || '',
          });
        }
      })
      .catch(() => { setSessionToken(null); router.push('/login'); })
      .finally(() => setLoading(false));
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const result = await customerApi.updateProfile(profileForm);
      setCustomer(result.customer);
      if (result.profile_bonus?.awarded) setBonusMessage('🎉 Profile complete — 50 BUTTONS credited!');
      load();
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePet(e) {
    e.preventDefault();
    setSavingPet(true);
    try {
      const result = await customerApi.updatePet(petForm);
      setPet(result.pet);
      if (result.profile_bonus?.awarded) setBonusMessage('🎉 Profile complete — 50 BUTTONS credited!');
      load();
    } finally {
      setSavingPet(false);
    }
  }

  function handleLogout() {
    customerApi.logout().finally(() => { setSessionToken(null); router.push('/'); });
  }

  async function savePassword(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (passwordForm.password !== passwordForm.confirm) { setPasswordError("Passwords don't match."); return; }
    if (passwordForm.password.length < 8) { setPasswordError('Password must be at least 8 characters.'); return; }

    setSavingPassword(true);
    try {
      await customerApi.setPassword(passwordForm.password);
      setPasswordForm({ password: '', confirm: '' });
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) return <div style={{ maxWidth: 560, margin: '140px auto 40px', padding: '0 20px' }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 560, margin: '140px auto 40px', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Pawvy Account</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/shop"><button style={{ padding: '6px 12px' }}>Shop</button></Link>
          <button onClick={handleLogout} style={{ padding: '6px 12px' }}>Log out</button>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 16 }}>
        <div style={{ fontSize: 13, color: '#666' }}>BUTTONS Balance</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{balance}B</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 12 }}>
        <div style={{ fontSize: 13, color: '#666' }}>Your Referral Link — you and your friends get BUTTONS</div>
        <input readOnly value={referralLink} style={{ width: '100%', padding: 8, marginTop: 6 }} onFocus={e => e.target.select()} />
      </div>

      {!customer.profile_bonus_claimed && (
        <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: 16, marginTop: 12 }}>
          <strong>Complete your profile for 50 BUTTONS</strong>
          <p style={{ fontSize: 13, color: '#666', margin: '6px 0 0' }}>
            Fill in your pet's details and your contact preference below — plus you'll get a
            reminder (and a gift!) around your pet's birthday once this is done.
          </p>
        </div>
      )}

      {bonusMessage && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 8, padding: 12, marginTop: 12 }}>
          {bonusMessage}
        </div>
      )}

      <form onSubmit={saveProfile} style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16 }}>Your Details</h2>
        <FormField label="Name" value={profileForm.name} onChange={v => setProfileForm(f => ({ ...f, name: v }))} />
        <FormField label="Phone" value={profileForm.phone} onChange={v => setProfileForm(f => ({ ...f, phone: v }))} />
        <FormField label="Address" value={profileForm.address} onChange={v => setProfileForm(f => ({ ...f, address: v }))} />
        <FormField label="Instagram handle" value={profileForm.instagram_handle} onChange={v => setProfileForm(f => ({ ...f, instagram_handle: v }))} />
        <label style={{ display: 'block', marginTop: 10 }}>
          Preferred contact channel
          <select
            value={profileForm.preferred_contact_channel}
            onChange={e => setProfileForm(f => ({ ...f, preferred_contact_channel: e.target.value }))}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">Select…</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
          </select>
        </label>
        <button type="submit" disabled={savingProfile} style={{ padding: '8px 16px', marginTop: 12 }}>
          {savingProfile ? 'Saving…' : 'Save Details'}
        </button>
      </form>

      <form onSubmit={savePet} style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16 }}>Your Pet</h2>
        <FormField label="Name" value={petForm.name} onChange={v => setPetForm(f => ({ ...f, name: v }))} />
        <FormField label="Breed" value={petForm.breed} onChange={v => setPetForm(f => ({ ...f, breed: v }))} />
        <FormField label="Weight (kg)" type="number" value={petForm.weight} onChange={v => setPetForm(f => ({ ...f, weight: v }))} />
        <FormField label="Birthday" type="date" value={petForm.birthday} onChange={v => setPetForm(f => ({ ...f, birthday: v }))} />
        <FormField label="Allergies / dietary notes" value={petForm.allergies} onChange={v => setPetForm(f => ({ ...f, allergies: v }))} />
        <label style={{ display: 'block', marginTop: 10 }}>
          Favorite item type
          <select
            value={petForm.favorite_item}
            onChange={e => setPetForm(f => ({ ...f, favorite_item: e.target.value }))}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">Select…</option>
            <option value="Food">Food</option>
            <option value="Toy">Toy</option>
            <option value="Chewing">Chewing</option>
            <option value="Sleeping">Sleeping</option>
          </select>
        </label>
        <label style={{ display: 'block', marginTop: 10 }}>
          Chew power
          <select
            value={petForm.chew_power}
            onChange={e => setPetForm(f => ({ ...f, chew_power: e.target.value }))}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">Select…</option>
            <option value="Gentle">Gentle</option>
            <option value="Enthusiast">Enthusiast</option>
            <option value="Hardcore">Hardcore</option>
          </select>
        </label>
        <button type="submit" disabled={savingPet} style={{ padding: '8px 16px', marginTop: 12 }}>
          {savingPet ? 'Saving…' : 'Save Pet Info'}
        </button>
      </form>

      <form onSubmit={savePassword} style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16 }}>{customer.has_password ? 'Change Password' : 'Set a Password'}</h2>
        <p style={{ fontSize: 12.5, color: '#666', marginTop: -6 }}>
          {customer.has_password
            ? "Set a new password below — you'll use it next time instead of the email link."
            : "You're currently logging in with an email link only. Set a password so you don't need one next time."}
        </p>
        <FormField label="New password" type="password" value={passwordForm.password} onChange={v => setPasswordForm(f => ({ ...f, password: v }))} />
        <FormField label="Confirm password" type="password" value={passwordForm.confirm} onChange={v => setPasswordForm(f => ({ ...f, confirm: v }))} />
        {passwordError && <p style={{ color: 'crimson', fontSize: 13 }}>{passwordError}</p>}
        {passwordSuccess && <p style={{ color: 'green', fontSize: 13 }}>Password updated.</p>}
        <button type="submit" disabled={savingPassword} style={{ padding: '8px 16px', marginTop: 12 }}>
          {savingPassword ? 'Saving…' : (customer.has_password ? 'Change Password' : 'Set Password')}
        </button>
      </form>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text' }) {
  return (
    <label style={{ display: 'block', marginTop: 10 }}>
      {label}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
    </label>
  );
}
