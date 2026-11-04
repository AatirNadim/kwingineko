import { useState } from 'react';
import { ArrowUpRight, Award, CheckCircle2, Filter } from 'lucide-react';
import { certificates } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function CertificatesSection() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Systems & Algorithms', 'Applied Math & ML', 'Cloud Infrastructure'];

  const filteredCertificates = selectedCategory === 'ALL'
    ? certificates
    : certificates.filter((cert) => cert.category === selectedCategory);

  return (
    <section id="certificates" className="scroll-mt-6 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading
        index="05 / VERIFIED CREDENTIALS"
        title="Certificates"
        aside={`0${certificates.length} ACCREDITATIONS`}
      />

      {/* Telemetry Control Bar */}
      <div className="mb-4 flex flex-col gap-2.5 border border-line bg-surface p-2.5 sm:p-3 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2 font-mono text-[10px] sm:text-[10.5px]">
          <div className="flex items-center gap-2 text-muted">
            <span className="font-mono text-yellow font-bold">[LEDGER]</span>
            <span className="text-ink-secondary">ACCREDITATION LEDGER</span>
            <span className="text-muted-dim">//</span>
            <span className="text-lime">STATUS: ALL RECORDS VERIFIED</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[9.5px] text-muted">
            <span>REGISTRIES:</span>
            <span className="text-yellow">COURSERA</span>
            <span className="text-muted-dim">·</span>
            <span className="text-lime">GOOGLE CLOUD</span>
          </div>
        </div>

        {/* Filter Pills with touch targets >= 44px */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="mr-1 hidden items-center gap-1 font-mono text-[10px] text-muted sm:inline-flex">
            <span className="font-mono text-violet font-semibold">[FILTER]</span>
          </span>
          {categories.map((cat) => {
            const count = cat === 'ALL'
              ? certificates.length
              : certificates.filter((c) => c.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex min-h-[44px] sm:min-h-[32px] items-center gap-1.5 border px-2.5 py-1.5 sm:py-1 font-mono text-[10px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                  isActive
                    ? 'border-pink bg-focus text-ink shadow-[2px_2px_0_#f9267240]'
                    : 'border-line-subtle bg-surface-card text-muted hover:border-line hover:bg-focus hover:text-ink'
                }`}
              >
                <span className={isActive ? 'text-pink' : 'text-violet'}>
                  {isActive ? '●' : '○'}
                </span>
                <span>{cat.toUpperCase()}</span>
                <span className={`text-[9.5px] ${isActive ? 'text-ink-secondary' : 'text-muted-dim'}`}>
                  [{count < 10 ? `0${count}` : count}]
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Certificates Grid / Ledger */}
      <div className="grid gap-3.5">
        {filteredCertificates.map((cert, index) => {
          const globalIndex = certificates.findIndex((c) => c.id === cert.id) + 1;
          const formattedNumber = globalIndex < 10 ? `0${globalIndex}` : globalIndex;

          return (
            <article
              key={cert.id}
              className="group relative border border-line bg-surface-card p-3.5 shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-line sm:p-4"
            >
              {/* Header Telemetry Strip */}
              <div className="flex flex-wrap items-center gap-2 border-b border-line-subtle pb-2 text-muted">
                <span className="font-mono text-[10.5px] font-bold text-pink">{formattedNumber}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-violet">
                  {cert.id}
                </span>
                <span className="text-muted-dim">//</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {cert.category}
                </span>

                <div className="ml-auto flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[9.5px] text-lime">
                    <CheckCircle2 size={11} className="text-lime" />
                    <span>{cert.status.toUpperCase()}</span>
                  </span>
                  <span className="border border-line bg-surface px-1.5 py-0.5 font-mono text-[9.5px] text-yellow">
                    {cert.date}
                  </span>
                </div>
              </div>

              {/* Title & Organization */}
              <div className="mt-2.5">
                <h3 className="font-display text-sm font-semibold tracking-tight text-ink sm:text-base">
                  {cert.title}
                </h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-muted">
                  <span className="text-lime">{cert.issuer}</span>
                  <span className="text-muted-dim">·</span>
                  <span className="text-ink-secondary">{cert.platform}</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-2 mb-0 text-xs leading-relaxed text-ink-secondary">
                {cert.description}
              </p>

              {/* Tags & Action Bar */}
              <div className="mt-3 flex flex-col gap-2.5 border-t border-line-subtle pt-2.5 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
                {/* Topic Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-line-subtle bg-surface-inset px-1.5 py-0.5 font-mono text-[9.5px] text-ink-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Verification CTA with accessible tap target */}
                <div className="flex items-center justify-between gap-3 min-[520px]:justify-end">
                  <span className="font-mono text-[9.5px] text-muted truncate max-w-[150px] sm:max-w-none">
                    ID: {cert.credentialId}
                  </span>
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${cert.title} credential on ${cert.platform}`}
                    className="inline-flex min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-0 items-center justify-center gap-1 border border-line bg-surface px-3 py-1 font-mono text-[10px] font-medium text-yellow transition-colors hover:border-yellow hover:bg-focus hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                  >
                    <span>VERIFY</span>
                    <ArrowUpRight size={13} className="text-yellow" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer System Annotation */}
      <div className="mt-4 flex flex-col gap-1.5 border-t border-dashed border-line pt-3 font-mono text-[9.5px] text-muted sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="text-violet">►</span>
          <span>Includes verified coursework and public skill profiles directly verifiable through issuer signatures.</span>
        </div>
        <span className="text-muted-dim">TELEMETRY // ID-HASH VERIFIED</span>
      </div>
    </section>
  );
}
