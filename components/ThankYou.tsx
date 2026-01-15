import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ThankYou: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full border border-gray-100">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-navy-blue mb-4">
          Obrigado!
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Recebemos sua solicitação com sucesso. <br/>
          Nossa equipe entrará em contato em breve para apresentar o orçamento.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            to="/" 
            className="w-full bg-navy-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-navy-light transition-all shadow-lg active:scale-[0.98]"
          >
            Voltar para o Início
          </Link>
          
          <p className="text-xs text-gray-400 mt-2">
            Em caso de urgência, chame no WhatsApp: <br/>
            <a href="https://wa.me/551939096852" className="text-primary font-bold hover:underline">(19) 3909 6852</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
