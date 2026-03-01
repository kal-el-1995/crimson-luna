import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Brand name */}
        <p className="text-crimson text-lg font-semibold tracking-widest uppercase mb-6">
          Crimson Luna
        </p>

        {/* 404 heading */}
        <h1
          className="text-8xl font-bold mb-4 text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          404
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-white/70 mb-10">Page not found</p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-crimson text-white rounded-lg font-medium text-sm hover:bg-crimson/90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 border border-white/20 text-white/80 rounded-lg font-medium text-sm hover:bg-white/5 hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
