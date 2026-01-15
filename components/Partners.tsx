
import React from 'react';

interface PartnersProps {
  config: any;
}

const Partners: React.FC<PartnersProps> = ({ config }) => {
  const partners = config.partners || [];

  return (
    <section 
      className="py-20 bg-white border-b border-gray-100"
      aria-labelledby="partners-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-3">Parceiros de Confiança</p>
          <h2 id="partners-title" className="text-3xl font-black text-navy-blue">
            Grandes empresas atendidas pelo Grupo Camp
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 lg:gap-x-24">
          {partners.map((partner: any, index: number) => (
            <div 
              key={index} 
              className="flex flex-col items-center gap-3 group"
              role="img" 
              aria-label={`Parceiro: ${partner.name}`}
            >
              <div className="relative flex items-center justify-center transition-all duration-500 transform group-hover:scale-110">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="h-14 md:h-20 w-auto object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                />
              </div>
              {partner.name === 'BRZ Empreendimentos' && (
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 group-hover:text-primary transition-colors">
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
