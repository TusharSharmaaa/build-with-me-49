import { useParams } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { showBanner, hideBanner } from '../lib/ads';
import { useInterstitialPolicy } from '../hooks/useInterstitialPolicy';
import { useEffect } from 'react';
import TopBar from '../components/TopBar';


// Example of fake data; in your real app, you probably fetch by ID
const TOOL_DB: Record<string, any> = {
  '1': { name: 'Leonardo.ai', description: 'Generate AI art and design assets.' },
  '2': { name: 'Canva AI', description: 'Design tool with AI generation.' },
  // Add more as needed...
};

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const tool = TOOL_DB[id || '1'];

  // 1️⃣ Interstitial logic
  useInterstitialPolicy();

  // 2️⃣ Show banner on mount, hide on unmount
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      (async () => {
        try {
          await showBanner();
        } catch (e) {
          console.warn('Banner error', e);
        }
      })();
    }

    return () => {
      if (Capacitor.getPlatform() !== 'web') {
        hideBanner().catch(() => {});
      }
    };
  }, []);

  if (!tool) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Tool not found</h2>
      </div>
    );
  }

  return (

    <div style={{ padding: '16px', paddingBottom: '90px' }}>
      <h1>{tool.name}</h1>
      <p>{tool.description}</p>
    <TopBar title="Tool Details" back />

      <div style={{
        marginTop: 20,
        background: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
      }}>
        <strong>Tool ID:</strong> {id}
      </div>
    </div>
  );
}
