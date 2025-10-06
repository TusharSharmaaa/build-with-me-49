import React from 'react';
import { showBanner, hideBanner, showInterstitial, showRewarded, showPrivacyOptions } from '../lib/ads';

const isDev = import.meta.env.VITE_ADS_MODE !== 'prod';

export default function DevAdBar() {
  if (!isDev) return null;

  const barStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '8px',
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.05)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
  };
  const btn: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    background: '#fff',
    fontSize: 12,
    cursor: 'pointer'
  };

  return (
    <div style={barStyle}>
      <button style={btn} onClick={showBanner}>Show Banner</button>
      <button style={btn} onClick={hideBanner}>Hide Banner</button>
      <button style={btn} onClick={showInterstitial}>Interstitial</button>
      <button style={btn} onClick={showRewarded}>Rewarded</button>
      <button style={btn} onClick={showPrivacyOptions}>Privacy (UMP)</button>
      <button
        style={btn}
        onClick={() => window.open('/privacy.html', '_blank')}
      >
        Policy Page
      </button>
    </div>
  );
}
