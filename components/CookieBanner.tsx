import React, { useState, useEffect } from 'react';

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onReject }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('camp_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('camp_consent', 'granted');
    setShow(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('camp_consent', 'denied');
    setShow(false);
    onReject();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 md:p-8 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h4 className="text-navy-blue font-black text-lg mb-2">Sua privacidade é importante</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Utilizamos cookies para personalizar anúncios, melhorar sua experiência no site e analisar nosso tráfego (Google Analytics e Google Ads). 
            Ao clicar em "Aceitar", você concorda com o uso de todos os cookies.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={handleReject}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Apenas Necessários
          </button>
          <button 
            onClick={handleAccept}
            className="px-8 py-2.5 rounded-lg text-sm font-bold bg-navy-blue text-white hover:bg-navy-light shadow-lg transition-all"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
