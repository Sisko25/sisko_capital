'use client';

import React, { useState, useEffect } from 'react';

const PLATFORMS = [
  'SA-1 "Vanguard" Tactical Micro-UAV',
  'A.V.I.A.R.S. Onboard Edge AI License',
  'Full-Stack Autonomous ISR & Strike',
  'Strategic / Defense Partnership',
] as const;

const DOMAINS = [
  'Land // Urban Tactical',
  'Air // Counter-UAS Intercept',
  'Naval // Strait Overwatch',
  'Multi-Domain Command',
] as const;

const TIMELINES = [
  'Immediate Technical Evaluation',
  'Q2–Q4 2026 Procurement Cycle',
  'Joint R&D / Sovereign Integration',
] as const;

export function openProcurementModal(presetSubject?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('sisko:open-procurement', {
        detail: { subject: presetSubject || '' },
      })
    );
  }
}

export default function ProcurementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [domain, setDomain] = useState<string>(DOMAINS[3]);
  const [timeline, setTimeline] = useState<string>(TIMELINES[0]);
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Intercept any click on mailto:sisko@duck.com links across the entire site
  // and listen for custom 'sisko:open-procurement' events
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvt = e as CustomEvent<{ subject?: string }>;
      const subj = (customEvt.detail?.subject || '').toLowerCase();
      if (subj.includes('vanguard') || subj.includes('sa-1')) {
        setPlatform(PLATFORMS[0]);
      } else if (subj.includes('aviars')) {
        setPlatform(PLATFORMS[1]);
      } else if (subj.includes('singapore')) {
        setPlatform(PLATFORMS[2]);
        setDomain(DOMAINS[2]);
      }
      setSubmittedRef(null);
      setIsOpen(true);
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a[href^="mailto:sisko@duck.com"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      // Allow explicit direct mailto fallback button inside the modal itself
      if (anchor.dataset.directMailto === 'true') return;

      e.preventDefault();
      const href = anchor.getAttribute('href') || '';
      const subjectMatch = href.match(/subject=([^&]*)/i);
      const decodedSubject = subjectMatch ? decodeURIComponent(subjectMatch[1]) : '';
      openProcurementModal(decodedSubject);
    };

    window.addEventListener('sisko:open-procurement', handleCustomOpen);
    document.addEventListener('click', handleDocumentClick);
    return () => {
      window.removeEventListener('sisko:open-procurement', handleCustomOpen);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Lock body scroll while modal is open & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const dossierSummary = [
    `SISKO AEROSPACE LLP // PROCUREMENT & BRIEFING DOSSIER`,
    `Reference ID: ${submittedRef || 'PENDING'}`,
    `Program: ${platform}`,
    `Operational Domain: ${domain}`,
    `Timeline: ${timeline}`,
    `Contact: ${fullName || 'N/A'} (${email || 'N/A'})`,
    `Organization / Agency: ${organization || 'N/A'}`,
    `Operational Notes: ${notes || 'Standard technical briefing & live telemetry demonstration requested.'}`,
  ].join('\n');

  const mailtoUrl = `mailto:sisko@duck.com?subject=${encodeURIComponent(
    `[${submittedRef || 'BRIEFING'}] ${platform} — ${organization || fullName}`
  )}&body=${encodeURIComponent(dossierSummary)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setSubmittedRef(`SA-PROC-2026-${randomCode}`);
    setCopied(false);
  };

  const handleCopyDossier = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(dossierSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="procurement-modal-title"
    >
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0B0E14] border border-white/15 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] text-white p-5 sm:p-8">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 px-3 py-1 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ff41] font-bold">
                AUTHORIZED DEFENSE &amp; ENTERPRISE PORTAL
              </span>
            </div>
            <h2
              id="procurement-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
            >
              Request Technical Briefing &amp; Procurement Dossier
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-1">
              Direct sovereign channel to Sisko Aerospace LLP engineering and institutional defense
              teams in Singapore.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="shrink-0 w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/65 hover:text-white hover:border-white/30 transition"
            aria-label="Close procurement modal"
          >
            ✕
          </button>
        </div>

        {!submittedRef ? (
          <form onSubmit={handleSubmit} className="space-y-5 pt-5">
            {/* Program / Platform Selection */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-2">
                01 // Select Program or Platform
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PLATFORMS.map((item) => {
                  const active = platform === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPlatform(item)}
                      className={`text-left rounded-xl px-3.5 py-2.5 text-xs font-mono border transition-all ${
                        active
                          ? 'bg-[#00ff41]/15 border-[#00ff41] text-[#00ff41] font-bold'
                          : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Mission Domain */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-2">
                02 // Target Operational Domain
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DOMAINS.map((dom) => {
                  const active = domain === dom;
                  return (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => setDomain(dom)}
                      className={`rounded-xl px-2.5 py-2 text-[11px] font-mono border text-center transition-all ${
                        active
                          ? 'bg-sky-400/15 border-sky-400 text-sky-300 font-bold'
                          : 'bg-white/[0.02] border-white/10 text-white/65 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {dom}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact & Organization Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Full Name &amp; Title / Rank *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., COL Tan Wei Ming / Director of ISR"
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff41]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Organization / Defense Agency *
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g., MINDEF / ST Engineering / Institutional"
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff41]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.gov.sg"
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff41]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Deployment / Evaluation Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00ff41]"
                >
                  {TIMELINES.map((t) => (
                    <option key={t} value={t} className="bg-[#0B0E14] text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Operational Notes */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Mission Scope &amp; Technical Requirements (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify airframe quantity, sensor payload customization, air-gapped integration, or live demonstration preferences..."
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff41]"
              />
            </div>

            {/* Submit Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
              <p className="text-[11px] font-mono text-white/45">
                🔒 Sovereign Air-Gapped Handling • Singapore Jurisdiction
              </p>
              <button
                type="submit"
                className="rounded-xl bg-[#00ff41] hover:bg-white text-black font-bold uppercase tracking-wider text-xs px-6 py-3.5 transition-all shadow-[0_0_24px_rgba(0,255,65,0.35)]"
              >
                Generate Briefing Dossier →
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation & Dispatch View */
          <div className="space-y-5 pt-6">
            <div className="bg-[#00ff41]/10 border border-[#00ff41]/40 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00ff41] font-bold">
                  ✓ BRIEFING DOSSIER GENERATED
                </span>
                <span className="text-xs font-mono text-white font-bold bg-black/50 px-2.5 py-1 rounded border border-white/10">
                  {submittedRef}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Your procurement briefing dossier has been formatted for Sisko Aerospace LLP&apos;s
                defense intake desk (<span className="text-white font-mono">sisko@duck.com</span>).
                Transmit directly below or copy your dossier reference.
              </p>
            </div>

            <pre className="bg-black/75 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-white/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {dossierSummary}
            </pre>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyDossier}
                className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono uppercase tracking-wider px-5 py-3.5 transition"
              >
                {copied ? '✓ Dossier Copied to Clipboard' : 'Copy Dossier Summary'}
              </button>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="rounded-xl border border-white/15 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider px-4 py-3.5 transition"
                >
                  Edit Details
                </button>
                <a
                  href={mailtoUrl}
                  data-direct-mailto="true"
                  className="text-center rounded-xl bg-[#00ff41] hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-3.5 transition shadow-[0_0_24px_rgba(0,255,65,0.35)]"
                >
                  Dispatch to sisko@duck.com →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
