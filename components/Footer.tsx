
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark text-white pt-24 pb-12" id="orcamentos">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary text-navy-blue p-2 rounded-lg">
              <span className="material-symbols-outlined text-3xl fill-1">foundation</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white">GRUPO CAMP</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-black">Excelência Industrial</span>
            </div>
          </div>
          <p className="text-blue-100/60 max-w-md mb-8 leading-relaxed font-medium">
            Líder no fornecimento de <strong>Concreto Usinado</strong> e <strong>Blocos de Concreto</strong> na região de Campinas. Qualidade que sustenta sua obra com segurança.
          </p>
          <div className="flex gap-4">
            {['share', 'photo_camera', 'video_library'].map((icon) => (
              <a 
                key={icon}
                href="#" 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-navy-blue transition-all text-white/40"
              >
                <span className="material-symbols-outlined text-xl">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-black border-b border-primary/30 pb-2 inline-block self-start">Contato</h4>
          <div className="flex flex-col gap-4 text-blue-100/60 text-sm font-medium">
            <p className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary fill-1">location_on</span>
              Estrada Municipal Mor, 377<br />Monte Mor - SP
            </p>
            <p className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary fill-1">phone</span>
              19 3909-6852
            </p>
            <p className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary fill-1">mail</span>
              vendas@campgrupo.com.br
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-black border-b border-primary/30 pb-2 inline-block self-start">Horário</h4>
          <div className="flex flex-col gap-2 text-blue-100/60 text-sm">
            <p className="flex justify-between"><span>Seg - Sex:</span> <span className="text-white font-bold">07:00 - 18:00</span></p>
            <p className="flex justify-between"><span>Sáb:</span> <span className="text-white font-bold">07:00 - 12:00</span></p>
            <button className="mt-4 bg-primary text-navy-blue py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all uppercase tracking-widest shadow-lg shadow-primary/10">
              WhatsApp Direto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12 py-8 border-y border-white/5">
        <h5 className="text-[10px] uppercase tracking-widest text-white/20 font-black mb-4">Região de Atendimento</h5>
        <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-tighter">
          Campinas • Sumaré • Hortolândia • Valinhos • Paulínia • Vinhedo • Monte Mor • Indaiatuba • Concreto Usinado Preço • Fábrica de Blocos • Piso Intertravado Calçada • Materiais de Construção Atacado.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-white/20 font-bold uppercase">© 2024 Grupo Camp. Indústria e Comércio de Blocos e Pisos.</p>
        <div className="flex gap-8 text-[10px] text-white/20 font-black uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
          <a href="#" className="hover:text-primary transition-colors">Termos</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;