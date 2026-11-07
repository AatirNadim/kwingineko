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
  Layout,
  LayoutGrid,
  Maximize2,
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
  const [viewMode, setViewMode] = useState('featured'); // 'featured' | 'grid'
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  const carouselRef = useRef(null);
  const activeItemRef = useRef(null);
  const slidingRailRef = useRef(null);

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
    if (viewMode !== 'featured') return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (e) => {
    if (viewMode !== 'featured') return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (viewMode !== 'featured') return;
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

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Preload adjacent covers so cycling through the carousel feels instantaneous
  useEffect(() => {
    if (!articles || articles.length === 0) return;
    const nextIdx = (currentIndex + 1) % articles.length;
    const prevIdx = (currentIndex - 1 + articles.length) % articles.length;
    [articles[nextIdx], articles[prevIdx]].forEach((art) => {
      if (art?.cover && !loadedImages[art.id] && typeof Image !== 'undefined') {
        const img = new Image();
        img.src = art.cover;
        img.onload = () => {
          setLoadedImages((prev) => ({ ...prev, [art.id]: true }));
        };
      }
    });
  }, [currentIndex, articles, loadedImages]);

  // Keep the active item centered in the single sliding rail
  useEffect(() => {
    if (activeItemRef.current && slidingRailRef.current && viewMode === 'featured') {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex, viewMode]);

  const currentNumber =
    currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
  const totalNumber = total < 10 ? `0${total}` : `${total}`;
  const hasCover = Boolean(current?.cover) && !imageErrors[current?.id];
  const isCoverLoaded = Boolean(current?.id && loadedImages[current.id]);

  const handleSwitchToHero = (idx) => {
    setCurrentIndex(idx);
    setViewMode('featured');
    // Scroll smoothly to carousel container for immediate user focus
    if (carouselRef.current) {
      carouselRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

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
                  <span>[STATUS: SYNCING RSS // techtom.hashnode.dev/rss.xml]</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 border border-line-subtle bg-surface-card" />
                <div className="h-6 w-24 border border-line-subtle bg-surface-card" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[9.5px] font-mono text-muted-dim">
              <span>SCANNING XML CHANNEL DISPATCHES &amp; ENCLOSURES</span>
              <span className="text-muted-dim">[BUFF: RSS 2.0]</span>
            </div>
          </div>

          {/* Expansive Banner Skeleton (Zero Gap) */}
          <div className="border border-line bg-surface p-3.5 sm:p-5 shadow-panel">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden border border-line-subtle bg-surface-inset flex flex-col items-center justify-center p-4">
              <Terminal size={24} className="text-muted-dim/40 mb-2" />
              <div className="font-mono text-[10px] sm:text-[11px] tracking-wider text-muted-dim">
                [ STREAMING HIGH-FIDELITY COVER BUFFER ]
              </div>
              <div className="mt-3 h-1.5 w-40 overflow-hidden border border-line-subtle bg-surface-well">
                <div className="h-full w-2/3 bg-pink/40 animate-pulse" />
              </div>
            </div>

            {/* Zero-Gap Telemetry Strip Skeleton */}
            <div className="flex items-center justify-between border-x border-b border-line-subtle bg-surface-inset px-3 py-2">
              <div className="flex gap-2">
                <div className="h-3 w-24 bg-surface-well" />
                <div className="h-3 w-20 bg-surface-well" />
              </div>
              <div className="h-3 w-28 bg-surface-well" />
            </div>

            {/* Text & Content Column Skeleton */}
            <div className="mt-4 sm:mt-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 border border-line-subtle bg-surface-card" />
                <span className="text-muted-dim">·</span>
                <div className="h-4 w-20 bg-surface-well" />
              </div>
              <div className="h-7 w-4/5 bg-surface-card" />
              <div className="h-4 w-1/2 bg-surface-well" />
              <div className="space-y-2 pt-1">
                <div className="h-3 w-full bg-surface-card" />
                <div className="h-3 w-11/12 bg-surface-card" />
                <div className="h-3 w-3/4 bg-surface-well" />
              </div>
              <div className="pt-2 flex gap-1.5">
                <div className="h-4 w-16 bg-surface-card" />
                <div className="h-4 w-20 bg-surface-card" />
                <div className="h-4 w-16 bg-surface-card" />
              </div>
              <div className="flex gap-3 border-t border-line-subtle pt-4">
                <div className="h-10 w-44 border border-line-subtle bg-surface-card" />
                <div className="h-10 w-36 border border-line-subtle bg-surface-card" />
              </div>
            </div>
          </div>

          {/* Single Sliding File Rail Skeleton */}
          <div className="mt-3.5 border border-line bg-surface p-2.5 sm:p-3">
            <div className="mb-2 flex items-center justify-between font-mono text-[9.5px] text-muted-dim">
              <span>DISPATCH RAIL: SLIDING TRACK</span>
              <span>SYNCHRONIZING SLOTS...</span>
            </div>
            <div className="flex gap-2.5 overflow-hidden pb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="min-h-[58px] min-w-[220px] shrink-0 border border-line-subtle bg-surface-card p-2.5 space-y-2"
                >
                  <div className="flex justify-between">
                    <div className="h-2.5 w-10 bg-surface-well" />
                    <div className="h-2.5 w-14 bg-surface-well" />
                  </div>
                  <div className="h-3 w-full bg-surface-well" />
                </div>
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
          STATE 3: LOADED WORKSTATION VIEWER (DUAL MODE: FEATURED & GRID)
          ========================================================================= */}
      {!loading && current && (
        <div
          ref={carouselRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Technical Articles Workstation"
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="touch-pan-y focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow"
        >
          {/* Screen Reader Live Region */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {viewMode === 'featured'
              ? `Featured Dispatch ${currentIndex + 1} of ${total}: ${current.title}`
              : `Catalog Grid View showing all ${total} dispatches`}
          </div>

          {/* Top Workstation Control Bar */}
          <div className="mb-4 flex flex-col gap-2.5 border border-line bg-surface p-2.5 sm:p-3 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line-subtle pb-2 font-mono text-[10px] sm:text-[10.5px]">
              {/* Left Telemetry Status */}
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

              {/* Right: View Mode Toggle & Navigation Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Workstation Dual View Mode Switcher */}
                <div
                  role="group"
                  aria-label="Article view presentation mode"
                  className="flex items-center border border-line-subtle bg-surface-card p-0.5"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('featured')}
                    aria-pressed={viewMode === 'featured'}
                    className={`inline-flex min-h-[34px] sm:min-h-[28px] items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] transition ${
                      viewMode === 'featured'
                        ? 'border border-pink/60 bg-focus font-bold text-pink shadow-sm'
                        : 'border border-transparent text-muted hover:text-ink hover:border-line-subtle'
                    }`}
                  >
                    <Layout size={12} className={viewMode === 'featured' ? 'text-pink' : 'text-muted-dim'} />
                    <span>FEATURED</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-pressed={viewMode === 'grid'}
                    className={`inline-flex min-h-[34px] sm:min-h-[28px] items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] transition ${
                      viewMode === 'grid'
                        ? 'border border-pink/60 bg-focus font-bold text-pink shadow-sm'
                        : 'border border-transparent text-muted hover:text-ink hover:border-line-subtle'
                    }`}
                  >
                    <LayoutGrid size={12} className={viewMode === 'grid' ? 'text-pink' : 'text-muted-dim'} />
                    <span>GRID ARCHIVE</span>
                  </button>
                </div>

                {/* Featured Mode: Tactile Prev/Next Steppers */}
                {viewMode === 'featured' ? (
                  <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
                    <div className="flex items-center gap-1 font-mono text-[10px] text-muted">
                      <span className="text-ink-secondary font-semibold">
                        [{currentNumber}
                      </span>
                      <span>/</span>
                      <span>{totalNumber}]</span>
                    </div>

                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous article"
                      className="inline-flex min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] items-center justify-center border border-line-subtle bg-surface-card font-mono text-[10px] text-ink-secondary transition hover:border-pink hover:bg-focus hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                    >
                      <ChevronLeft size={14} className="opacity-80" />
                      <span className="sr-only sm:not-sr-only sm:pr-0.5">PREV</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next article"
                      className="inline-flex min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] items-center justify-center border border-line-subtle bg-surface-card font-mono text-[10px] text-ink-secondary transition hover:border-pink hover:bg-focus hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                    >
                      <span className="sr-only sm:not-sr-only sm:pl-0.5">NEXT</span>
                      <ChevronRight size={14} className="opacity-80" />
                    </button>
                  </div>
                ) : (
                  <div className="font-mono text-[10px] text-muted-dim pl-1">
                    [{totalNumber} ARTICLES]
                  </div>
                )}
              </div>
            </div>

            {/* Quick Hub Telemetry Sub-bar */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[9.5px] font-mono text-muted">
              {viewMode === 'featured' ? (
                <>
                  <span>USE [← / →] KEYS OR SWIPE TO CYCLE DISPATCHES</span>
                  <span className="text-muted">
                    TOPIC: {(current.category || 'SYSTEMS').toUpperCase()}
                  </span>
                </>
              ) : (
                <>
                  <span>SHOWING ALL {totalNumber} DISPATCHES · 2-COL WORKSTATION GRID</span>
                  <span className="text-muted">CATALOG ARCHIVE // HASHNODE SYNC</span>
                </>
              )}
            </div>
          </div>

          {/* =====================================================================
              PRESENTATION MODE 1: FEATURED (HERO FOCUS // EXPANSIVE BANNER)
              ===================================================================== */}
          {viewMode === 'featured' && (
            <div>
              {/* Featured Dispatch Card */}
              <div
                role="group"
                aria-roledescription="slide"
                aria-label={`Article ${currentIndex + 1} of ${total}: ${current.title}`}
                className="border border-line bg-surface p-3.5 sm:p-5 shadow-panel"
              >
                {/* Expansive Full-Width Cover Banner */}
                <div className="relative w-full border border-line-subtle bg-surface-inset">
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-surface-inset">
                    <a
                      href={current.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Read full article: ${current.title}`}
                      className="group/thumb block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                    >
                      {hasCover ? (
                        <>
                          {/* Loading buffer indicator while image is streaming */}
                          {!isCoverLoaded && (
                            <div
                              className="absolute inset-0 flex flex-col items-center justify-center bg-surface-inset p-4 font-mono text-muted select-none"
                              aria-label="Buffering cover image"
                            >
                              <Terminal size={22} className="text-muted-dim/40 mb-2 animate-pulse" />
                              <div className="flex items-center gap-1.5 text-[9.5px] tracking-wider text-muted-dim">
                                <span className="text-pink animate-spin">◐</span>
                                <span>[ STREAMING HIGH-FIDELITY COVER BUFFER ]</span>
                              </div>
                              <div className="mt-3 h-1 w-36 overflow-hidden border border-line-subtle bg-surface-well">
                                <div className="h-full w-2/3 bg-pink/50 animate-pulse" />
                              </div>
                            </div>
                          )}

                          <img
                            key={current.id || current.cover}
                            src={current.cover}
                            alt={current.title}
                            onLoad={() => handleImageLoad(current.id)}
                            onError={() => handleImageError(current.id)}
                            className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover/thumb:scale-[1.02] ${
                              isCoverLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading="lazy"
                            decoding="async"
                          />
                        </>
                      ) : (
                        <div className="flex h-full w-full flex-col justify-between p-4 sm:p-6 font-mono transition group-hover/thumb:bg-surface-well/50">
                          <div className="flex items-center justify-between text-[10px] text-muted">
                            <span className="flex items-center gap-1.5 text-muted">
                              <Terminal size={13} className="text-muted-dim" />
                              DISPATCH_{currentNumber}
                            </span>
                            <span className="text-muted-dim">RAW_TEXT_BUFFER</span>
                          </div>

                          <div className="my-auto text-center py-6">
                            <div className="font-mono text-xs sm:text-sm tracking-wider text-ink-secondary group-hover/thumb:text-lime">
                              [ TECHTOM ARCHIVE // {DEFAULT_HOST} ]
                            </div>
                            <div className="mt-1 font-mono text-[11px] text-yellow">
                              {current.category || 'SYSTEMS ARCHITECTURE'}
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-line-subtle pt-1.5 text-[9.5px] text-muted-dim">
                            <span>FORMAT: MARKDOWN ENCLOSURE</span>
                            <span>HASHNODE RSS 2.0 SYNC</span>
                          </div>
                        </div>
                      )}

                      {/* Monokai Contrast Vignette for HUD Overlays */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50" />

                      {/* HUD Overlay: Top-Left Category Pill */}
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-2">
                        <span className="border border-pink/60 bg-canvas/90 backdrop-blur-sm px-2.5 py-0.5 font-mono text-[9.5px] sm:text-[10px] font-semibold tracking-wider text-pink shadow-panel">
                          [ {(current.category || 'SYSTEMS').toUpperCase()} ]
                        </span>
                      </div>

                      {/* HUD Overlay: Top-Right Dispatch Indicator */}
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 border border-line-subtle bg-canvas/90 backdrop-blur-sm px-2.5 py-0.5 font-mono text-[9.5px] sm:text-[10px] font-semibold text-ink group-hover/thumb:border-pink group-hover/thumb:text-pink transition shadow-panel">
                        <span>#{currentNumber} / {totalNumber}</span>
                        <ArrowUpRight size={11} />
                      </div>

                      {/* HUD Overlay: Bottom-Left Read Time */}
                      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5 border border-line-subtle bg-canvas/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] sm:text-[9.5px] text-ink-secondary shadow-sm">
                        <Clock size={10} className="text-yellow" />
                        <span>{current.readTime || '5 min read'}</span>
                      </div>

                      {/* HUD Overlay: Bottom-Right Hover Prompt */}
                      <div className="pointer-events-none absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 border border-lime/80 bg-canvas/95 px-2 py-0.5 font-mono text-[9px] sm:text-[9.5px] font-semibold text-lime opacity-90 transition group-hover/thumb:bg-lime group-hover/thumb:text-surface group-hover/thumb:opacity-100 shadow-sm">
                        OPEN DISPATCH ↗
                      </div>
                    </a>

                    {/* On-Cover Tactile PREV Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePrev();
                      }}
                      aria-label="Previous dispatch"
                      className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 inline-flex min-h-[44px] min-w-[44px] sm:min-h-[38px] sm:min-w-[38px] items-center justify-center border border-line-subtle bg-canvas/90 backdrop-blur-sm font-mono text-[10.5px] font-semibold text-ink-secondary transition hover:border-pink hover:bg-focus hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow shadow-panel"
                    >
                      <ChevronLeft size={16} className="text-pink" />
                      {/* <span className="sr-only sm:not-sr-only sm:pr-0.5 sm:text-[9.5px]">PREV</span> */}
                    </button>

                    {/* On-Cover Tactile NEXT Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNext();
                      }}
                      aria-label="Next dispatch"
                      className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 inline-flex min-h-[44px] min-w-[44px] sm:min-h-[38px] sm:min-w-[38px] items-center justify-center border border-line-subtle bg-canvas/90 backdrop-blur-sm font-mono text-[10.5px] font-semibold text-ink-secondary transition hover:border-pink hover:bg-focus hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow shadow-panel"
                    >
                      {/* <span className="sr-only sm:not-sr-only sm:pl-0.5 sm:text-[9.5px]">NEXT</span> */}
                      <ChevronRight size={16} className="text-pink" />
                    </button>
                  </div>

                  {/* Zero-Gap Integrated Telemetry Strip Directly Beneath Image */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-subtle bg-surface-inset px-3 py-2 font-mono text-[10px] sm:text-[10.5px]">
                    <div className="flex flex-wrap items-center gap-2.5 text-muted">
                      <div className="flex items-center gap-1.5 text-ink-secondary">
                        <Calendar size={11} className="text-muted-dim" />
                        <span>{current.date}</span>
                      </div>
                      <span className="text-muted-dim">·</span>
                      <div className="flex items-center gap-1.5 text-ink-secondary">
                        <Clock size={11} className="text-muted-dim" />
                        <span>{current.readTime}</span>
                      </div>
                      <span className="hidden sm:inline text-muted-dim">·</span>
                      <span className="hidden sm:inline text-muted-dim">HOST: {DEFAULT_HOST}</span>
                    </div>

                    <div className="flex items-center gap-3 text-muted">
                      {current.views > 0 && (
                        <div
                          className="flex items-center gap-1 text-muted"
                          title={`${current.views.toLocaleString()} total views`}
                        >
                          <Eye size={12} className="text-muted-dim" />
                          <span>{current.views.toLocaleString()}</span>
                        </div>
                      )}
                      {current.reactionCount > 0 && (
                        <div
                          className="flex items-center gap-1 text-muted"
                          title={`${current.reactionCount} reactions`}
                        >
                          <Heart size={12} className="text-pink fill-pink/20" />
                          <span>{current.reactionCount}</span>
                        </div>
                      )}
                      <a
                        href={current.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-pink hover:underline font-mono text-[10px]"
                      >
                        <span>HASHNODE</span>
                        <ArrowUpRight size={10} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Content Section (Cleanly stacked, zero height-mismatch void) */}
                <div className="mt-4 sm:mt-5 flex flex-col justify-between">
                  <div>
                    {/* Article Headline (Linked) */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug tracking-tight text-ink">
                      <a
                        href={current.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="transition hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                      >
                        {current.title}
                      </a>
                    </h3>

                    {/* Subtitle (Rendered clearly in Monokai yellow) */}
                    {current.subtitle && (
                      <p className="mt-1.5 font-mono text-xs sm:text-[13px] leading-relaxed text-yellow/90">
                        {current.subtitle}
                      </p>
                    )}

                    {/* Synopsis / Excerpt */}
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-secondary">
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

                  {/* Workstation Action Controls */}
                  <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 border-t border-line-subtle pt-4">
                    <a
                      href={current.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-[44px] items-center gap-2 border border-pink bg-pink px-4 py-2.5 font-mono text-[10.5px] sm:text-[11px] font-semibold text-surface transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f9267270] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                    >
                      <BookOpen size={13} />
                      <span>READ FULL DISPATCH</span>
                      <ArrowUpRight size={13} />
                    </a>

                    <a
                      href={`https://${DEFAULT_HOST}/`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-[44px] items-center gap-1.5 border border-line-subtle bg-surface-card px-3.5 py-2.5 font-mono text-[10px] text-ink-secondary transition hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                    >
                      <span>ALL POSTS ON TECHTOM</span>
                      <ExternalLink size={12} className="text-muted-dim" />
                    </a>

                    {isFallback && (
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="inline-flex min-h-[44px] items-center gap-1.5 border border-line-subtle bg-surface-card px-3 py-2.5 font-mono text-[10px] text-yellow transition hover:border-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                      >
                        <RefreshCw size={12} />
                        <span>RELOAD LIVE FEED</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Single Sliding File Rail for Article Titles */}
              <div className="mt-3.5 border border-line bg-surface p-2.5 sm:p-3 shadow-panel">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 font-mono text-[9.5px] text-muted">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-ink-secondary">[DISPATCH RAIL]</span>
                    <span className="text-muted-dim">//</span>
                    <span>SLIDING FILE TRACK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-muted-dim">SCROLL OR NUDGE TO BROWSE</span>
                    <span
                      className="truncate max-w-[200px] sm:max-w-xs text-ink-secondary"
                      title={current.title}
                    >
                      ACTIVE: [#{currentNumber}]
                    </span>
                    {/* Track Nudge Controls */}
                    <div className="flex items-center gap-1 pl-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (slidingRailRef.current) {
                            slidingRailRef.current.scrollBy({ left: -220, behavior: 'smooth' });
                          }
                        }}
                        aria-label="Scroll rail left"
                        className="inline-flex h-5 w-5 items-center justify-center border border-line-subtle bg-surface-card text-muted hover:border-pink hover:text-pink transition"
                      >
                        <ChevronLeft size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (slidingRailRef.current) {
                            slidingRailRef.current.scrollBy({ left: 220, behavior: 'smooth' });
                          }
                        }}
                        aria-label="Scroll rail right"
                        className="inline-flex h-5 w-5 items-center justify-center border border-line-subtle bg-surface-card text-muted hover:border-pink hover:text-pink transition"
                      >
                        <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Single Sliding Track */}
                <div
                  ref={slidingRailRef}
                  className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-0.5 scroll-smooth snap-x snap-mandatory focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-surface-inset [&::-webkit-scrollbar-thumb]:bg-[#45463e] hover:[&::-webkit-scrollbar-thumb]:bg-pink/60"
                  role="tablist"
                  aria-label="Dispatch sliding rail"
                >
                  {articles.map((art, idx) => {
                    const isActive = idx === currentIndex;
                    const formattedIdx =
                      idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
                    return (
                      <button
                        key={art.id || art.slug || idx}
                        ref={isActive ? activeItemRef : null}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Jump to article ${formattedIdx}: ${art.title}`}
                        className={`group flex min-w-[210px] max-w-[230px] sm:min-w-[240px] sm:max-w-[270px] shrink-0 snap-start flex-col justify-between border p-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                          isActive
                            ? 'border-pink bg-focus text-ink shadow-[2px_2px_0_#f9267240]'
                            : 'border-line-subtle bg-surface-card text-muted hover:border-line hover:bg-surface-well hover:text-ink'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 font-mono text-[9.5px]">
                          <span
                            className={
                              isActive ? 'font-bold text-pink' : 'text-muted-dim font-medium'
                            }
                          >
                            {isActive ? `● #${formattedIdx}` : `#${formattedIdx}`}
                          </span>
                          <span className="text-[9px] text-muted-dim">{art.date}</span>
                        </div>
                        <div
                          className={`my-1.5 font-sans text-[11.5px] font-medium leading-snug line-clamp-1 ${
                            isActive ? 'text-ink font-semibold' : 'text-ink-secondary group-hover:text-ink'
                          }`}
                          title={art.title}
                        >
                          {art.title}
                        </div>
                        <div className="flex items-center justify-between text-[8.5px] font-mono text-muted-dim">
                          <span className="truncate max-w-[130px]">
                            {(art.category || 'SYSTEMS').toUpperCase()}
                          </span>
                          <span>{art.readTime || '5m'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              PRESENTATION MODE 2: GRID (CATALOG ARCHIVE // 2-COLUMN BALANCED MATRIX)
              ===================================================================== */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {articles.map((art, idx) => {
                const cardFormattedIdx =
                  idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
                const cardHasCover = Boolean(art?.cover) && !imageErrors[art?.id];
                const cardIsLoaded = Boolean(art?.id && loadedImages[art.id]);

                return (
                  <article
                    key={art.id || art.slug || idx}
                    className="flex flex-col justify-between border border-line bg-surface shadow-panel transition hover:border-line-accent"
                  >
                    <div>
                      {/* Top Full-Width Cover for Each Card (Zero Gap) */}
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Read article: ${art.title}`}
                        className="group/grid-thumb relative block aspect-[16/9] w-full overflow-hidden border-b border-line-subtle bg-surface-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                      >
                        {cardHasCover ? (
                          <>
                            {!cardIsLoaded && (
                              <div
                                className="absolute inset-0 flex flex-col items-center justify-center bg-surface-inset p-3 font-mono text-muted select-none"
                                aria-label="Buffering cover image"
                              >
                                <Terminal size={16} className="text-muted-dim/40 mb-1 animate-pulse" />
                                <div className="text-[9px] tracking-wider text-muted-dim">
                                  [ BUFFERING COVER ]
                                </div>
                              </div>
                            )}
                            <img
                              src={art.cover}
                              alt={art.title}
                              onLoad={() => handleImageLoad(art.id)}
                              onError={() => handleImageError(art.id)}
                              className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover/grid-thumb:scale-[1.02] ${
                                cardIsLoaded ? 'opacity-100' : 'opacity-0'
                              }`}
                              loading="lazy"
                              decoding="async"
                            />
                          </>
                        ) : (
                          <div className="flex h-full w-full flex-col justify-between p-3 font-mono">
                            <div className="flex items-center justify-between text-[9px] text-muted">
                              <span>DISPATCH_{cardFormattedIdx}</span>
                              <span>RAW_TEXT</span>
                            </div>
                            <div className="text-center font-mono text-[10.5px] text-muted-dim">
                              [ {art.category || 'TECHTOM ARCHIVE'} ]
                            </div>
                            <div className="text-[9px] text-muted-dim">FORMAT: MD</div>
                          </div>
                        )}

                        {/* Monokai Contrast Vignette */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                        {/* Top Left: Category Pill */}
                        <div className="absolute top-2 left-2">
                          <span className="border border-pink/60 bg-surface/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] font-semibold text-pink shadow-sm">
                            {(art.category || 'SYSTEMS').toUpperCase()}
                          </span>
                        </div>

                        {/* Top Right: Dispatch Index */}
                        <div className="absolute top-2 right-2 border border-line-subtle bg-surface/90 backdrop-blur-sm px-1.5 py-0.5 font-mono text-[9px] text-ink font-semibold">
                          #{cardFormattedIdx}
                        </div>

                        {/* Bottom Right: Hover Prompt */}
                        <div className="pointer-events-none absolute bottom-2 right-2 border border-lime/80 bg-canvas/95 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold text-lime opacity-0 transition group-hover/grid-thumb:opacity-100">
                          READ DISPATCH ↗
                        </div>
                      </a>

                      {/* Zero-Gap Telemetry Strip */}
                      <div className="flex items-center justify-between border-b border-line-subtle bg-surface-inset px-3 py-1.5 font-mono text-[9.5px] text-muted">
                        <div className="flex items-center gap-1.5 text-ink-secondary">
                          <Calendar size={11} className="text-muted-dim" />
                          <span>{art.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-ink-secondary">
                          <Clock size={11} className="text-muted-dim" />
                          <span>{art.readTime}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-3.5 sm:p-4">
                        {/* Title */}
                        <h4 className="font-display text-[15px] sm:text-base font-semibold leading-snug tracking-tight text-ink group-hover:text-lime line-clamp-2">
                          <a
                            href={art.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="transition hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                          >
                            {art.title}
                          </a>
                        </h4>

                        {/* Subtitle if available */}
                        {art.subtitle && (
                          <p className="mt-1 line-clamp-1 font-mono text-[11px] text-yellow/90">
                            {art.subtitle}
                          </p>
                        )}

                        {/* Excerpt (Line clamped to maintain crisp card symmetry) */}
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-secondary">
                          {art.description}
                        </p>

                        {/* Tags */}
                        {Array.isArray(art.tags) && art.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-1">
                            {art.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="border border-line-subtle bg-surface-card px-1.5 py-0.5 font-mono text-[9px] text-muted"
                              >
                                #{tag}
                              </span>
                            ))}
                            {art.tags.length > 3 && (
                              <span className="font-mono text-[9px] text-muted-dim">
                                +{art.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="border-t border-line-subtle bg-surface-inset px-3.5 py-2.5 flex items-center justify-between gap-2">
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1.5 border border-pink/60 bg-pink/10 px-3 py-1.5 font-mono text-[10px] font-semibold text-pink transition hover:bg-pink hover:text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                      >
                        <BookOpen size={11} />
                        <span>READ DISPATCH</span>
                        <ArrowUpRight size={11} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleSwitchToHero(idx)}
                        className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1 border border-line-subtle bg-surface-card px-2.5 py-1.5 font-mono text-[9.5px] text-muted transition hover:border-yellow hover:text-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                        title="Focus in Featured Hero Mode"
                      >
                        <Maximize2 size={10} />
                        <span className="hidden sm:inline">HERO FOCUS</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
