import React from 'react';
import FrameGenerator from './components/FrameGenerator.jsx';
import SharePage from './components/SharePage.jsx';
import { CircularCarousel } from './components/ui/circular-carousel.tsx';
import manifestBg from './assets/Gemini_Generated_Image_vppp0tvppp0tvppp.png';

const carouselItems = [
  {
    id: "1",
    title: "Nebula Engine",
    description: "Real-time rendering pipeline built for immersive 3D worlds.",
    tag: "Graphics",
  },
  {
    id: "2",
    title: "Quantum Sync",
    description: "Instant state replication across every connected device.",
    tag: "Realtime",
  },
  {
    id: "3",
    title: "Aurora Analytics",
    description: "Insightful dashboards that surface trends as they happen.",
    tag: "Data",
  },
  {
    id: "4",
    title: "Pulse Notifications",
    description: "Timely, contextual alerts that keep users in the loop.",
    tag: "Messaging",
  },
  {
    id: "5",
    title: "Vault Security",
    description: "End-to-end encryption with zero-trust access controls.",
    tag: "Security",
  },
  {
    id: "6",
    title: "Forge CI",
    description: "Blazing-fast build and deploy pipelines out of the box.",
    tag: "DevOps",
  },
];

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const isSharePage = path.startsWith('/share/');
  const shareId = isSharePage ? path.split('/').pop() : null;

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-ink select-none antialiased">
      {/* Skip to main content — keyboard / screen-reader shortcut */}
      <a
        href="#generator"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-forest focus:text-brand-yellow focus:rounded-lg focus:font-bold focus:text-sm"
      >
        Skip to generator
      </a>

      {/* Sticky Header */}
      <header role="banner" aria-label="Hacker House Goa 2026" style={{ background: '#062E22' }} className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-6 md:px-12 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-tight font-sans" style={{ color: '#F4C400' }}>HACKER HOUSE GOA</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm" style={{ color: '#062E22', background: '#F4C400', border: '1px solid #F4C400' }}>2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ background: '#E8235A' }} aria-hidden="true"></span>
          <span className="text-xs font-mono font-bold" style={{ color: '#F4C400' }}>PORTAL READY</span>
        </div>
      </header>

      {/* Back Button — below the header bar */}
      <div className="w-full px-6 md:px-12 pt-4 pb-0">
        <button
          id="btn-back"
          className="btn-back"
          onClick={() => {
            if (window.history.length > 2) {
              window.history.back();
            } else {
              window.location.reload();
            }
          }}
          aria-label="Go back"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 2L4 7L9 12" stroke="#F4C400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>





      {/* Hero Header Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-12 px-6 text-center mesh-gradient-bg">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#062E22] text-brand-yellow border border-brand-gold/40 rounded-full text-xs font-mono font-semibold mb-6 shadow-xl animate-fade-up">
              Build • Ship • Repeat
            </div>

            {/* Main Header in Goa style format (single line) */}
            <h1 className="sr-only">Hacker House Goa 2026</h1>
            <div className="relative flex items-center justify-center select-none mt-4 mb-4 pb-4 sm:pb-6 md:pb-10 animate-fade-up-delay-1">
              <div className="relative text-left flex flex-col items-start">
                {/* HACKER HOUSE gold serif block (Single Line) */}
                <div className="leading-none font-black text-brand-gold tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                  <div className="text-[32px] min-[400px]:text-[42px] sm:text-[72px] md:text-[96px] uppercase font-black whitespace-nowrap drop-shadow-2xl">Hacker House</div>
                </div>
                
                {/* Devanagari overlapping text "गोवा" */}
                <div 
                  className="absolute left-[38%] top-[24px] min-[400px]:top-[32px] sm:top-[48px] md:top-[58px] text-[36px] min-[400px]:text-[48px] sm:text-[84px] md:text-[112px] font-normal text-brand-pink select-none pointer-events-none transform -rotate-12 active:scale-105 transition-transform" 
                  style={{ fontFamily: "'Yatra One', cursive", textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                >
                  गोवा
                </div>

                {/* GOA 2026 label with divider */}
                <div className="absolute -top-5 right-0 flex items-center gap-1.5">
                  <div className="w-[1.2px] h-3.5 bg-brand-yellow"></div>
                  <div className="text-[8px] sm:text-[10px] font-bold tracking-widest text-brand-yellow uppercase font-mono drop-shadow-md">
                    GOA 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Generator App UI */}
        <section id="generator" aria-label="Frame generator" className="relative z-10 -mt-6 flex justify-center">
          {isSharePage ? <SharePage id={shareId} /> : <FrameGenerator />}
        </section>

      {/* ── Section 2: Builder Manifest ─────────────────────────────────── */}
      <section
        aria-label="Builder Manifest"
        className="w-full flex flex-col"
      >

        {/* Full illustration — sits immediately below the text in normal flow */}
        <div className="w-full relative z-0 rounded-t-[40px] sm:rounded-t-[80px] overflow-hidden min-h-[550px] flex items-center justify-center" style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' }}>
          <img
            src={manifestBg}
            alt="Goa beach illustration"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
          {/* Circular Carousel Overlay */}
          <div className="relative w-full z-10 py-12 flex items-center justify-center pointer-events-auto">
             <CircularCarousel items={carouselItems} />
          </div>
        </div>
      </section>



      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-12 text-center sm:text-left" style={{ backgroundColor: '#F4C400', borderTop: '2px solid #062E22' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-xs font-mono font-bold" style={{ color: '#062E22' }}>// Build in 2026 // Sinpers</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-black" style={{ color: '#E8235A' }}>#FrameInGoa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
