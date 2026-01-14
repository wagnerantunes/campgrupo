
import React from 'react';

const LocationsBar: React.FC = () => {
  const cities = ['Campinas', 'Sumaré', 'Hortolândia', 'Paulínia', 'Valinhos', 'Vinhedo'];

  return (
    <div className="bg-navy-blue text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-primary fill-1">distance</span>
          <span className="text-lg font-bold">Entrega garantida em:</span>
        </div>
        <div className="flex-1 flex flex-wrap justify-center md:justify-around items-center gap-x-8 gap-y-4 text-sm font-black tracking-widest opacity-90 uppercase">
          {cities.map((city, idx) => (
            <React.Fragment key={city}>
              <span className="hover:text-primary transition-colors cursor-default">{city}</span>
              {idx < cities.length - 1 && <span className="hidden md:block text-primary/30">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationsBar;