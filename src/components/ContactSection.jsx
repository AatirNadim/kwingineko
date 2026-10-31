import { useState } from 'react';
import { Mail, Copy, Check, Send } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import { contact } from '../data/portfolio.js';

export default function ContactSection({ onOpenComposer }) {
  const [copied, setCopied] = useState(false);

  const handleCopyDirect = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="contact" className="scroll-mt-4 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="07 / TRANSMISSION" title="Get in touch" aside="CHANNEL // DIRECT" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        
        {/* Main Transmission Card */}
        <div className="border border-line bg-surface p-3.5 sm:p-5 shadow-panel">
          <div className="flex items-center justify-between border-b border-[#35362e] pb-2.5 font-mono text-[9px] text-muted">
            <span className="flex items-center gap-1.5 text-pink">
              <Mail size={13} /> new_message.eml
            </span>
            <span className="text-lime">STATUS: OPEN</span>
          </div>

          <p className="mt-3.5 text-xs leading-[1.8] text-[#d6d4c5] sm:text-sm">
            {contact.note}
          </p>

          {/* Quick Direct Email Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border border-[#3c3d35] bg-[#171815] p-2.5">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-[8.5px] text-muted sm:text-[9px]">DESTINATION:</span>
              <a
                href={`mailto:${contact.email}`}
                className="break-all font-mono text-xs font-semibold text-yellow underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              >
                {contact.email}
              </a>
            </div>
            <button
              onClick={handleCopyDirect}
              aria-label="Copy email address"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border border-[#48493e] bg-surface px-3 py-2 font-mono text-[8.5px] sm:text-[8px] text-[#cbc9b9] transition-colors hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow sm:ml-auto"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-lime" />
                  <span className="text-lime">COPIED</span>
                </>
              ) : (
                <>
                  <Copy size={12} className="text-yellow" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Composer Trigger Button */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenComposer}
              className="inline-flex min-h-[44px] items-center gap-2 border border-pink bg-pink px-3.5 py-2.5 font-mono text-[9px] tracking-wide text-surface font-semibold transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f9267270] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow sm:text-[10px]"
            >
              <Send size={13} />
              <span>OPEN COMPOSER & TEMPLATES</span>
              <span className="ml-1 border-l border-surface/30 pl-1.5 text-[8px] text-surface/85">PRESET MODAL</span>
            </button>

            <span className="font-mono text-[8px] leading-[1.7] text-[#939180] sm:text-[9px]">
              Preset topics · avatar stamps · auto-budgeted mailto link
            </span>
          </div>
        </div>

        {/* Telemetry & Inbox Metadata Card */}
        <div className="flex flex-col justify-between border border-line bg-[#1e1f1c] p-3.5 sm:p-5 shadow-panel">
          <div>
            <div className="flex items-center justify-between border-b border-[#35362e] pb-2 font-mono text-[9px] tracking-wider text-violet">
              <span>TELEMETRY // LOG</span>
              <span className="text-lime">● ACTIVE</span>
            </div>

            <div className="mt-3 space-y-2.5 font-mono text-[9px]">
              <div className="flex justify-between border-b border-[#2d2e27] pb-1.5">
                <span className="text-muted">RESPONSE CADENCE:</span>
                <span className="text-yellow">{contact.responseWindow}</span>
              </div>
              <div className="flex justify-between border-b border-[#2d2e27] pb-1.5">
                <span className="text-muted">LOCAL TIMEZONE:</span>
                <span className="text-ink">{contact.location}</span>
              </div>
              <div className="flex justify-between border-b border-[#2d2e27] pb-1.5">
                <span className="text-muted">ENCRYPTION / PROTOCOL:</span>
                <span className="text-lime">TLS / RFC 6068</span>
              </div>
              <div className="flex justify-between border-b border-[#2d2e27] pb-1.5">
                <span className="text-muted">URL CHAR LIMIT:</span>
                <span className="text-pink">1,800 SAFE BYTES</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-l-2 border-yellow bg-[#161714] p-2.5">
            <span className="block font-mono text-[8px] uppercase tracking-wider text-yellow">
              TRANSMISSION TIP
            </span>
            <p className="mt-1 m-0 text-[10px] leading-relaxed text-[#c7c5b7]">
              Whether proposing an infrastructure challenge, discussing distributed storage, or just saying hello—clear context is always welcome.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
