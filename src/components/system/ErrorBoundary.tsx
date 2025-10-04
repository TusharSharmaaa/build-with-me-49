import React from "react";

type S = { hasError: boolean };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, S> {
  state: S = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: any, info: any) {
    console.error("UI Crash:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h2>Something went wrong</h2>
          <p>Reload the app. If this repeats, clear cache.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
