
import React from 'react';

interface HeaderProps {
  config: any;
}

const Header: React.FC<HeaderProps> = ({ config }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const logo = config.logo;
  const footer = config.footer;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background-dark/95 backdrop-blur-md border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          {logo.logoUrl ? (
            <img 
              src={logo.logoUrl} 
              alt={logo.text} 
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          ) : (
            <>
              <div className="bg-primary text-navy-blue p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl fill-1">{logo.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">{logo.text}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-black mt-0.5">{logo.subtext}</span>
              </div>
            </>
          )}
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {(config.header?.navLinks || []).map((item: any) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${footer?.whatsapp}?text=Ol%C3%A1%2C%20vim%20atraves%20do%20site%20e%20gostaria%20de%20um%20or%C3%A7amento%20por%20favor`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-navy-blue px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined text-lg fill-1">chat_bubble</span>
            WhatsApp
          </a>
        </div>
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden text-white hover:text-primary transition-colors p-2"
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-navy-blue/95 backdrop-blur-xl z-40 lg:hidden transition-all duration-300 flex flex-col items-center justify-center gap-8 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>

        <nav className="flex flex-col items-center gap-8">
          {(config.header?.navLinks || []).map((item: any) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-widest text-white hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${footer?.whatsapp}?text=Ol%C3%A1%2C%20vim%20atraves%20do%20site%20e%20gostaria%20de%20um%20or%C3%A7amento%20por%20favor`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-primary text-navy-blue px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-2xl fill-1">chat_bubble</span>
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;