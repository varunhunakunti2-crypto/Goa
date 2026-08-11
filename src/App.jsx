import React from 'react';
import FrameGenerator from './components/FrameGenerator.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full h-16 bg-canvas border-b border-hairline flex items-center justify-between px-6 md:px-12 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight font-sans text-ink">HACKHIND GOA</span>
          <span className="text-[10px] font-mono bg-canvas-soft-2 px-2 py-0.5 border border-hairline rounded-sm text-body">2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-mute hidden sm:inline">DEADLINE: AUG 13, 23:59 PM</span>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-body">Live Generator</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pb-24">
        <section className="relative overflow-hidden pt-20 pb-16 px-6 text-center mesh-gradient-bg">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas border border-hairline rounded-full text-xs font-mono text-body mb-6 custom-shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-link"></span>
              INTRODUCING FORMAT A & B
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink font-sans leading-none mb-6">
              HH Goa Frame Generator.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-body max-w-xl mb-8 leading-relaxed font-sans">
              Upload your photo, configure your hacker details, and instantly generate a premium circular PFP frame or Builder ID card. Completely free with no login required.
            </p>
          </div>
        </section>

        {/* App Component */}
        <section className="relative z-10 -mt-8">
          <FrameGenerator />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-canvas border-t border-hairline py-12 px-6 md:px-12 mt-12 text-center sm:text-left">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-sm font-semibold text-ink">HH Goa Frame Generator</p>
            <p className="text-xs text-mute mt-1">© 2026 HackHind. Build & Share to X with #FrameInGoa.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-mute">// VERIFIED BUILDER SYSTEM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
