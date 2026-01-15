
import React from 'react';

interface SuppliesProps {
  config: any[];
}

const Supplies: React.FC<SuppliesProps> = ({ config }) => {
  const items = config;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-black mb-12 flex items-center gap-3 text-navy-blue">
          <span className="w-12 h-1 bg-primary rounded"></span>
          Materiais Básicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-6 border border-gray-100 rounded-xl bg-gray-50 hover:bg-primary/5 transition-all">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  src={item.image}
                  alt={`${item.name} para construção em Campinas`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-navy-blue">{item.name}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                <button className="mt-3 text-navy-blue text-xs font-black uppercase tracking-wider hover:text-navy-light underline decoration-primary decoration-2 underline-offset-4">Consultar Preço</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Supplies;