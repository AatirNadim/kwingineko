import { useEffect, useRef, useState } from 'react';
import ContactModal from './components/ContactModal.jsx';
import DosPlayerModal from './components/DosPlayerModal.jsx';
import ContactSection from './components/ContactSection.jsx';
import BlogSection from './components/BlogSection.jsx';
import CertificatesSection from './components/CertificatesSection.jsx';
import FaqSection from './components/FaqSection.jsx';
import ExperienceSection from './components/ExperienceSection.jsx';
import ExpertiseSection from './components/ExpertiseSection.jsx';
import Introduction from './components/Introduction.jsx';
import NavigationRail from './components/NavigationRail.jsx';
import PersonalSidebar from './components/PersonalSidebar.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import StarfieldBackground from './components/StarfieldBackground.jsx';
import IntroSplash from './components/IntroSplash.jsx';
import CursorCat from './components/CursorCat.jsx';
import CrtOverlay from './components/CrtOverlay.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import { initConsoleEasterEgg } from './utils/consoleEasterEgg.js';
import { retroGames } from './data/games.js';
import { prewarmEmulatorRuntime } from './utils/arcadeCache.js';

export default function App() {
  const [active, setActive] = useState('home');
  const [navOpen, setNavOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [followCursor, setFollowCursor] = useState(false);
  const [catStatus, setCatStatus] = useState('idle');
  const [catHungry, setCatHungry] = useState(false);
  const [feedProgress, setFeedProgress] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeDosGame, setActiveDosGame] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [crtActive, setCrtActive] = useState(false);
  const isNavigatingRef = useRef(false);
  const navLockTimerRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // First hunger cue arrives shortly after the page is ready; later cues settle into a five minute rhythm.
  useEffect(() => {
    let repeatTimer;
    const firstTimer = window.setTimeout(() => {
      setCatHungry(true);
      repeatTimer = window.setInterval(() => setCatHungry(true), 60_000);
    }, 15_000);
    return () => {
      window.clearTimeout(firstTimer);
      if (repeatTimer) window.clearInterval(repeatTimer);
    };
  }, []);

  // A small synthesized audio note accompanies each hunger cue where browser audio is available.
  useEffect(() => {
    if (!catHungry) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(740, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(520, context.currentTime + 0.22);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.26);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.27);
      oscillator.onended = () => context.close();
    } catch { /* Audio may be unavailable or blocked until a visitor interacts. */ }
  }, [catHungry]);

  useEffect(() => {
    if (!catHungry) return;
    const originalTitle = document.title;
    let showReminder = false;
    const timer = window.setInterval(() => {
      showReminder = !showReminder;
      document.title = showReminder ? '🐈 Feed me!' : originalTitle;
    }, 1200);
    return () => {
      window.clearInterval(timer);
      document.title = originalTitle;
    };
  }, [catHungry]);

  const feedCat = () => {
    if (!catHungry) return;
    if (feedProgress >= 4) {
      setFeedProgress(0);
      setCatHungry(false);
      return;
    }
    setFeedProgress((count) => count + 1);
  };

  // Idle pre-warm shared emulator runtime (wdosbox.wasm, js-dos.js)
  useEffect(() => {
    prewarmEmulatorRuntime();
  }, []);

  // Global keyboard shortcut listeners (Cmd+K / Ctrl+K and /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Suppress global shortcuts during active DOS game sessions or contact composer modal
      if (activeDosGame !== null || contactModalOpen) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '/' && !commandPaletteOpen) {
        const tag = e.target.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea' && !e.target.isContentEditable) {
          e.preventDefault();
          setCommandPaletteOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, activeDosGame, contactModalOpen]);

  // DEVTOOLS easter egg and scrollspy for active directory item
  useEffect(() => {
    initConsoleEasterEgg({
      onToggleCrt: () => setCrtActive((prev) => !prev),
      onLaunchArcade: () => setActiveDosGame(retroGames[0]),
      onOpenComposer: () => setContactModalOpen(true),
    });
  }, []);

  // Synchronize active section in sticky NavigationRail with viewport scroll
  useEffect(() => {
    const sectionIds = ['home', 'work', 'experience', 'expertise', 'writing', 'certificates', 'faq', 'contact'];
    let ticking = false;

    const updateActiveSection = () => {
      if (isNavigatingRef.current) return;

      // 1. If at/near the bottom of the document, activate the last section ('contact')
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 80) {
        setActive(sectionIds[sectionIds.length - 1]);
        return;
      }

      // 2. If at the very top of the page, activate 'home'
      if (window.scrollY < 120) {
        setActive(sectionIds[0]);
        return;
      }

      // 3. Reading anchor line: 180px from top of viewport (below sticky header)
      const targetOffset = 180;
      let currentActive = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= targetOffset && rect.bottom > targetOffset) {
          currentActive = id;
          break;
        }
      }

      if (currentActive) {
        setActive(currentActive);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateActiveSection(); // Initial sync

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (navLockTimerRef.current) window.clearTimeout(navLockTimerRef.current);
    };
  }, []);

  const navigateTo = (id) => {
    setActive(id);
    setNavOpen(false);
    isNavigatingRef.current = true;
    if (navLockTimerRef.current) window.clearTimeout(navLockTimerRef.current);
    navLockTimerRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 900);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      <StarfieldBackground />
      <IntroSplash />
      <CursorCat active={followCursor || catHungry} hungry={catHungry} feedProgress={feedProgress} onFeed={feedCat} onStatusChange={setCatStatus} />
      <div className="relative z-[1] mx-auto w-[calc(100%-16px)] max-w-[1360px] pt-2 min-[380px]:w-[calc(100%-24px)] min-[380px]:pt-3 sm:w-[calc(100%-32px)] sm:pt-4 md:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] lg:pt-[30px]">
        <a
          href="#main"
          className="fixed left-[-10000px] top-[10px] z-[120] bg-yellow p-[10px] text-surface focus:left-[10px]"
        >
          Skip to content
        </a>
        <SiteHeader
          time={time}
          navOpen={navOpen}
          onToggleNavigation={() => setNavOpen((open) => !open)}
          onHome={(event) => {
            event.preventDefault();
            navigateTo('home');
          }}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          crtActive={crtActive}
          onToggleCrt={setCrtActive}
        />
        <div className="grid grid-cols-1 items-start gap-3 pt-3 sm:gap-4 sm:pt-4 lg:grid-cols-[200px_minmax(0,1fr)_258px] lg:gap-[22px] lg:pt-6">
          <NavigationRail
            open={navOpen}
            onClose={() => setNavOpen(false)}
            active={active}
            time={time}
            onNavigate={navigateTo}
          />
          <main id="main" tabIndex="-1" className="main-container min-w-0 focus:outline-none">
            <Introduction onExplore={() => navigateTo('work')} />
            <ProjectsSection />
            <ExperienceSection />
            <ExpertiseSection />
            <BlogSection />
            <CertificatesSection />
            <FaqSection onLaunchGame={(game) => setActiveDosGame(game)} />
            <ContactSection onOpenComposer={() => setContactModalOpen(true)} />
          </main>
          <PersonalSidebar
            followEnabled={followCursor}
            onToggleFollow={() => setFollowCursor((prev) => !prev)}
            catStatus={catStatus}
          />
        </div>
        <SiteFooter
          onHome={(event) => {
            event.preventDefault();
            navigateTo('home');
          }}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
        <DosPlayerModal
          isOpen={Boolean(activeDosGame)}
          game={activeDosGame}
          onClose={() => setActiveDosGame(null)}
          onGameChange={(nextGame) => setActiveDosGame(nextGame)}
        />
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={navigateTo}
          onLaunchArcade={() => setActiveDosGame(retroGames[0])}
          onToggleCrt={setCrtActive}
          crtActive={crtActive}
          onToggleCat={() => setFollowCursor((prev) => !prev)}
          catFollowActive={followCursor}
          onOpenComposer={() => setContactModalOpen(true)}
        />
        <CrtOverlay active={crtActive} onToggle={setCrtActive} />
      </div>
    </>
  );
}
