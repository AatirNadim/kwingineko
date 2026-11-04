import { useState, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  Calendar,
  ExternalLink,
  Terminal,
  Hash,
} from 'lucide-react';
import { articles } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const carouselRef = useRef(null);

  const total = articles.length;
  const current = articles[currentIndex];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    // Only advance if horizontal intent dominates vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const currentNumber = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
  const totalNumber = total < 10 ? `0${total}` : `${total}`;
  const hasCover = Boolean(current.cover) && !imageErrors[current.id];

  return (
    <section
      id="writing"
      className="scroll-mt-6 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5"
    >
      <SectionHeading
        index="06 / DISPATCHES & WRITING"
        title="Articles & writing"
        aside={`${totalNumber} ENTRIES // TECHTOM`}
      />

      {/* Main Telemetry & Carousel Container */}
      <div
        ref={carouselRef}
        tabIndex="0"
        role="region"
        aria-roledescription="carousel"
        aria-label="Technical Articles Carousel"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="touch-pan-y focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow"
      >
        {/* Screen Reader Live Region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Slide {currentIndex + 1} of {total}: {current.title}
        </div>
        {/* Top Control Bar */}
        <div className="mb-4 flex flex-col gap-2.5 border border-line bg-surface p-2.5 sm:p-3 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2 font-mono text-[10px] sm:text-[10.5px]">
            <div className="flex items-center gap-2 text-muted">
              <span className="font-mono text-muted font-bold">[LOG]</span>
              <span className="text-ink-secondary">DISPATCH LOG</span>
              <span className="text-muted-dim">//</span>
              <span className="text-lime">● FEED ACTIVE</span>
              <span className="hidden text-muted-dim sm:inline">·</span>
              <a
                href="https://techtom.hashnode.dev/"
                target="_blank"
                rel="noreferrer noopener"
                className="hidden items-center gap-1 text-ink-secondary underline hover:text-lime sm:inline-flex"
              >
                <span>techtom.hashnode.dev</span>
                <ArrowUpRight size={10} />
              </a>
            </div>

            {/* Tactile Carousel Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 font-mono text-[10px] text-muted">
                <span className="text-ink-secondary font-semibold">[{currentNumber}</span>
                <span>/</span>
                <span>{totalNumber}]</span>
              </div>

              <div className="flex items-center gap-1.5 pl-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous article"
                  className="inline-flex min-h-[44px] min-w-[44px] sm:min-h-[34px] sm:min-w-[34px] items-center justify-center border border-line-subtle bg-surface-card font-mono text-[10px] text-ink-secondary transition hover:border-pink hover:bg-focus hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                >
                  <ChevronLeft size={14} className="opacity-80" />
                  <span className="sr-only sm:not-sr-only sm:pr-1">PREV</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next article"
                  className="inline-flex min-h-[44px] min-w-[44px] sm:min-h-[34px] sm:min-w-[34px] items-center justify-center border border-line-subtle bg-surface-card font-mono text-[10px] text-ink-secondary transition hover:border-pink hover:bg-focus hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                >
                  <span className="sr-only sm:not-sr-only sm:pl-1">NEXT</span>
                  <ChevronRight size={14} className="opacity-80" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Hub Note */}
          <div className="flex flex-wrap items-center justify-between gap-1 text-[9.5px] font-mono text-muted">
            <span>USE [← / →] KEYS OR SWIPE TO BROWSE</span>
            <span className="text-muted">TOPIC: {current.category.toUpperCase()}</span>
          </div>
        </div>

        {/* Featured Slide Card */}
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`Article ${currentIndex + 1} of ${total}: ${current.title}`}
          className="border border-line bg-surface p-3.5 sm:p-5 shadow-panel"
        >
          <div className="grid grid-cols-1 gap-5 cq-split-blog">
            
            {/* Visual Well / Thumbnail Column */}
            <div className="flex flex-col gap-2.5">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-line-subtle bg-surface-inset">
                {hasCover ? (
                  <img
                    src={current.cover}
                    alt={current.title}
                    onError={() => handleImageError(current.id)}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col justify-between p-3 font-mono">
                    <div className="flex items-center justify-between text-[9.5px] text-muted">
                      <span className="flex items-center gap-1 text-muted">
                        <Terminal size={11} className="text-muted-dim" />
                        DISPATCH_{currentNumber}
                      </span>
                      <span className="text-muted-dim">RAW_TEXT</span>
                    </div>

                    <div className="my-auto text-center">
                      <div className="font-mono text-[10.5px] tracking-wider text-ink-secondary">
                        [ TECHTOM ARCHIVE ]
                      </div>
                      <div className="mt-1 text-[10px] text-muted">
                        {current.category}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-line-subtle pt-1 text-[9px] text-muted-dim">
                      <span>FORMAT: MD</span>
                      <span>HASHNODE SYNC</span>
                    </div>
                  </div>
                )}
                {/* Monokai corner highlight */}
                <div className="pointer-events-none absolute right-1 top-1 font-mono text-[9.5px] text-muted-dim">
                  #{currentNumber}
                </div>
              </div>

              {/* Quick Card Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-1 border border-line-subtle bg-surface-inset px-2.5 py-1.5 font-mono text-[9.5px]">
                <div className="flex items-center gap-1 text-muted">
                  <Calendar size={11} className="text-muted-dim" />
                  <span>{current.date}</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <Clock size={11} className="text-muted-dim" />
                  <span>{current.readTime}</span>
                </div>
              </div>
            </div>

            {/* Content & Metadata Column */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                  <span className="border border-pink/40 bg-pink/10 px-2 py-0.5 text-pink">
                    {current.category}
                  </span>
                  <span className="text-muted-dim">·</span>
                  <span className="text-muted">POST #{currentNumber}</span>
                </div>

                {/* Article Headline */}
                <h3 className="mt-2.5 font-display text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                  >
                    {current.title}
                  </a>
                </h3>

                {/* Synopsis / Excerpt */}
                <p className="mt-3 text-xs leading-[1.8] text-ink-secondary sm:text-sm">
                  {current.description}
                </p>

                {/* Tags Pill List */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 inline-flex items-center gap-0.5 font-mono text-[9.5px] text-muted">
                    <Hash size={10} className="text-muted-dim" />
                    TAGS:
                  </span>
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-line-subtle bg-surface-card px-2 py-0.5 font-mono text-[9.5px] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line-subtle pt-4">
                <a
                  href={current.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[44px] items-center gap-2 border border-pink bg-pink px-4 py-2.5 font-mono text-[10px] font-semibold text-surface transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f9267270] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow sm:text-[10.5px]"
                >
                  <BookOpen size={13} />
                  <span>READ FULL DISPATCH</span>
                  <ArrowUpRight size={13} />
                </a>

                <a
                  href="https://techtom.hashnode.dev/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[44px] items-center gap-1.5 border border-line-subtle bg-surface-card px-3.5 py-2.5 font-mono text-[9.5px] text-ink-secondary transition hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow sm:text-[10px]"
                >
                  <span>ALL POSTS ON TECHTOM</span>
                  <ExternalLink size={11} className="text-muted-dim" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Scrubber Track */}
        <div className="mt-3.5 border border-line bg-surface p-2 sm:p-2.5">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[9.5px] text-muted">
            <span>INDEX SELECTOR:</span>
            <span>{currentNumber} SELECTED</span>
          </div>

          <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
            {articles.map((art, idx) => {
              const isActive = idx === currentIndex;
              const formattedIdx = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Jump to article ${formattedIdx}: ${art.title}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`inline-flex min-h-[44px] sm:min-h-[32px] flex-col items-center justify-center border px-1 py-1 font-mono text-[10px] transition ${
                    isActive
                      ? 'border-pink bg-focus text-ink shadow-[2px_2px_0_#f9267240]'
                      : 'border-line-subtle bg-surface-card text-muted-dim hover:border-line hover:bg-focus hover:text-ink'
                  }`}
                >
                  <span className={isActive ? 'text-pink font-bold' : 'text-muted-dim'}>
                    {isActive ? `● ${formattedIdx}` : formattedIdx}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
