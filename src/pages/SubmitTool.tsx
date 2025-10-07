// src/pages/SubmitTool.tsx
import React, { useState } from 'react';
import { useEffect } from 'react';


/* ---------- Helpers ---------- */
// Normalizes user-entered URLs (adds https:// if missing)
const SCHEME = /^https?:\/\//i;
export function normalizeUrl(raw: string): string {
  if (!raw) return '';
  const v = raw.trim();
  if (!v) return '';
  return SCHEME.test(v) ? v : `https://${v}`;
}

// Basic website validator: http/https + at least one dot and no spaces
function isValidHttpUrl(url: string): boolean {
  return /^https?:\/\/[^ \t\r\n]+\.[^ \t\r\n]+/i.test(url.trim());
}

/* ---------- Types ---------- */
type PricingModel = 'Free' | 'Freemium' | 'Paid' | 'Trial';

/* ---------- Component ---------- */
export default function SubmitTool() {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  const [form, setForm] = useState({
    name: '',
    website: '',
    description: '',
    pricing: 'Freemium' as PricingModel,
    hasFreeTier: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Simulated submit – replace with real API
  async function submit(payload: typeof form) {
    // TODO: call your backend
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true };
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Normalize + validate URL
    const website = normalizeUrl(form.website);
    if (!form.name.trim()) {
      setError('Please enter the tool name.');
      return;
    }
    if (!isValidHttpUrl(website)) {
      setError('Please enter a valid URL like https://example.com');
      return;
    }

    // Persist normalized website in UI
    setForm((f) => ({ ...f, website }));

    setSubmitting(true);
    const res = await submit({ ...form, website });
    setSubmitting(false);

    if (res && (res as any).ok) {
      setSuccess('Thanks! Your tool has been submitted.');
      // Optional: clear form (keep website normalized)
      setForm({
        name: '',
        website: '',
        description: '',
        pricing: 'Freemium',
        hasFreeTier: false,
      });
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Submit AI Tool</h1>

      {error && (
        <div
          role="alert"
          style={{
            marginBottom: 12,
            padding: '10px 12px',
            borderRadius: 8,
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            marginBottom: 12,
            padding: '10px 12px',
            borderRadius: 8,
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        {/* Tool Name */}
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Tool Name <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g., Leonardo.ai"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          required
        />

        {/* Website URL */}
        <label style={labelStyle}>Website URL <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          type="url"
          name="website"
          placeholder="https://example.com"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          onBlur={(e) =>
            setForm((f) => ({ ...f, website: normalizeUrl(e.target.value) }))
          }
          style={inputStyle}
          required
        />

        {/* Description */}
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          placeholder="What does this tool do best?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        {/* Pricing Model */}
        <label style={labelStyle}>Pricing Model</label>
        <select
          name="pricing"
          value={form.pricing}
          onChange={(e) =>
            setForm({ ...form, pricing: e.target.value as PricingModel })
          }
          style={inputStyle}
        >
          <option value="Free">Free</option>
          <option value="Freemium">Freemium</option>
          <option value="Paid">Paid</option>
          <option value="Trial">Trial</option>
        </select>

        {/* Has free tier */}
        <label style={{ ...labelStyle, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={form.hasFreeTier}
            onChange={(e) => setForm({ ...form, hasFreeTier: e.target.checked })}
          />
          Has free tier
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            background: submitting ? '#93c5fd' : '#3b82f6',
            color: 'white',
            fontWeight: 600,
            border: 'none',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Tool'}
        </button>
      </form>
    </div>
  );
}

/* ---------- Styles ---------- */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  outline: 'none',
  marginBottom: 12,
  background: 'white',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  margin: '8px 0 6px',
};
