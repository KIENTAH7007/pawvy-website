'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Client-side cart, persisted to localStorage — identical logic to the
// previous Vite version. 'use client' required since this uses hooks and
// browser storage; the actual product/shop pages that use this stay
// server-rendered for their initial content, this just provides the
// interactive add-to-cart behavior layered on top.
const CartContext = createContext(null);
const STORAGE_KEY = 'pawvy_cart';

function loadCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage only after mount — avoids a server/client
  // markup mismatch (SSR always renders an empty cart; the real cart only
  // exists in the browser).
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        id: product.id, item_series: product.item_series, variation: product.variation,
        brand_name: product.brand_name, price: product.effective_price_rrp_sg, qty,
        image_data: product.image_data || null,
      }];
    });
  }

  function updateQty(id, qty) {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
