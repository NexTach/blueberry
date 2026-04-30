'use client';

import { useEffect } from 'react';

export default function PWARegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignore registration failures to avoid breaking the app shell.
    });
  }, []);

  return null;
}
