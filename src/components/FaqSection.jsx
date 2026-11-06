import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Check, Copy, HelpCircle, Terminal, X, CornerDownRight, Play, Volume2 } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import { faqs } from '../data/portfolio.js';
import { retroGames } from '../data/games.js';
import { prefetchBundle } from '../utils/arcadeCache.js';

const CATEGORIES = [
  { id: 'all', label: 'ALL QUERIES' },
  { id: 'roles', label: 'ROLES & IMPACT' },
  { id: 'engineering', label: 'ENGINEERING CRAFT' },
  { id: 'lore', label: 'LORE & TRIVIA' },
];

export default function FaqSection({ onLaunchGame }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState(() => new Set(['roles-scope']));
  const [copiedId, setCopiedId] = useState(null);

  // Filter FAQs based on category and query
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.highlight.toLowerCase().includes(q) ||
        faq.tag.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleLaunchRandom = () => {
    const randomIndex = Math.floor(Math.random() * retroGames.length);
    onLaunchGame?.(retroGames[randomIndex]);
  };

  const handleCopyAnswer = async (faq) => {
    try {
      await navigator.clipboard.writeText(`Q: ${faq.question}\n\nA: ${faq.answer}`);
      setCopiedId(faq.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = { all: faqs.length };
    faqs.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section id="faq" className="scroll-mt-6 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="07 / KNOWLEDGE_BASE" title="Frequently asked questions" aside="QUERY // FAQ.MD" />

      {/* Control Console: Search & Category Tabs */}
      <div className="mb-4 space-y-3">
        {/* Search Bar + Expand/Collapse Buttons */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <span className="font-mono text-xs text-lime">&gt;_</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="grep -i keyword in knowledge base..."
              aria-label="Filter FAQ entries by keyword"
              className="h-11 w-full border border-line bg-[#1e1f1c] py-2 pl-9 pr-9 font-mono text-xs text-ink placeholder-[#88846f] transition-colors focus:border-yellow focus:bg-[#252621] focus:outline-none focus:ring-1 focus:ring-yellow"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 flex h-11 w-11 items-center justify-center text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="inline-flex min-h-[44px] items-center border border-[#48493e] bg-surface px-3 py-2 font-mono text-[9px] tracking-wider text-[#cbc9b9] transition hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              [ + EXPAND ALL ]
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="inline-flex min-h-[44px] items-center border border-[#48493e] bg-surface px-3 py-2 font-mono text-[9px] tracking-wider text-[#cbc9b9] transition hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              [ - COLLAPSE ALL ]
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#35362e] pb-3" role="tablist" aria-label="FAQ categories">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex min-h-[44px] items-center gap-2 border px-3 py-2 font-mono text-[9.5px] tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                  isSelected
                    ? 'border-pink bg-pink/15 text-pink font-semibold'
                    : 'border-[#383931] bg-[#1a1b18] text-[#c2c0af] hover:border-[#4d4e43] hover:text-ink'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`border px-1.5 py-0.5 text-[9.5px] ${
                    isSelected
                      ? 'border-pink/40 bg-pink/20 text-pink'
                      : 'border-[#43443a] bg-[#252621] text-[#939180]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="border border-dashed border-[#5d5e50] bg-[#1a1b17] p-6 text-center font-mono">
          <Terminal size={22} className="mx-auto text-pink mb-2" />
          <p className="text-xs text-yellow">NO ENTRIES MATCHING: &ldquo;{searchQuery}&rdquo;</p>
          <p className="mt-1 text-[10px] text-[#88846f]">
            Try a different search term or reset the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 inline-flex min-h-[44px] items-center border border-lime bg-[#232a1e] px-4 py-2 text-[10px] font-semibold text-lime transition hover:bg-lime hover:text-[#1e1f1c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.has(faq.id);
            const isCopied = copiedId === faq.id;

            return (
              <article
                key={faq.id}
                className={`border transition-colors focus-within:border-[#737466] ${
                  isExpanded ? 'border-[#58594e] bg-[#22231e]' : 'border-line bg-surface hover:border-[#525347]'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  id={`faq-header-${faq.id}`}
                  aria-expanded={isExpanded}
                  aria-controls={`faq-panel-${faq.id}`}
                  onClick={() => toggleExpand(faq.id)}
                  className="flex min-h-[48px] w-full items-start justify-between gap-3 p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-yellow sm:items-center sm:p-4"
                >
                  <div className="min-w-0 flex-1">
                    {/* Metadata Header Row */}
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[9.5px] tracking-wider text-muted sm:text-[10px]">
                      <span className="text-violet">#{faq.number}</span>
                      <span className="text-[#55564c]">/</span>
                      <span className="text-muted">{faq.categoryLabel}</span>
                      <span className="hidden min-[480px]:inline text-[#55564c]">/</span>
                      <span className="hidden min-[480px]:inline text-[#989582]">{faq.tag}</span>
                    </div>

                    {/* Question Title */}
                    <h3 className="mt-1.5 font-display text-sm font-semibold tracking-[-0.2px] text-ink sm:text-[15px]">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Expand/Collapse Indicator */}
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center border transition-colors ${
                      isExpanded
                        ? 'border-pink bg-pink/15 text-pink'
                        : 'border-[#43443a] bg-[#1a1b18] text-[#c2c0af]'
                    }`}
                    aria-hidden="true"
                  >
                    {isExpanded ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div
                    id={`faq-panel-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-header-${faq.id}`}
                    className="border-t border-[#36372f] bg-[#191a16] px-3.5 py-4 sm:px-5 sm:py-4.5"
                  >
                    {/* Content Answer */}
                    <p className="text-xs leading-[1.85] text-[#d6d4c5] sm:text-[13px] sm:leading-[1.9]">
                      {faq.answer}
                    </p>

                    {/* Interactive Easter Egg Discovery Area (FAQ #09) */}
                    {faq.id === 'hidden-arcade' && (
                      <div className="mt-4 border border-[#3e4036] bg-[#161713] p-3 sm:p-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => onLaunchGame?.(retroGames[0])}
                            onMouseEnter={() => prefetchBundle(retroGames[0].bundleUrl)}
                            onFocus={() => prefetchBundle(retroGames[0].bundleUrl)}
                            className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-lime bg-lime/10 px-4 py-2 font-mono text-xs font-bold text-lime transition-all hover:-translate-y-0.5 hover:bg-lime hover:text-[#181915] hover:shadow-[3px_3px_0_#a6e22e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow active:translate-y-0"
                            aria-label="Yes, launch arcade with DOOM"
                          >
                            <Play size={13} className="fill-current shrink-0" />
                            <span>[Yes]</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleLaunchRandom}
                            className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-pink bg-pink/15 px-4 py-2 font-mono text-xs font-bold text-pink transition-all hover:-translate-y-0.5 hover:bg-pink hover:text-[#181915] hover:shadow-[3px_3px_0_#f92672] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow active:translate-y-0"
                            aria-label="Yes (louder), launch arcade with a random retro game"
                          >
                            <Volume2 size={14} className="shrink-0" />
                            <span>[Yes (louder)]</span>
                            <span className="font-mono text-[10px] opacity-80">🎲 RANDOM ROM</span>
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center gap-2 font-mono text-[9.5px] text-[#8e8b78]">
                          <Terminal size={11} className="text-muted-dim shrink-0" />
                          <span>Boots MS-DOS 6.22 WASM kernel in-browser · Sound Blaster 16 stereo · 7 classic titles</span>
                        </div>
                      </div>
                    )}

                    {/* Highlight Footer + Action Bar */}
                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#2e2f27] pt-3 font-mono text-[9.5px] sm:text-[10px]">
                      <div className="flex min-w-0 items-start sm:items-center gap-1.5 text-lime">
                        <CornerDownRight size={12} className="mt-0.5 shrink-0 sm:mt-0" />
                        <span className="font-semibold text-lime break-words">{faq.highlight}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAnswer(faq)}
                        aria-label={`Copy answer for "${faq.question}"`}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border border-[#48493e] bg-surface px-2.5 py-1.5 text-[9.5px] sm:text-[10px] text-[#cbc9b9] transition hover:border-line hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} className="text-lime" />
                            <span className="text-lime">COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} className="text-muted" />
                            <span>COPY ANSWER</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Footer System Status Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#35362e] pt-3 font-mono text-[9.5px] sm:text-[10px] text-[#88846f]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
          <span>KNOWLEDGE BASE ENGINE // QUERIES CACHED IN MEMORY</span>
        </div>
        <span>TOTAL ENTRIES: {faqs.length}</span>
      </div>
    </section>
  );
}
