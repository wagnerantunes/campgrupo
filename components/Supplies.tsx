import React from 'react';
import { optimizeImageUrl } from '../utils/imageOptimizer';

interface SuppliesProps {
  config: any[];
}

const Supplies: React.FC<SuppliesProps> = ({ config }) => {
  const items = config;

  return (
    <section className="py-24 bg-white" id="materiais-basicos">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 mb-16">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1.5 bg-primary rounded-full"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Suprimentos</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-navy-blue">
            Materiais Básicos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((item, i) => (
            <div key={i} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-64 md:h-72 overflow-hidden relative">
                <img
                  src={optimizeImageUrl(item.image, 800)}
                  alt={`${item.name} para construção em Campinas`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-navy-blue mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                  {item.desc}
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                  <a href="#contato" className="text-navy-blue text-sm font-black uppercase tracking-wider hover:text-primary transition-all flex items-center gap-2 group/btn">
                    Consultar Preço 
                    <span className="material-symbols-outlined text-base transform group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Supplies;