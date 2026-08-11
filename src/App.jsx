import React from 'react';
import FrameGenerator from './components/FrameGenerator.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas-soft text-ink select-none antialiased">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full h-16 bg-canvas/90 backdrop-blur-md border-b border-hairline flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight font-sans text-primary">HACKER HOUSE GOA</span>
          <span className="text-[10px] font-mono bg-brand-yellow/20 px-2 py-0.5 border border-brand-yellow/40 rounded-sm text-brand-forest font-bold">2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-yellow animate-pulse"></span>
          <span className="text-xs font-mono font-bold text-primary">PORTAL READY</span>
        </div>
      </header>

      {/* Hero Header Section */}
      <main className="flex-1 pb-24">
        <section className="relative overflow-hidden pt-20 pb-12 px-6 text-center mesh-gradient-bg">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-forest text-brand-yellow border border-brand-gold/20 rounded-full text-xs font-mono font-semibold mb-6 custom-shadow-sm">
              Build • Ship • Repeat
            </div>

            {/* Main Header */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink font-sans leading-none mb-6">
              HACKER HOUSE GOA 2026.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-body max-w-xl mb-4 leading-relaxed font-sans font-medium">
              Claim your verified hacker status. Upload your builder avatar to generate a custom profile picture frame or standard Builder ID card.
            </p>
          </div>
        </section>

        {/* Generator App UI */}
        <section className="relative z-10 -mt-6">
          <FrameGenerator />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-canvas border-t border-hairline py-8 px-6 md:px-12 mt-12 text-center sm:text-left">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-xs text-mute font-mono">// HH-GOA-2026 // ON-BRAND EXPERIENCE</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-mute font-mono font-bold text-brand-pink">#FrameInGoa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
