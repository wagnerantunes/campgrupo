
import React from 'react';

interface Product {
  title: string;
  description: string;
  image: string;
  tag?: string;
  features: string[];
}

interface ProductsProps {
  config: any[];
}

const Products: React.FC<ProductsProps> = ({ config }) => {
  const products = config;

  return (
    <section className="py-24 bg-gray-50" id="produtos">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-blue">Nossos Produtos</h2>
            <p className="text-gray-600 max-w-xl font-medium">Linha completa de materiais estruturais com o melhor custo-benefício da região.</p>
          </div>
          <button className="text-navy-blue font-black flex items-center gap-2 hover:text-navy-light transition-colors">
            Catálogo Completo <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <div key={i} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={p.image}
                  alt={`${p.title} - Grupo Camp`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {p.tag && (
                  <div className="absolute top-4 right-4 bg-navy-blue text-primary text-[10px] font-black px-2 py-1 rounded shadow-md uppercase tracking-wider">
                    {p.tag}
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-navy-blue">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                <ul className="text-xs font-bold text-navy-blue flex flex-wrap gap-x-4 gap-y-2">
                  {p.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary fill-1">check_circle</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a href="#contato" className="mt-4 w-full bg-navy-blue text-white py-3 rounded-lg font-bold hover:bg-navy-light transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">description</span>
                  Orçamento Grátis
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;