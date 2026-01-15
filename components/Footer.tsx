
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  config: any;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const footer = config.footer;
  if (!footer) return null;

  return (
    <footer className="bg-background-dark text-white pt-24 pb-12" id="orcamentos">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary text-navy-blue p-2 rounded-lg">
              <span className="material-symbols-outlined text-3xl fill-1">{config.logo.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white">{config.logo.text}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-black">{config.logo.subtext}</span>
            </div>
          </div>
          <p className="text-blue-100/60 max-w-md mb-8 leading-relaxed font-medium">
            {config.about.description1}
          </p>
          <div className="flex gap-4">
              {footer.social?.facebook && (
                <a 
                    href={footer.social.facebook} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-navy-blue transition-all text-white/40"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.791 1.606-2.791 2.87v1.102h3.745l-.537 3.667h-3.208v7.98h-4.997z"></path></svg>
                  </a>
              )}
              {footer.social?.instagram && (
                <a 
                  href={footer.social.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-navy-blue transition-all text-white/40"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
              )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-black border-b border-primary/30 pb-2 inline-block self-start">Contato</h4>
          <div className="flex flex-col gap-4 text-blue-100/60 text-sm font-medium whitespace-pre-line">
            <p className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary fill-1">location_on</span>
              {footer.address}
            </p>
            <p className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary fill-1">phone</span>
               <a href={`tel:${footer.phone.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">
                  {footer.phone}
               </a>
            </p>
            <p className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary fill-1">mail</span>
              {footer.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-black border-b border-primary/30 pb-2 inline-block self-start">Horário</h4>
          <div className="flex flex-col gap-2 text-blue-100/60 text-sm">
            <p className="flex justify-between gap-4"><span>Seg - Sex:</span> <span className="text-white font-bold">{footer.hours?.weekdays}</span></p>
            <p className="flex justify-between gap-4"><span>Sáb:</span> <span className="text-white font-bold">{footer.hours?.saturday}</span></p>
            <a 
              href={`https://wa.me/${footer.whatsapp}?text=Ol%C3%A1%2C%20vim%20atraves%20do%20site%20e%20gostaria%20de%20um%20or%C3%A7amento%20por%20favor`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-primary text-navy-blue py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all uppercase tracking-widest shadow-lg shadow-primary/10 text-center"
            >
              WhatsApp Direto
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12 py-8 border-y border-white/5">
        <h5 className="text-[10px] uppercase tracking-widest text-white/20 font-black mb-4">Região de Atendimento</h5>
        <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-tighter">
          {footer.regions}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-white/20 font-bold uppercase">
          {footer.copyright.replace('{year}', new Date().getFullYear().toString())}
        </p>
        <div className="flex gap-8 text-[10px] text-white/20 font-black uppercase tracking-widest">
          <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
          <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;