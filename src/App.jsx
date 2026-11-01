import { useEffect, useState } from 'react';
import ContactModal from './components/ContactModal.jsx';
import DosPlayerModal from './components/DosPlayerModal.jsx';
import ContactSection from './components/ContactSection.jsx';
import CertificatesSection from './components/CertificatesSection.jsx';
import BlogSection from './components/BlogSection.jsx';
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

export default function App() {
  const [active, setActive] = useState('home');
  const [navOpen, setNavOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [followCursor, setFollowCursor] = useState(false);
  const [catStatus, setCatStatus] = useState('idle');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeDosGame, setActiveDosGame] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const navigateTo = (id) => {
    setActive(id);
    setNavOpen(false);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      <StarfieldBackground />
      <IntroSplash />
      <CursorCat active={followCursor} onStatusChange={setCatStatus} />
      <div className="relative z-[1] mx-auto w-[calc(100%-16px)] max-w-[1360px] pt-2 min-[380px]:w-[calc(100%-24px)] min-[380px]:pt-3 sm:w-[calc(100%-32px)] sm:pt-4 md:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] lg:pt-[30px]">
        <a
          href="#main"
          className="fixed left-[-10000px] top-[10px] z-50 bg-yellow p-[10px] text-surface focus:left-[10px]"
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
            <CertificatesSection />
            <BlogSection />
            <ContactSection onOpenComposer={() => setContactModalOpen(true)} />
          </main>
          <PersonalSidebar
            followEnabled={followCursor}
            onToggleFollow={() => setFollowCursor((prev) => !prev)}
            catStatus={catStatus}
            onLaunchGame={(game) => setActiveDosGame(game)}
            activeGame={activeDosGame}
          />
        </div>
        <SiteFooter
          onHome={(event) => {
            event.preventDefault();
            navigateTo('home');
          }}
        />
        <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
        <DosPlayerModal
          isOpen={Boolean(activeDosGame)}
          game={activeDosGame}
          onClose={() => setActiveDosGame(null)}
          onGameChange={(nextGame) => setActiveDosGame(nextGame)}
        />
      </div>
    </>
  );
}
