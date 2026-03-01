"use client";

import React from "react";

interface RootErrorBoundaryState {
  hasError: boolean;
}

export class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  RootErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): RootErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("[RootErrorBoundary] Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <html lang="en" className="dark">
          <body style={{ margin: 0, background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <div style={{ textAlign: "center", color: "#f5f0eb", fontFamily: "sans-serif", padding: "2rem" }}>
              <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#dc2626" }}>
                Crimson Luna
              </h1>
              <p style={{ marginBottom: "1.5rem", color: "#a09080" }}>App failed to load.</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.625rem 1.5rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Reload
              </button>
            </div>
          </body>
        </html>
      );
    }

    return <>{this.props.children}</>;
  }
}
