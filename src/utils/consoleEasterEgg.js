/**
 * DevTools Console Easter Egg
 * Outputs a retro Monokai ASCII banner and exposes playful helper commands on window.aatir
 */

export function initConsoleEasterEgg({ onToggleCrt, onLaunchArcade, onOpenComposer }) {
  if (typeof window === 'undefined') return;

  // Prevent duplicate execution
  if (window.__AATIR_CONSOLE_INITIALIZED__) return;
  window.__AATIR_CONSOLE_INITIALIZED__ = true;

  const asciiBanner = `
    _    _  _____ ___ ____     _   _    _    ____ ___ __  __ 
   / \\  / \\|_   _|_ _|  _ \\   | \\ | |  / \\  |  _ \\_ _|  \\/  |
  / _ \\/ _ \\ | |  | || |_) |  |  \\| | / _ \\ | | | | || |\\/| |
 / ___ / ___ \\| |  | ||  _ <   | |\\  |/ ___ \\| |_| | || |  | |
/_/   /_/   \\_|_| |___|_| \\_\\  |_| \\_/_/   \\_|____/___|_|  |_|
`;

  const bannerStyle = [
    'color: #a6e22e',
    'background: #1e1f1c',
    'font-family: monospace',
    'font-size: 11px',
    'font-weight: bold',
    'padding: 8px 12px',
    'line-height: 1.2',
  ].join(';');

  const titleStyle = [
    'color: #f92672',
    'background: #1e1f1c',
    'font-family: monospace',
    'font-size: 12px',
    'font-weight: bold',
    'padding: 4px 12px',
  ].join(';');

  const textStyle = [
    'color: #d6d4c5',
    'background: #1e1f1c',
    'font-family: monospace',
    'font-size: 11px',
    'padding: 2px 12px',
  ].join(';');

  const accentStyle = [
    'color: #e6db74',
    'background: #1e1f1c',
    'font-family: monospace',
    'font-size: 11px',
    'padding: 2px 12px',
  ].join(';');

  // Log to console
  console.log(`%c${asciiBanner}`, bannerStyle);
  console.log('%c[ AN_ WORKSTATION // CONSOLE RUNTIME ]', titleStyle);
  console.log('%cTracing systems, low-level storage, and cloud infrastructure.', textStyle);
  console.log('%cType aatir.help() in this console to inspect available commands.', accentStyle);

  // Expose interactive commands on window.aatir
  window.aatir = {
    help: () => {
      console.table([
        { Command: 'aatir.bio()', Description: 'Display quick professional overview' },
        { Command: 'aatir.skills()', Description: 'List core technical competencies' },
        { Command: 'aatir.resume()', Description: 'Open official PDF résumé in new tab' },
        { Command: 'aatir.contact()', Description: 'Get direct contact email & links' },
        { Command: 'aatir.arcade()', Description: 'Launch retro DOS game emulator' },
        { Command: 'aatir.crt()', Description: 'Toggle retro CRT scanline mode' },
        { Command: 'aatir.cat()', Description: 'Send love to the workstation cat' },
        { Command: "aatir.where('zoro')", Description: 'Try to locate the lost swordsman' },
      ]);
      return 'Command table rendered above.';
    },
    bio: () => {
      console.log(
        '%cAatir Nadim — Software Engineer specializing in backend systems, distributed storage, and cloud infrastructure.',
        'color: #a6e22e; font-family: monospace; font-size: 12px;'
      );
      return 'Systems thinking / on purpose.';
    },
    skills: () => {
      console.log(
        '%cLanguages: Go, Java, Kotlin, Scala, SQL\nCloud: AWS, Terraform, Docker, CI/CD\nObservability: OpenTelemetry, Prometheus, Grafana, Loki',
        'color: #e6db74; font-family: monospace; font-size: 12px;'
      );
      return 'Core competencies listed above.';
    },
    resume: () => {
      console.log('%cOpening official résumé PDF: /Aatir_Nadim_Resume.pdf', 'color: #e6db74; font-family: monospace; font-size: 12px;');
      window.open('/Aatir_Nadim_Resume.pdf', '_blank');
      return 'Opened /Aatir_Nadim_Resume.pdf in new tab.';
    },
    contact: () => {
      console.log(
        '%cDirect Email: aatir.nadim@gmail.com\nLinkedIn: https://www.linkedin.com/in/aatirnadim/\nGitHub: https://github.com/AatirNadim',
        'color: #ae81ff; font-family: monospace; font-size: 12px;'
      );
      onOpenComposer?.();
      return 'Contact modal opened on screen.';
    },
    arcade: () => {
      onLaunchArcade?.();
      return 'Arcade modal launched.';
    },
    crt: () => {
      onToggleCrt?.();
      return 'Toggled CRT scanline overlay.';
    },
    cat: () => {
      console.log('%c=^._.^= ∫  Purrrrr! The workstation cat acknowledges your friendship.', 'color: #f92672; font-size: 14px; font-weight: bold;');
      return 'Purr mode engaged.';
    },
    where: (name = 'zoro') => {
      if (String(name).trim().toLowerCase() !== 'zoro') {
        return `No location data for ${name}.`;
      }
      console.log('%c↖ ZORO // LAST SEEN HEADING AWAY FROM THE EXIT', 'color: #a6e22e; background: #1e1f1c; font: bold 11px monospace; padding: 4px 8px;');
      return 'Location unknown. Last seen heading away from the exit.';
    },
  };
}
