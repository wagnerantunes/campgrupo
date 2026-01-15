
import React from 'react';

interface PartnersProps {
  config: any;
}

const Partners: React.FC<PartnersProps> = ({ config }) => {
  const partners = config.partners || [];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black mb-2">Parceiros de Confiança</p>
          <h2 className="text-2xl font-extrabold text-slate-teal">Grandes empresas atendidas pelo Grupo Camp</h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24 opacity-80 hover:opacity-100 transition-opacity">
          {partners.map((partner: any, index: number) => (
            <div key={index} className="flex flex-col items-center gap-2 group">
              <div className={`flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <img 
                  src={partner.logo} 
                  alt={`Logo ${partner.name}`} 
                  className={`h-10 object-contain`}
                />
              </div>
              {partner.name === 'BRZ Empreendimentos' && (
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
