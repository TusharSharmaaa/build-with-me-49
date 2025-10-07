// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

function TopBar() {
  const nav = useNavigate();
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', borderBottom: '1px solid #eee',
      position: 'sticky', top: 0, background: '#fff', zIndex: 10
    }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>AI Tools List</h1>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button onClick={() => nav('/')} aria-label="Home">Home</button>
        <button onClick={() => nav('/categories')} aria-label="Categories">Categories</button>
        <button onClick={() => nav('/search')} aria-label="Search">Search</button>
        <button onClick={() => nav('/favorites')} aria-label="Favorites">Favorites</button>
        <button onClick={() => nav('/profile')} aria-label="Profile">Profile</button>
      </div>
    </header>
  );
}

function PageShell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

function Home() {
  return (
    <PageShell title="Home">
      <p>Welcome! Basic shell is running without ads.</p>
      <ul>
        <li><Link to="/tool/1">Open a sample Tool Detail (id: 1)</Link></li>
        <li><Link to="/submit">Submit a Tool</Link></li>
      </ul>
    </PageShell>
  );
}

function Categories() {
  return <PageShell title="Categories">Categories list goes here.</PageShell>;
}

function Search() {
  return <PageShell title="Search">Search UI goes here.</PageShell>;
}

function Favorites() {
  return <PageShell title="Favorites">Your saved tools appear here.</PageShell>;
}

function Profile() {
  return <PageShell title="Profile">Profile/settings page.</PageShell>;
}

function ToolDetail() {
  return (
    <PageShell title="Tool Detail">
      <p>Details for a specific tool. Route: <code>/tool/:id</code></p>
    </PageShell>
  );
}

function SubmitTool() {
  return (
    <PageShell title="Submit AI Tool">
      <form onSubmit={(e) => { e.preventDefault(); alert('Submitted (demo)'); }}>
        <div style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
          <label>
            Tool Name *
            <input required placeholder="e.g., Canva AI" style={{ width: '100%' }} />
          </label>
          <label>
            Website URL *
            <input required type="url" placeholder="https://example.com" style={{ width: '100%' }} />
          </label>
          <label>
            Description
            <textarea rows={4} placeholder="What does it do?" style={{ width: '100%' }} />
          </label>
          <button type="submit">Submit</button>
        </div>
      </form>
    </PageShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tool/:id" element={<ToolDetail />} />
        <Route path="/submit" element={<SubmitTool />} />
        {/* fallback */}
        <Route path="*" element={
          <PageShell title="Not Found">
            <p>This page does not exist. Go <Link to="/">home</Link>.</p>
          </PageShell>
        }/>
      </Routes>
      <footer style={{
        position: 'sticky', bottom: 0, padding: 12, borderTop: '1px solid #eee',
        background: '#fff', textAlign: 'center'
      }}>
        <small>© {new Date().getFullYear()} AI Tools List</small>
      </footer>
    </BrowserRouter>
  );
}
