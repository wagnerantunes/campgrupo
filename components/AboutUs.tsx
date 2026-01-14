
import React from 'react';

const AboutUs: React.FC = () => {
  const features = [
    { icon: 'factory', label: 'Fabricação própria' },
    { icon: 'bolt', label: 'Entrega rápida' },
    { icon: 'sell', label: 'Preços de fábrica' },
    { icon: 'credit_card', label: 'Parcelamento facilitado' },
    { icon: 'groups', label: 'PF e PJ' },
    { icon: 'inventory_2', label: 'Pronta entrega' },
  ];

  const industrialImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAzU0Pd8zaJyZ3r1pwLW_duFO2GU8Wa3QRCjIZuGuRz3u08sjPhjay9Ux-FR9XFVyq4NtUcDf90y5v-c9r7FS4ChfQ_83A1AScnyzk69YVUx1yYYWSUNJA8x6HT0ouhqIewy6VHB8xPbHAhQMB7eOLQx732F1TqVD9rZ_xYfQgG0kvsgAeH2lIiOQQ7GrKAuiEE5kr7cleyl_mA5UDQjrOjbjasJ2hBAywyPc8K1t1ctn5IJaM2y7FoOUuEM25A5qaPHlYMOkvG18jF";

  return (
    <section className="py-24 bg-white overflow-hidden" id="quem-somos">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-navy-blue font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="w-8 h-[2px] bg-primary"></span>
                Sobre o Grupo Camp
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-navy-blue leading-tight">Excelência em cada etapa</h2>
            </div>
            
            <div className="flex flex-col gap-4 text-gray-700 text-lg leading-relaxed">
              <p>
                No Grupo Camp, somos especialistas na fabricação de blocos de concreto e pisos intertravados com alto padrão de qualidade. Nossos produtos são paletizados e conferidos para garantir segurança e agilidade no canteiro de obras.
              </p>
              <p className="text-gray-600">
                Localizados estrategicamente em Monte Mor, atendemos toda a região de Campinas com frota própria e suporte técnico especializado, seja para pequenas reformas ou grandes empreendimentos imobiliários.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {features.map((f, i) => (
                <div key={i} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 border-b-4 border-b-transparent hover:border-b-primary">
                  <div className="w-12 h-12 rounded-full bg-navy-blue text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined fill-1">{f.icon}</span>
                  </div>
                  <span className="font-bold text-sm text-navy-blue leading-tight">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <div 
                className="h-[600px] bg-center bg-cover" 
                style={{ backgroundImage: `url('${industrialImage}')` }}
              ></div>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-navy-blue text-white p-8 rounded-2xl shadow-xl z-20">
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-black text-primary">Sede Monte Mor</span>
                <p className="text-sm font-bold uppercase tracking-widest opacity-70">Estrutura Industrial Completa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;