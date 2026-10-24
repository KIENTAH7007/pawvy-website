'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { normalizeRefCode, saveRefCode } from '../../../lib/referral';

// Short referral link: pawvy.co/r/KOKOHONEY → signup page with the code filled in
// (and remembered for 30 days). Client-side redirect so it works behind Railway's proxy.
export default function ReferralRedirect() {
  const { code } = useParams();
  const router = useRouter();
  useEffect(() => {
    const c = normalizeRefCode(code);
    if (c) saveRefCode(c);
    router.replace(c ? `/signup?ref=${c}` : '/signup');
  }, [code, router]);
  return <div style={{ maxWidth: 440, margin: '160px auto', padding: '0 20px', textAlign: 'center', color: '#666' }}>Taking you to sign up…</div>;
}
