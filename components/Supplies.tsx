
import React from 'react';

const Supplies: React.FC = () => {
  const items = [
    {
      name: "Areia",
      desc: "Lavada e pronta para reboco ou concreto de alta resistência.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_lgjd08KjSIKrsO2H8sLzCJtL0oLBH1QIVGohu3j0u47KFfo1C_XRv5ws6mhJW4MvFC7tU7KZzfyB50rxzqw42JIBxxalTdqLkZ4oENLLFrdrPI75sX1WoLyQad3XOnUs2iCYkICEFjbe9KHm2UMsg76VX40kuNey5gvIt6MoGu1PputjQ1dS-yWby_s4nnDYYIJXtYUQ3fBHcMWoP55DkzOTt2Fpc4e_ImuEId84C-Z-zsyu3KkC02y00CQoQYmo5xGWCU5NyLr"
    },
    {
      name: "Pedra",
      desc: "Britas 0, 1 e 2 para diferentes finalidades estruturais.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBySydLjAzbFVfpTKf14IYJgAcdBgnVVL0Pc44obv5hiX-UsIFdwzV6pqpTFO5wUT9YX8tJKIYtrLJPW9bheVASAafC0r4hd5PiSqmu5jOGhI_SLYVAUkwa6R8CKd3a0Wz3LClKRfC6ntHiTgOnzYCvDmJdATchWCfUyiH1wpRTSBIg-_b6PB4tw80d3LKEYWyuUoFt2QMjPsd84VCeONV3mQ7zzlkTGLBo4sCTBfpe2rmMlHORZWYJIG9xZ5c0zNEHEpto1f05omOo"
    },
    {
      name: "Cimento",
      desc: "As melhores marcas (CP-II e CP-III) com entrega imediata.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0-HplnivxPYtbengZsUXCyWVd_GDi9rWublQc4b5w-1LxsHVUwU5gpPjKvf4DD2eNjDCZhDkNVFk5y6wEb7NtMhHaDXj7b70vd8zNgXAHfpGEWNvJ4r2QRB2W5jtfxz9trQp5TCEJRqlqUPiKQMrr-iLrVvsM1hb6mCBmwdXxGktjSNc90oDAAWn8Z7ckF3Gmzf0OW3j8j314CTuGfTf6r0ZotNqY5BpK_KV70fwbyz8mXfwRerjMPhPUlNrUzS8AcXPaXmF2fvLV"
    }
  ];

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
                <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${item.image}')` }}></div>
              </div>
              <div>
                <h4 className="font-bold text-lg text-navy-blue">{item.name}</h4>
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