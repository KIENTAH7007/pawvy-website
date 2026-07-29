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
  const [activeMultiplier, setActiveMultiplier] = useState(1);
  const [activeMultiplierSource, setActiveMultiplierSource] = useState(null);

  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', instagram_handle: '', preferred_contact_channel: '' });
  const [petForm, setPetForm] = useState({ name: '', breed: '', weight: '', birthday: '', allergies: '', favorite_item: '', chew_power: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPet, setSavingPet] = useState(false);
  const [bonusMessage, setBonusMessage] = useState(null);
  const [birthdayNotice, setBirthdayNotice] = useState(null);
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
      .then(({ customer, pet, buttons_balance, active_multiplier, active_multiplier_source }) => {
        setCustomer(customer);
        setPet(pet);
        setBalance(buttons_balance);
        setActiveMultiplier(active_multiplier);
        setActiveMultiplierSource(active_multiplier_source);
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
    setBirthdayNotice(null);
    try {
      const result = await customerApi.updatePet(petForm);
      setPet(result.pet);
      if (result.profile_bonus?.awarded) setBonusMessage('🎉 Profile complete — 50 BUTTONS credited!');
      if (result.birthday_change_blocked) {
        // The requested birthday change was rejected (rate-limited to once
        // a year — see the backend comment for why). Reset the form field
        // back to what's actually saved, so it doesn't keep showing the
        // rejected date as if it had taken effect.
        setPetForm(f => ({ ...f, birthday: result.pet.birthday || '' }));
        setBirthdayNotice(
          `Your pet's birthday can only be changed once a year — you'll be able to update it again from ${result.birthday_change_available_from}.`
        );
      }
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
    <>
      <section className="subhero">
        <div className="blob" />
        <div className="wrap subhero-inner">
          <div className="eyebrow">Your account</div>
          <h1>My Pawvy Account</h1>
        </div>
      </section>

      <div className="section-curve" style={{ background: 'var(--navy)' }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      <section className="account-body">
        <div className="wrap account-inner">
          <div className="account-topbar">
            <Link href="/shop" className="btn btn-outline-dark"><span>Shop</span></Link>
            <button onClick={handleLogout} className="btn btn-outline-dark"><span>Log out</span></button>
          </div>

          <div className="account-card">
            <div className="account-card-label">BUTTONS Balance</div>
            <div className="account-balance">{balance}B</div>
          </div>

          {activeMultiplierSource === 'birthday' && (
            <div className="account-birthday-banner">
              🎂 It's your pet's birthday month — you're earning <strong>{activeMultiplier}× BUTTONS</strong> on every purchase this month!
            </div>
          )}

          <div className="account-card">
            <div className="account-card-label">Your Referral Link — you and your friends get BUTTONS</div>
            <input readOnly value={referralLink} className="account-referral-input" onFocus={e => e.target.select()} />
          </div>

          {!customer.profile_bonus_claimed && (
            <div className="account-bonus-banner">
              <strong>Complete your profile for 50 BUTTONS</strong>
              <p>
                Fill in your pet's details and your contact preference below — plus you'll get a
                reminder (and a gift!) around your pet's birthday once this is done.
              </p>
            </div>
          )}

          {bonusMessage && (
            <div className="account-success-banner">{bonusMessage}</div>
          )}

          <form onSubmit={saveProfile} className="account-form">
            <h2>Your Details</h2>
            <FormField label="Name" value={profileForm.name} onChange={v => setProfileForm(f => ({ ...f, name: v }))} />
            <FormField label="Phone" value={profileForm.phone} onChange={v => setProfileForm(f => ({ ...f, phone: v }))} />
            <FormField label="Address" value={profileForm.address} onChange={v => setProfileForm(f => ({ ...f, address: v }))} />
            <FormField label="Instagram handle" value={profileForm.instagram_handle} onChange={v => setProfileForm(f => ({ ...f, instagram_handle: v }))} />
            <div className="field">
              <label>Preferred contact channel</label>
              <select
                value={profileForm.preferred_contact_channel}
                onChange={e => setProfileForm(f => ({ ...f, preferred_contact_channel: e.target.value }))}
              >
                <option value="">Select…</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>
            <button type="submit" disabled={savingProfile} className="btn btn-orange"><span>{savingProfile ? 'Saving…' : 'Save Details'}</span></button>
          </form>

          <form onSubmit={savePet} className="account-form">
            <h2>Your Pet</h2>
            <FormField label="Name" value={petForm.name} onChange={v => setPetForm(f => ({ ...f, name: v }))} />
            <FormField label="Breed" value={petForm.breed} onChange={v => setPetForm(f => ({ ...f, breed: v }))} />
            <FormField label="Weight (kg)" type="number" value={petForm.weight} onChange={v => setPetForm(f => ({ ...f, weight: v }))} />
            <FormField label="Birthday" type="date" value={petForm.birthday} onChange={v => setPetForm(f => ({ ...f, birthday: v }))} />
            {birthdayNotice && <p className="account-error" style={{ color: 'var(--dark-gray)' }}>{birthdayNotice}</p>}
            <FormField label="Allergies / dietary notes" value={petForm.allergies} onChange={v => setPetForm(f => ({ ...f, allergies: v }))} />
            <div className="field">
              <label>Favorite item type</label>
              <select
                value={petForm.favorite_item}
                onChange={e => setPetForm(f => ({ ...f, favorite_item: e.target.value }))}
              >
                <option value="">Select…</option>
                <option value="Food">Food</option>
                <option value="Toy">Toy</option>
                <option value="Chewing">Chewing</option>
                <option value="Sleeping">Sleeping</option>
              </select>
            </div>
            <div className="field">
              <label>Chew power</label>
              <select
                value={petForm.chew_power}
                onChange={e => setPetForm(f => ({ ...f, chew_power: e.target.value }))}
              >
                <option value="">Select…</option>
                <option value="Gentle">Gentle</option>
                <option value="Enthusiast">Enthusiast</option>
                <option value="Hardcore">Hardcore</option>
              </select>
            </div>
            <button type="submit" disabled={savingPet} className="btn btn-orange"><span>{savingPet ? 'Saving…' : 'Save Pet Info'}</span></button>
          </form>

          <form onSubmit={savePassword} className="account-form">
            <h2>{customer.has_password ? 'Change Password' : 'Set a Password'}</h2>
            <p className="form-hint">
              {customer.has_password
                ? "Set a new password below — you'll use it next time instead of the email link."
                : "You're currently logging in with an email link only. Set a password so you don't need one next time."}
            </p>
            <FormField label="New password" type="password" value={passwordForm.password} onChange={v => setPasswordForm(f => ({ ...f, password: v }))} />
            <FormField label="Confirm password" type="password" value={passwordForm.confirm} onChange={v => setPasswordForm(f => ({ ...f, confirm: v }))} />
            {passwordError && <p className="account-error">{passwordError}</p>}
            {passwordSuccess && <p style={{ color: '#1e6b1e', fontSize: 13, marginTop: 10, fontWeight: 600 }}>Password updated.</p>}
            <button type="submit" disabled={savingPassword} className="btn btn-orange"><span>{savingPassword ? 'Saving…' : (customer.has_password ? 'Change Password' : 'Set Password')}</span></button>
          </form>
        </div>
      </section>
    </>
  );
}

function FormField({ label, value, onChange, type = 'text' }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
