
import React from 'react';

const ServiceAreasCTA: React.FC = () => {
  const constructionImage = "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2000";

  return (
    <section className="relative py-32 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={constructionImage} 
          alt="Obra em andamento" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mustard Yellow Overlay (Matching the image) */}
      <div className="absolute inset-0 bg-yellow-500/90 z-10 backdrop-blur-[1px]"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-20 text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-12 tracking-tight">
          Entrega de materiais de construção em Campinas, Sumaré, Hortolândia, Monte Mor e outras cidades próximas
        </h2>
        
        <div className="flex justify-center">
          <button className="bg-[#0a1a6b] hover:bg-[#06114a] text-white px-12 py-5 rounded-md font-bold text-lg lg:text-xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3">
            Fale Conosco
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreasCTA;
