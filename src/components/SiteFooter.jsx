export default function SiteFooter({ onHome }) {
  return (
    <footer className="mb-5 mt-[10px] flex min-h-[49px] flex-wrap items-center justify-between gap-3 border-t border-line px-3 py-3 font-mono text-[8px] text-[#aaa897]">
      <span>© 2026 AATIR NADIM</span>
      <span className="order-3 w-full text-center sm:order-none sm:w-auto">HAND-ASSEMBLED WITH <b className="font-medium text-lime">REACT</b> + VITE <span className="text-pink">♥</span></span>
      <a href="#home" onClick={onHome} className="text-yellow hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow">BACK TO TOP ↑</a>
    </footer>
  );
}
