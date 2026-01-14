
import React from 'react';

interface Product {
  title: string;
  description: string;
  image: string;
  tag?: string;
  features: string[];
}

const Products: React.FC = () => {
  const products: Product[] = [
    {
      title: "Concreto Usinado",
      description: "Controle de laboratório rigoroso, ideal para lajes e pilares com dosagem exata.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAQABhiunxHfWYh3ocRSZmE0CGV78dtyXeAATZu5U-KuIKfhucaqrBncLgGp6sZcBtDugDFvLeMeAIB0sw1El2f6fg1X18hQBWqxl6kVvxRJu_Q0hEj8Kfozpv0XwaGU2qYrWgnrlL6fuzIenUODc2SAJQ-eT8ifX5U3n1Sh1PTAXap4VlKbd0oBp-RRR1bpFx9jrhuLHul6v5bywju4IqbyRsBDyVhGGDlIUeh6QjoGDPEqsLCjGjLzifqVi4TUuHTNNLVXMKif0Q",
      tag: "DESTAQUE",
      features: ["Dosagem Eletrônica", "FCK Garantido"]
    },
    {
      title: "Blocos de Concreto",
      description: "Alta resistência e acabamento uniforme para economia de argamassa e tempo.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDbiRetCSL20EoDfXnlI_mcXOhjjEjRooDia7AYGSYf-l93hiBdl-tCsFkGPIrBig4sS7IJNav4-IKle9J61DSNLhe1H3U0X4xGLpYqxaIpWsbr6JXDzg2U_aWmhSgaG5kxeoZkU35BXx91bBWdpZr_j0q_lJWOrk_bWR0HFeVHfdnCwLBnC8Uz05xfudcR5qkMNNHzO1UYLEN9B_lmRICx1xXC5rD9imkKF0NxheC-0JmnU54aj8FbCC5AkiejVY3cdeYhMQjXV_9",
      tag: "FABRICAÇÃO PRÓPRIA",
      features: ["Padrão ABNT", "Paletizado"]
    },
    {
      title: "Piso Intertravado",
      description: "Sustentabilidade e estética para pátios, calçadas e garagens industriais.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYw23YsbsO7c99wo6ga4sZnAGOBExOI_iOtEbpCAZtxDgOT0-Uensx_nqazSPp_S9VpeUZI_zKit45oDM3pdv0su84A22dT8sC783vmB5eqp6bN0a79pW1adVDIzHkwPvJGkxipP092jt-05BvTQnGD2yludEsDztjyqsi1cWh8xPZ6QmWYlZuaJoJsI5GM4CDbZ5LJ47zLNTC7RQygOpkqtr0TXFKW5Nmj-6_Zi3tloGw6DvUkYqiSuuX6DRSxupa_DPJGGMMkmrf",
      features: ["Alta Drenagem", "Resistente"]
    }
  ];

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
                <div 
                  className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-500" 
                  style={{ backgroundImage: `url('${p.image}')` }}
                ></div>
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
                <button className="mt-4 w-full bg-navy-blue text-white py-3 rounded-lg font-bold hover:bg-navy-light transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">description</span>
                  Orçamento Grátis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;