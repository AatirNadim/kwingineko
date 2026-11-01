import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Terminal,
  Monitor,
  Gamepad2,
  Mail,
  Copy,
  Check,
  Cat,
  ArrowRight,
  BookOpen,
  FolderGit2,
  Briefcase,
  Layers,
  Award,
  PenTool,
  HelpCircle,
  FileText,
  X,
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onLaunchArcade,
  onToggleCrt,
  crtActive,
  onToggleCat,
  catFollowActive,
  onOpenComposer,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Command definitions
  const commands = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-home',
        category: 'NAVIGATION',
        label: 'Jump to Overview / Introduction',
        icon: Terminal,
        shortcut: 'G O',
        action: () => {
          onNavigate('home');
          onClose();
        },
      },
      {
        id: 'nav-work',
        category: 'NAVIGATION',
        label: 'Jump to Selected Work (Projects)',
        icon: FolderGit2,
        shortcut: 'G W',
        action: () => {
          onNavigate('work');
          onClose();
        },
      },
      {
        id: 'nav-experience',
        category: 'NAVIGATION',
        label: 'Jump to Experience & Timeline',
        icon: Briefcase,
        shortcut: 'G E',
        action: () => {
          onNavigate('experience');
          onClose();
        },
      },
      {
        id: 'nav-expertise',
        category: 'NAVIGATION',
        label: 'Jump to Technical Expertise',
        icon: Layers,
        shortcut: 'G X',
        action: () => {
          onNavigate('expertise');
          onClose();
        },
      },
      {
        id: 'nav-certificates',
        category: 'NAVIGATION',
        label: 'Jump to Verified Certificates',
        icon: Award,
        shortcut: 'G C',
        action: () => {
          onNavigate('certificates');
          onClose();
        },
      },
      {
        id: 'nav-writing',
        category: 'NAVIGATION',
        label: 'Jump to Technical Articles & Writing',
        icon: PenTool,
        shortcut: 'G A',
        action: () => {
          onNavigate('writing');
          onClose();
        },
      },
      {
        id: 'nav-faq',
        category: 'NAVIGATION',
        label: 'Jump to FAQ & Knowledge Base',
        icon: HelpCircle,
        shortcut: 'G F',
        action: () => {
          onNavigate('faq');
          onClose();
        },
      },
      {
        id: 'nav-contact',
        category: 'NAVIGATION',
        label: 'Jump to Contact & Transmission',
        icon: Mail,
        shortcut: 'G T',
        action: () => {
          onNavigate('contact');
          onClose();
        },
      },

      // Workstation Actions & Easter Eggs
      {
        id: 'act-arcade',
        category: 'WORKSTATION ACTIONS',
        label: "Launch Aatir's Arcade (DOS Player)",
        icon: Gamepad2,
        shortcut: 'ALT G',
        action: () => {
          onClose();
          onLaunchArcade();
        },
      },
      {
        id: 'act-crt',
        category: 'WORKSTATION ACTIONS',
        label: crtActive ? 'Turn Off Retro CRT Phosphor Filter' : 'Activate Retro CRT Phosphor Scanlines',
        icon: Monitor,
        shortcut: 'ALT C',
        action: () => {
          onToggleCrt(!crtActive);
          onClose();
        },
      },
      {
        id: 'act-cat',
        category: 'WORKSTATION ACTIONS',
        label: catFollowActive ? 'Stop Desk Cat Following Cursor' : 'Make Desk Cat Follow Cursor',
        icon: Cat,
        shortcut: 'ALT F',
        action: () => {
          onToggleCat();
          onClose();
        },
      },
      {
        id: 'act-copy-email',
        category: 'WORKSTATION ACTIONS',
        label: 'Copy Direct Email (aatir.nadim@gmail.com)',
        icon: copiedEmail ? Check : Copy,
        shortcut: 'CP',
        action: async () => {
          try {
            await navigator.clipboard.writeText('aatir.nadim@gmail.com');
            setCopiedEmail(true);
            setTimeout(() => {
              setCopiedEmail(false);
              onClose();
            }, 1000);
          } catch {
            onClose();
          }
        },
      },
      {
        id: 'act-composer',
        category: 'WORKSTATION ACTIONS',
        label: 'Open Message Composer Modal',
        icon: Mail,
        shortcut: 'NEW',
        action: () => {
          onClose();
          onOpenComposer();
        },
      },
      {
        id: 'act-resume',
        category: 'WORKSTATION ACTIONS',
        label: 'View / Download Official Résumé (.PDF)',
        icon: FileText,
        shortcut: 'CV',
        action: () => {
          onClose();
          window.open('/Aatir_Nadim_Resume.pdf', '_blank');
        },
      },
    ],
    [
      onNavigate,
      onClose,
      onLaunchArcade,
      onToggleCrt,
      crtActive,
      onToggleCat,
      catFollowActive,
      copiedEmail,
      onOpenComposer,
    ]
  );

  // Filter commands
  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.shortcut.toLowerCase().includes(q)
    );
  }, [query, commands]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? (filteredCommands.length ? filteredCommands.length - 1 : 0) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredCommands[selectedIndex];
      if (current) current.action();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeItem = listRef.current.querySelector('[data-active="true"]');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 pt-[10vh] backdrop-blur-[2px] sm:p-4 sm:pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] border border-[#58594e] bg-[#1e1f1c] shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-[#36372f] bg-[#252621] px-3 py-2 font-mono text-[10px] tracking-wider text-muted sm:px-4">
          <div className="flex items-center gap-2 text-lime">
            <Terminal size={14} />
            <span>COMMAND_PALETTE // WORKSTATION OS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#88846f] hidden sm:inline">[ESC] to exit</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close command palette"
              className="grid min-h-[36px] min-w-[36px] place-items-center p-1.5 text-[#939180] transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative border-b border-[#36372f] bg-[#181916]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-pink">
            &gt;_
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, navigate sections, trigger easter eggs..."
            aria-label="Command search prompt"
            className="h-12 w-full bg-transparent pl-9 pr-4 font-mono text-xs text-ink placeholder-[#79786a] focus:outline-none"
          />
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          role="listbox"
          className="max-h-[380px] overflow-y-auto p-2 font-mono text-xs"
        >
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-[#88846f]">
              <p className="text-yellow text-xs">NO COMMANDS MATCHING &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-[10px]">Try searching for &quot;work&quot;, &quot;arcade&quot;, &quot;cat&quot;, or &quot;crt&quot;.</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isSelected}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between gap-3 border px-3 py-2.5 transition-colors ${
                    isSelected
                      ? 'border-pink/50 bg-[#36272c] text-ink'
                      : 'border-transparent text-[#c7c5b7] hover:bg-[#252621]'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Icon
                      size={15}
                      className={`shrink-0 ${isSelected ? 'text-pink' : 'text-lime'}`}
                    />
                    <div className="min-w-0">
                      <span className="block truncate text-xs">{cmd.label}</span>
                      <span className="block text-[8.5px] text-[#88846f]">{cmd.category}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`border px-1.5 py-0.5 text-[8.5px] ${
                        isSelected
                          ? 'border-pink/40 bg-pink/20 text-pink'
                          : 'border-[#43443a] bg-[#1a1b18] text-[#939180]'
                      }`}
                    >
                      {cmd.shortcut}
                    </span>
                    {isSelected && <ArrowRight size={13} className="text-pink" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Quick Shortcuts */}
        <div className="flex items-center justify-between border-t border-[#36372f] bg-[#1a1b18] px-3 py-2 font-mono text-[9px] text-[#88846f]">
          <div className="flex items-center gap-3">
            <span><kbd className="border border-[#43443a] bg-[#252621] px-1 text-ink">↑</kbd> <kbd className="border border-[#43443a] bg-[#252621] px-1 text-ink">↓</kbd> navigate</span>
            <span><kbd className="border border-[#43443a] bg-[#252621] px-1 text-ink">↵</kbd> select</span>
          </div>
          <span>KONAMI CODE: <span className="text-yellow">↑↑↓↓←→←→BA</span></span>
        </div>
      </div>
    </div>
  );
}
