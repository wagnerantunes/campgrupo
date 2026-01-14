
import React from 'react';

const ABCPBadge: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
        <div className="bg-navy-blue p-6 rounded-xl shadow-lg border border-navy-light flex items-center justify-center min-w-[160px]">
          <span className="text-primary font-black text-4xl italic tracking-tighter">ABCP</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black mb-2 text-navy-blue">Compromisso com a Qualidade Técnica</h3>
          <p className="text-gray-600 max-w-2xl font-medium">
            Nossos processos seguem rigorosamente os padrões da Associação Brasileira de Cimento Portland. 
            Garantimos que cada material entregue atenda aos critérios de segurança e durabilidade exigidos pelas normas técnicas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ABCPBadge;