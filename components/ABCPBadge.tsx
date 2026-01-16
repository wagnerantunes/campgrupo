
import React from 'react';

interface ABCPBadgeProps {
  config: any;
}

const ABCPBadge: React.FC<ABCPBadgeProps> = ({ config }) => {
  const abcp = config.abcp;
  if (!abcp) return null;

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
        <div className="bg-navy-blue p-6 rounded-xl shadow-lg border border-navy-light flex items-center justify-center min-w-[160px]">
          {abcp.logo ? (
            <img src={abcp.logo} alt="ABCP" className="h-16 w-auto object-contain" />
          ) : (
            <span className="text-primary font-black text-4xl italic tracking-tighter">ABCP</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black mb-2 text-navy-blue">{abcp.title}</h3>
          <p className="text-gray-600 max-w-2xl font-medium">
            {abcp.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ABCPBadge;