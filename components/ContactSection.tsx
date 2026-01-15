import React, { useState } from 'react';
import API_URL from '../config/api';
import toast from 'react-hot-toast';

const ContactSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
        toast.error('Por favor, preencha nome e WhatsApp.');
        return;
    }

    setLoading(true);
    const toastId = toast.loading('Enviando mensagem...');

    try {
        const response = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            toast.success('Mensagem enviada com sucesso!', { id: toastId });
            setFormData({ name: '', phone: '', message: '' });
        } else {
            toast.error('Erro ao enviar. Tente novamente.', { id: toastId });
        }
    } catch (error) {
        console.error(error);
        toast.error('Erro de conexão.', { id: toastId });
    } finally {
        setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white" id="contato">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {/* Logo Placeholder - Representing the G logo from image */}
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 flex items-center justify-center">
                   <span className="text-6xl font-black text-[#0a1a6b] leading-none">G</span>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-yellow-400 mt-1"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#0a1a6b] tracking-tighter leading-none">GRUPO CAMP</span>
                  <span className="text-[9px] uppercase tracking-[0.1em] text-gray-500 font-bold">Indústria e Comércio de Blocos e Pisos</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1a6b] leading-tight max-w-md">
                Procurando produtos para sua obra? Solicite seu orçamento!
              </h2>
              
              <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-lg">
                Entre em contato conosco para solicitar um orçamento ou fazer seu pedido. 
                Nossa equipe está pronta para atendê-lo com rapidez e eficiência!
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4 group">
                <div className="text-[#0a1a6b] mt-1">
                  <span className="material-symbols-outlined fill-1">location_on</span>
                </div>
                <p className="text-gray-700 font-semibold leading-relaxed">
                  Estrada Municipal Mor, 377, S/N Aterrado – Monte Mor/SP CEP 13190-121
                </p>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="text-[#0a1a6b]">
                  <span className="material-symbols-outlined fill-1">mail</span>
                </div>
                <p className="text-gray-700 font-semibold">
                  vendas@campgrupo.com.br
                </p>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="text-[#0a1a6b]">
                  <span className="material-symbols-outlined fill-1">call</span>
                </div>
                <p className="text-gray-700 font-semibold">
                  19 3909 6852
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="relative">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <h3 className="text-2xl md:text-3xl font-black text-[#0a1a6b] mb-10">
                Entre em contato conosco
              </h3>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <input 
                    type="text" 
                    placeholder="Nome" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-4 text-gray-700 focus:ring-1 focus:ring-[#0a1a6b] focus:border-[#0a1a6b] transition-all outline-none placeholder:text-gray-300"
                    required
                  />
                </div>

                <div>
                  <input 
                    type="tel" 
                    placeholder="Telefone/Whatsapp" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-4 text-gray-700 focus:ring-1 focus:ring-[#0a1a6b] focus:border-[#0a1a6b] transition-all outline-none placeholder:text-gray-300"
                    required
                  />
                </div>

                <div>
                  <textarea 
                    placeholder="Mensagem" 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-4 text-gray-700 focus:ring-1 focus:ring-[#0a1a6b] focus:border-[#0a1a6b] transition-all outline-none resize-none placeholder:text-gray-300"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#11237c] hover:bg-[#0a1a6b] text-white py-4 rounded-md font-bold text-lg transition-all shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
