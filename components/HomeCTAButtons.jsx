'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSessionToken } from '../lib/api';

// Small client "island" inside an otherwise server-rendered Home page —
// only this part needs to know about localStorage/login state, so only
// this part pays the client-JS cost. Everything else on the home page
// stays plain server-rendered HTML.
export default function HomeCTAButtons() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getSessionToken());
  }, []);

  return (
    <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
      <Link href="/shop"><button style={{ padding: '10px 16px' }}>Shop</button></Link>
      {loggedIn ? (
        <Link href="/account"><button style={{ padding: '10px 16px' }}>My Account</button></Link>
      ) : (
        <>
          <Link href="/signup"><button style={{ padding: '10px 16px' }}>Sign Up</button></Link>
          <Link href="/login"><button style={{ padding: '10px 16px' }}>Log In</button></Link>
        </>
      )}
    </div>
  );
}
