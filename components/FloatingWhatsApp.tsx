
import React from 'react';

interface FloatingWhatsAppProps {
  config: any;
}

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ config }) => {
  const whatsapp = config.footer?.whatsapp || '551939096852';
  
  return (
    <a 
      href={`https://wa.me/${whatsapp}?text=Ol%C3%A1%2C%20vim%20atraves%20do%20site%20e%20gostaria%20de%20um%20or%C3%A7amento%20por%20favor`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if ((window as any).trackConversion) {
          (window as any).trackConversion('Contact', {
            method: 'WhatsApp',
            location: 'floating_button'
          });
        }
      }}
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      aria-label="Falar com um especialista no WhatsApp"
    >
      <div className="absolute right-full mr-4 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Falar com um especialista
      </div>
      <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.526-2.961-2.642-.087-.116-.708-.941-.708-1.797 0-.856.448-1.277.607-1.45.16-.174.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.101-.177.211-.077.385.101.174.448.739.961 1.196.661.587 1.216.768 1.39.854.174.087.274.072.376-.043.101-.116.434-.506.549-.68.116-.174.231-.144.39-.087.158.058 1.012.477 1.184.564.174.087.289.13.332.202.043.072.043.419-.101.824z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2.05 22l4.987-1.31c1.453.818 3.125 1.31 4.963 1.31 5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.63 0-3.13-.42-4.43-1.16l-.32-.18-2.97.78.8-2.89-.2-.32A7.957 7.957 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" fillRule="evenodd" />
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
