import { optimizeImageUrl } from '../utils/imageOptimizer';

import React from 'react';

interface Product {
  title: string;
  description: string;
  image: string;
  tag?: string;
  features: string[];
}

interface ProductsProps {
  config: Product[];
}

const Products: React.FC<ProductsProps> = ({ config }) => {
  const products = config;

  return (
    <section className="py-24 bg-gray-50/50" id="produtos">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 mb-16">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1.5 bg-primary rounded-full"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Catálogo</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-navy-blue">
            Nossos Principais Produtos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((p, i) => (
            <div key={i} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={optimizeImageUrl(p.image, 800)}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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