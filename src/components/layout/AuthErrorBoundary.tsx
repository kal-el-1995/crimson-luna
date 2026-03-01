"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class AuthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("[AuthenticatedLayout] Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-dark">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-10 flex flex-col items-center text-center gap-5 max-w-sm w-full mx-4">
            <span className="text-4xl font-display font-bold text-crimson-300">Crimson Luna</span>
            <h2 className="text-lg font-semibold text-warm-white">Something went wrong</h2>
            <p className="text-warm-white-muted text-sm">
              An unexpected error occurred. Please reload the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 rounded-lg bg-crimson px-6 py-2.5 text-sm font-medium text-white hover:bg-crimson/90 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
