import { useEffect, useState } from 'react';
import ExperienceSection from './components/ExperienceSection.jsx';
import ExpertiseSection from './components/ExpertiseSection.jsx';
import Introduction from './components/Introduction.jsx';
import NavigationRail from './components/NavigationRail.jsx';
import PersonalSidebar from './components/PersonalSidebar.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import StarfieldBackground from './components/StarfieldBackground.jsx';

export default function App() {
  const [active, setActive] = useState('home');
  const [navOpen, setNavOpen] = useState(false);
  const [time, setTime] = useState(new Date());

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
    <div className="relative z-[1] mx-auto w-[calc(100%-20px)] max-w-[1360px] pt-[10px] sm:w-[calc(100%-28px)] sm:pt-[14px] lg:w-[calc(100%-64px)] lg:pt-[30px]">
      <a href="#main" className="fixed left-[-10000px] top-[10px] z-50 bg-yellow p-[10px] text-surface focus:left-[10px]">Skip to content</a>
      <SiteHeader time={time} navOpen={navOpen} onToggleNavigation={() => setNavOpen((open) => !open)} onHome={(event) => { event.preventDefault(); navigateTo('home'); }}/>
      <div className="grid grid-cols-1 items-start gap-3 pt-[14px] lg:grid-cols-[200px_minmax(0,1fr)_258px] lg:gap-[22px] lg:pt-6">
        <NavigationRail open={navOpen} active={active} time={time} onNavigate={navigateTo}/>
        <main id="main" tabIndex="-1" className="order-first min-w-0 focus:outline-none lg:order-none">
          <Introduction onExplore={() => navigateTo('work')}/>
          <ProjectsSection/>
          <ExperienceSection/>
          <ExpertiseSection/>
        </main>
        <PersonalSidebar/>
      </div>
      <SiteFooter onHome={(event) => { event.preventDefault(); navigateTo('home'); }}/>
    </div>
    </>
  );
}
