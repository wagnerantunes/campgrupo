
import React from 'react';

interface EfficiencyCTAProps {
  config: {
    image: string;
  };
}

const EfficiencyCTA: React.FC<EfficiencyCTAProps> = ({ config }) => {
  const concreteImage = config.image;

  return (
    <section className="relative min-h-[500px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={concreteImage}
          alt="Concreto usinado sendo aplicado"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navy Blue Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a1a6b]/40 via-[#0a1a6b]/80 to-[#0a1a6b]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-20 w-full flex justify-end">
        <div className="max-w-xl flex items-stretch gap-6">
          {/* Yellow Vertical Bar */}
          <div className="w-1.5 bg-yellow-500 rounded-full"></div>

          <div className="py-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Grupo Camp une qualidade, custo-benefício e eficiência para a sua obra!
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EfficiencyCTA;
