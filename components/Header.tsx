
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-navy-blue text-primary p-2 rounded-lg">
            <span className="material-symbols-outlined text-3xl fill-1">foundation</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight leading-none text-navy-blue">GRUPO CAMP</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-black bg-navy-blue px-1 mt-1 rounded-sm w-fit">Indústria</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {['Início', 'Produtos', 'Quem Somos', 'Depoimentos', 'Orçamentos'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-bold text-navy-blue hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 bg-navy-blue text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-navy-light transition-all shadow-lg shadow-navy-blue/10">
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            WhatsApp
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;