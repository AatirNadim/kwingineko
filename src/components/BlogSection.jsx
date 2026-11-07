import { useState, useRef, useCallback, useEffect } from 'react';
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
  RefreshCw,
  AlertTriangle,
  Eye,
  Heart,
  Radio,
} from 'lucide-react';
import { fallbackArticles } from '../data/portfolio.js';
import {
  fetchHashnodeRSS,
  DEFAULT_FEED_URL,
  DEFAULT_HOST,
} from '../services/hashnode.js';
import SectionHeading from './SectionHeading.jsx';

export default function BlogSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const carouselRef = useRef(null);

  const loadArticles = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHashnodeRSS({ url: DEFAULT_FEED_URL, forceRefresh: force });
      setArticles(data);
      setIsFallback(false);
      setCurrentIndex((prev) => (prev < data.length ? prev : 0));
    } catch (err) {
      console.warn('[Hashnode RSS Error]:', err);
      setError(err?.message || 'Failed to establish connection with techtom.hashnode.dev/rss.xml');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles(false);
  }, [loadArticles]);

  const handleRetry = () => {
    loadArticles(true);
  };

  const handleUseFallback = () => {
    setArticles(fallbackArticles);
    setIsFallback(true);
    setError(null);
    setCurrentIndex(0);
  };

  const total = articles.length;
  const current = articles[currentIndex] || articles[0];

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
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

  const currentNumber =
    currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
  const totalNumber = total < 10 ? `0${total}` : `${total}`;
  const hasCover = Boolean(current?.cover) && !imageErrors[current?.id];

  return (
    <section
      id="writing"
      className="scroll-mt-6 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5"
    >
      <SectionHeading
        index="05 / DISPATCHES & WRITING"
        title="Articles & writing"
        aside={
          loading
            ? 'SYNCING // techtom.hashnode.dev/rss.xml'
            : isFallback
            ? `${totalNumber} ENTRIES // OFFLINE ARCHIVE`
            : `${totalNumber} DISPATCHES // TECHTOM RSS LIVE`
        }
      />

      {/* =========================================================================
          STATE 1: LOADING SKELETON (Retro Monokai Terminal Telemetry)
          ========================================================================= */}
      {loading && (
        <div
          role="region"
          aria-busy="true"
          aria-label="Loading Hashnode Dispatches"
          className="animate-pulse"
        >
          <div className="sr-only" aria-live="polite">
            Fetching RSS feed from techtom.hashnode.dev/rss.xml...
          </div>

          {/* Top Control Bar Skeleton */}
          <div className="mb-4 flex flex-col gap-2.5 border border-line bg-surface p-2.5 sm:p-3 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2 font-mono text-[10px] sm:text-[10.5px]">
              <div className="flex flex-wrap items-center gap-2 text-muted">
                <span className="font-mono font-bold text-muted">[LOG]</span>
                <span className="text-ink-secondary">RSS_INIT</span>
                <span className="text-muted-dim">//</span>
                <span className="inline-flex items-center gap-1.5 text-yellow">
                  <RefreshCw size={11} className="animate-spin text-yellow" />
                  [STATUS: SYNCING RSS // techtom.hashnode.dev/rss.xml]
                </span>
              </div>
              <div className="font-mono text-[9.5px] text-muted-dim">
                SYNCHRONIZING FEED...
              </div>
            </div>
            <div className="flex items-center justify-between text-[9.5px] font-mono text-muted-dim">
              <span>SCANNING XML CHANNEL DISPATCHES &amp; ENCLOSURES</span>
              <span className="text-muted-dim">[BUFF: RSS 2.0]</span>
            </div>
          </div>

          {/* Slide Card Skeleton */}
          <div className="border border-line bg-surface p-3.5 sm:p-5 shadow-panel">
            <div className="grid grid-cols-1 gap-5 cq-split-blog">
              {/* Visual Well Skeleton */}
              <div className="flex flex-col gap-2.5">
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-line-subtle bg-surface-inset flex flex-col items-center justify-center p-4">
                  <Terminal size={22} className="text-muted-dim/40 mb-2" />
                  <div className="font-mono text-[10px] tracking-wider text-muted-dim">
                    [ STREAMING COVER BUFFER ]
                  </div>
                  <div className="mt-2.5 h-1.5 w-32 overflow-hidden border border-line-subtle bg-surface-well">
                    <div className="h-full w-2/3 bg-pink/40 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between border border-line-subtle bg-surface-inset px-2.5 py-1.5">
                  <div className="h-3 w-20 bg-surface-well" />
                  <div className="h-3 w-16 bg-surface-well" />
                </div>
              </div>

              {/* Text & Content Column Skeleton */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-28 border border-line-subtle bg-surface-card" />
                    <span className="text-muted-dim">·</span>
                    <div className="h-4 w-20 bg-surface-well" />
                  </div>
                  <div className="mt-3.5 h-6 w-5/6 bg-surface-card" />
                  <div className="mt-2 h-4 w-1/2 bg-surface-well" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full bg-surface-card" />
                    <div className="h-3 w-11/12 bg-surface-card" />
                    <div className="h-3 w-4/5 bg-surface-well" />
                  </div>
                  <div className="mt-5 flex gap-1.5">
                    <div className="h-4 w-16 bg-surface-card" />
                    <div className="h-4 w-20 bg-surface-card" />
                    <div className="h-4 w-16 bg-surface-card" />
                  </div>
                </div>

                <div className="mt-6 flex gap-3 border-t border-line-subtle pt-4">
                  <div className="h-10 w-44 border border-line-subtle bg-surface-card" />
                  <div className="h-10 w-36 border border-line-subtle bg-surface-card" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrubber Skeleton */}
          <div className="mt-3.5 border border-line bg-surface p-2 sm:p-2.5">
            <div className="mb-1.5 flex items-center justify-between font-mono text-[9.5px] text-muted-dim">
              <span>INDEX SELECTOR:</span>
              <span>SYNCHRONIZING SLOTS...</span>
            </div>
            <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="min-h-[44px] sm:min-h-[32px] border border-line-subtle bg-surface-card"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STATE 2: ERROR DIAGNOSTIC PANEL (Retro Monokai Recovery Workbench)
          ========================================================================= */}
      {!loading && error && articles.length === 0 && (
        <div
          role="alert"
          aria-label="RSS Feed Fetch Interrupted"
          className="border border-pink/50 bg-surface p-3.5 sm:p-5 shadow-panel"
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="border border-pink bg-pink/20 px-2 py-0.5 font-mono text-[10px] font-bold text-pink">
                [STATUS: RSS_SYNC_FAILED]
              </span>
              <span className="font-mono text-muted-dim">//</span>
              <span className="font-mono text-[11px] font-semibold text-ink">
                FEED CONNECTION INTERRUPTED
              </span>
            </div>
            <span className="font-mono text-[9.5px] text-muted-dim">
              FEED: techtom.hashnode.dev/rss.xml
            </span>
          </div>

          {/* Diagnostic Console Box */}
          <div className="mt-3.5 border border-line-subtle bg-surface-inset p-3 sm:p-4 font-mono">
            <div className="flex items-center justify-between border-b border-line-subtle pb-2 text-[10px] text-muted">
              <div className="flex items-center gap-1.5 text-pink">
                <AlertTriangle size={13} />
                <span className="font-semibold">DIAGNOSTIC TELEMETRY</span>
              </div>
              <span className="text-muted-dim">HOST: {DEFAULT_HOST}</span>
            </div>

            <div className="pt-3 text-[11px] sm:text-xs text-pink/90 leading-relaxed font-mono">
              <span className="text-muted-dim select-none">&gt;&nbsp;</span>
              {error}
            </div>

            <p className="mt-3 text-[11px] text-muted leading-relaxed font-sans">
              The live RSS feed from <code className="text-lime font-mono">techtom.hashnode.dev/rss.xml</code> could not be reached from your current network session. You can retry the synchronization handshake or load the pre-cached offline archive.
            </p>
          </div>

          {/* Actionable Recovery Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line-subtle pt-3.5">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex min-h-[44px] items-center gap-2 border border-pink bg-pink px-4 py-2 font-mono text-[10.5px] font-semibold text-surface transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f9267270] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <RefreshCw size={13} />
              <span>RETRY SYNC</span>
            </button>

            <button
              type="button"
              onClick={handleUseFallback}
              className="inline-flex min-h-[44px] items-center gap-2 border border-yellow bg-yellow/10 px-4 py-2 font-mono text-[10.5px] font-semibold text-yellow transition hover:bg-yellow hover:text-surface hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#e6db7470] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <BookOpen size={13} />
              <span>LOAD OFFLINE ARCHIVE ({fallbackArticles.length} POSTS)</span>
            </button>

            <a
              href={`https://${DEFAULT_HOST}/`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-[44px] items-center gap-1.5 border border-line-subtle bg-surface-card px-3.5 py-2 font-mono text-[10px] text-ink-secondary transition hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <span>OPEN TECHTOM ON HASHNODE</span>
              <ExternalLink size={11} className="text-muted-dim" />
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          STATE 3: LOADED ARTICLES CAROUSEL & INTERACTIVE VIEWER
          ========================================================================= */}
      {!loading && current && (
        <div
          ref={carouselRef}
          tabIndex={0}
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
              <div className="flex flex-wrap items-center gap-2 text-muted">
                <span className="font-mono text-muted font-bold">[LOG]</span>
                <span className="text-ink-secondary">DISPATCH LOG</span>
                <span className="text-muted-dim">//</span>
                {isFallback ? (
                  <span className="inline-flex items-center gap-1 text-yellow">
                    <span>● OFFLINE ARCHIVE</span>
                    <span className="text-muted-dim">({total} CACHED)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-lime">
                    <Radio size={11} className="text-lime animate-pulse" />
                    <span>● LIVE RSS FEED</span>
                  </span>
                )}
                <span className="hidden text-muted-dim sm:inline">·</span>
                <a
                  href={`https://${DEFAULT_HOST}/`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hidden items-center gap-1 text-ink-secondary underline hover:text-lime sm:inline-flex"
                >
                  <span>{DEFAULT_HOST}</span>
                  <ArrowUpRight size={10} />
                </a>

                {isFallback && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1 border border-pink/40 bg-pink/10 px-1.5 py-0.5 text-[9px] text-pink hover:bg-pink hover:text-surface transition"
                    title="Retry live Hashnode RSS fetch"
                  >
                    <RefreshCw size={9} />
                    <span>SYNC LIVE</span>
                  </button>
                )}
              </div>

              {/* Tactile Carousel Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 font-mono text-[10px] text-muted">
                  <span className="text-ink-secondary font-semibold">
                    [{currentNumber}
                  </span>
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
              <span className="text-muted">
                TOPIC: {(current.category || 'SYSTEMS').toUpperCase()}
              </span>
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
              {/* Visual Well / Thumbnail Column (Clickable to article URL) */}
              <div className="flex flex-col gap-2.5">
                <a
                  href={current.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Read article: ${current.title}`}
                  className="group/thumb relative block aspect-[16/10] w-full overflow-hidden border border-line-subtle bg-surface-inset transition hover:border-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                >
                  {hasCover ? (
                    <img
                      src={current.cover}
                      alt={current.title}
                      onError={() => handleImageError(current.id)}
                      className="h-full w-full object-cover transition duration-300 group-hover/thumb:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col justify-between p-3 font-mono transition group-hover/thumb:bg-surface-well/50">
                      <div className="flex items-center justify-between text-[9.5px] text-muted">
                        <span className="flex items-center gap-1 text-muted">
                          <Terminal size={11} className="text-muted-dim" />
                          DISPATCH_{currentNumber}
                        </span>
                        <span className="text-muted-dim">RAW_TEXT</span>
                      </div>

                      <div className="my-auto text-center">
                        <div className="font-mono text-[10.5px] tracking-wider text-ink-secondary group-hover/thumb:text-lime">
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

                  {/* Corner indicator linking to article */}
                  <div className="absolute right-1 top-1 flex items-center gap-1 border border-line-subtle bg-canvas/90 px-1.5 py-0.5 font-mono text-[9.5px] text-muted transition group-hover/thumb:border-pink group-hover/thumb:text-pink">
                    <span>#{currentNumber}</span>
                    <ArrowUpRight size={10} />
                  </div>

                  {/* Subtle hover overlay prompt */}
                  <div className="pointer-events-none absolute bottom-1 right-1 opacity-0 transition group-hover/thumb:opacity-100 border border-lime/60 bg-canvas/95 px-1.5 py-0.5 font-mono text-[8.5px] text-lime">
                    OPEN DISPATCH ↗
                  </div>
                </a>

                {/* Quick Card Telemetry (Date, Read Time, Views, Reactions) */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border border-line-subtle bg-surface-inset px-2.5 py-1.5 font-mono text-[9.5px]">
                  <div className="flex items-center gap-2 text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-muted-dim" />
                      <span>{current.date}</span>
                    </div>
                    <span className="text-muted-dim">·</span>
                    <div className="flex items-center gap-1">
                      <Clock size={11} className="text-muted-dim" />
                      <span>{current.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted">
                    {current.views > 0 && (
                      <div
                        className="flex items-center gap-1 text-muted"
                        title={`${current.views.toLocaleString()} total views`}
                      >
                        <Eye size={11} className="text-muted-dim" />
                        <span>{current.views.toLocaleString()}</span>
                      </div>
                    )}
                    {current.reactionCount > 0 && (
                      <div
                        className="flex items-center gap-1 text-muted"
                        title={`${current.reactionCount} reactions`}
                      >
                        <Heart size={11} className="text-pink/70" />
                        <span>{current.reactionCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content & Metadata Column */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* Category & Post Index with Direct Article Link */}
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="border border-pink/40 bg-pink/10 px-2 py-0.5 text-pink">
                        {current.category}
                      </span>
                      <span className="text-muted-dim">·</span>
                      <span className="text-muted">POST #{currentNumber}</span>
                    </div>

                    <a
                      href={current.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-[32px] items-center gap-1 font-mono text-[10px] text-muted transition hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                    >
                      <span>VISIT POST</span>
                      <ArrowUpRight size={11} className="text-pink" />
                    </a>
                  </div>

                  {/* Article Headline (Linked) */}
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

                  {/* Subtitle (Rendered clearly beneath the title when present) */}
                  {current.subtitle && (
                    <p className="mt-1 line-clamp-2 font-mono text-xs leading-relaxed text-yellow/90 sm:text-[12.5px]">
                      {current.subtitle}
                    </p>
                  )}

                  {/* Synopsis / Excerpt */}
                  <p className="mt-2.5 text-xs leading-[1.8] text-ink-secondary sm:text-sm">
                    {current.description}
                  </p>

                  {/* Tags Pill List */}
                  {Array.isArray(current.tags) && current.tags.length > 0 && (
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
                  )}
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
                    href={`https://${DEFAULT_HOST}/`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-[44px] items-center gap-1.5 border border-line-subtle bg-surface-card px-3.5 py-2.5 font-mono text-[9.5px] text-ink-secondary transition hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow sm:text-[10px]"
                  >
                    <span>ALL POSTS ON TECHTOM</span>
                    <ExternalLink size={11} className="text-muted-dim" />
                  </a>

                  {isFallback && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex min-h-[44px] items-center gap-1.5 border border-line-subtle bg-surface-card px-3 py-2.5 font-mono text-[9.5px] text-yellow transition hover:border-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                    >
                      <RefreshCw size={11} />
                      <span>RELOAD LIVE FEED</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pagination Scrubber Track (Dynamic grid matching articles.length) */}
          <div className="mt-3.5 border border-line bg-surface p-2 sm:p-2.5">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1 font-mono text-[9.5px] subpixel-antialiased text-muted">
              <span>INDEX SELECTOR:</span>
              <span
                className="truncate max-w-[280px] sm:max-w-md"
                title={current.title}
              >
                [{currentNumber} / {totalNumber}] · {current.title}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
              {articles.map((art, idx) => {
                const isActive = idx === currentIndex;
                const formattedIdx =
                  idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
                return (
                  <button
                    key={art.id || art.slug || idx}
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
                    <span
                      className={
                        isActive ? 'text-pink font-bold' : 'text-muted-dim'
                      }
                    >
                      {isActive ? `● ${formattedIdx}` : formattedIdx}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
