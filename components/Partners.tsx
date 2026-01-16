
import React from 'react';

interface PartnersProps {
  config: any;
}

const Partners: React.FC<PartnersProps> = ({ config }) => {
  const partners = config.partners || [];

  return (
    <section 
      className="py-24 bg-slate-50 border-y border-gray-100"
      aria-labelledby="partners-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary font-black mb-3">Parceiros de Confiança</p>
          <h2 id="partners-title" className="text-3xl md:text-4xl font-black text-navy-blue">
            Grandes empresas atendidas pelo Grupo Camp
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {partners.map((partner: any, index: number) => (
            <div 
              key={index} 
              className="group flex flex-col items-center gap-4"
              role="img" 
              aria-label={`Parceiro: ${partner.name}`}
            >
              <div className="w-full h-32 md:h-40 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-6 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transform hover:-translate-y-1">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-black text-navy-blue/40 uppercase tracking-widest group-hover:text-navy-blue transition-colors text-center px-2">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
