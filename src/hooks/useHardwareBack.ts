import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useLocation, useNavigate } from 'react-router-dom';


export default function useHardwareBack() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
  if (Capacitor.getPlatform() !== 'android') return;

  let handle: { remove: () => void } | null = null;

  // add listener and store the handle when ready
  CapApp.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack || pathname !== '/') {
      nav(-1);
    } else {
      CapApp.exitApp();
    }
  }).then(h => {
    handle = h as { remove: () => void };
  }).catch(() => {
    handle = null;
  });

  // cleanup
  return () => {
    try {
      handle?.remove?.();
    } catch {}
  };
}, [nav, pathname]);

}
