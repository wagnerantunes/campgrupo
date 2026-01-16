
import React from 'react';

const Testimonials: React.FC = () => {
  const feedbacks = [
    {
      quote: "O concreto usinado deles é excelente. Chegou no horário marcado e a equipe técnica deu todo o suporte.",
      author: "Ricardo Mendes",
      role: "Engenheiro Civil"
    },
    {
      quote: "Sempre compro blocos com o Grupo Camp. O acabamento é muito bom e quase não temos perdas na obra.",
      author: "Marcos Silveira",
      role: "Construtora MS"
    },
    {
      quote: "Melhor preço de pedra e areia na região. A logística deles é nota dez, nunca atrasaram um pedido.",
      author: "Ana Paula Garcia",
      role: "Gestora de Obras"
    }
  ];

  return (
    <section className="py-24 bg-gray-50" id="depoimentos">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 text-navy-blue">Confiança de quem constrói</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {feedbacks.map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-2xl shadow-lg border border-gray-50 relative group border-t-4 border-t-transparent hover:border-t-navy-blue transition-all">
              <span className="material-symbols-outlined absolute top-8 right-8 text-navy-blue/5 text-6xl group-hover:text-primary/20 transition-colors">format_quote</span>
              <div className="flex gap-1 mb-4 text-primary">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined fill-1 text-xl">star</span>
                ))}
              </div>
              <p className="text-gray-600 italic mb-8 relative z-10 leading-relaxed font-medium">"{f.quote}"</p>
              <div>
                <p className="font-black text-navy-blue">{f.author}</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{f.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;