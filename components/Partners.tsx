
import React from 'react';

const Partners: React.FC = () => {
  // URLs representativas das logos baseadas na imagem fornecida
  const partners = [
    { name: 'MRV', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Logo_MRV_Engenharia.svg/512px-Logo_MRV_Engenharia.svg.png', class: 'h-10' },
    { name: 'Direcional', logo: 'https://logodownload.org/wp-content/uploads/2019/10/direcional-engenharia-logo.png', class: 'h-8' },
    { name: 'Equipav', logo: 'https://www.equipav.com.br/wp-content/uploads/2018/06/logo-equipav.png', class: 'h-10' },
    { name: 'Grupo Estrutural', logo: 'https://grupoestrutural.com.br/wp-content/themes/estrutural/assets/img/logo.png', class: 'h-12' },
    { 
      name: 'BRZ Empreendimentos', 
      logo: 'https://brzempreendimentos.com.br/assets/images/logo-brz.png', 
      class: 'h-16 bg-[#e1e600] p-2 rounded-sm',
      isSpecial: true
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black mb-2">Parceiros de Confiança</p>
          <h2 className="text-2xl font-extrabold text-slate-teal">Grandes empresas atendidas pelo Grupo Camp</h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24 opacity-80 hover:opacity-100 transition-opacity">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center gap-2 group">
              <div className={`flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <img 
                  src={partner.logo} 
                  alt={`Logo ${partner.name}`} 
                  className={`${partner.class} object-contain`}
                />
              </div>
              {partner.isSpecial && (
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                  Empreendimentos
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
