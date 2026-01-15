
import React, { useState } from 'react';
import API_URL from '../config/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  config: {
    title: string;
    subtitle: string;
    ctaText: string;
    image: string;
  };
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  const heroImage = config.image;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  });

  const mainProducts = [
    { title: "Concreto Usinado", icon: "precision_manufacturing" },
    { title: "Blocos de Concreto", icon: "grid_view" },
    { title: "Piso Intertravado", icon: "texture" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Por favor, preencha nome e WhatsApp.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Enviando solicitação...');

    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Solicitação recebida!', { id: toastId });
        setFormData({ name: '', phone: '', city: '' });
        navigate('/obrigado');
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
    <section id="inicio" className="relative min-h-[850px] flex items-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-blue/95 via-navy-blue/80 to-navy-blue/40 z-10"></div>
        <div
          className="w-full h-full bg-center bg-cover scale-105 transition-transform duration-[2s]"
          style={{ backgroundImage: `url('${heroImage}')` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 lg:py-24">

        {/* Left Side: SEO Copy & Products */}
        <div className="lg:col-span-7 flex flex-col gap-8 self-center">
          <div className="inline-flex w-fit items-center gap-2 bg-primary/20 border border-primary/30 px-3 py-1 rounded-full text-primary text-xs font-bold uppercase tracking-wider animate-fade-in-up">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Qualidade ABCP Direto da Fábrica
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight whitespace-pre-line">
            {config.title || "Força e precisão para sua obra pesada."}
          </h1>

          <div className="flex flex-col gap-4">
            <p className="text-xl text-blue-100/80 max-w-xl font-medium">
              {config.subtitle || "Especialistas em blocos de concreto e pisos intertravados de alta performance."}
            </p>
            <div className="flex flex-col gap-3">
              {mainProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 text-white group cursor-default hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-navy-blue transition-all duration-300">
                    <span className="material-symbols-outlined fill-1">{p.icon}</span>
                  </div>
                  <span className="text-2xl lg:text-3xl font-black tracking-tight">{p.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 mt-2 opacity-90">
            <div className="flex flex-col">
              <span className="text-primary font-black text-3xl leading-none">100%</span>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest mt-1">Garantia Técnica</span>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="flex flex-col">
              <span className="text-primary font-black text-3xl leading-none">+10k</span>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest mt-1">Obras Concluídas</span>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-5 self-center">
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>

            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-navy-blue mb-2">Solicite um orçamento</h2>
              <p className="text-sm text-gray-500 font-medium">Resposta rápida via WhatsApp ou Email.</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-navy-blue uppercase tracking-wider ml-1">Nome</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-navy-blue focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-navy-blue uppercase tracking-wider ml-1">WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(19) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-navy-blue focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-navy-blue uppercase tracking-wider ml-1">Cidade</label>
                <input
                  type="text"
                  placeholder="Cidade da Obra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-navy-blue focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-navy-blue text-white py-4 rounded-xl font-black text-lg hover:bg-navy-light active:scale-[0.98] transition-all shadow-xl shadow-navy-blue/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    {config.ctaText || "Solicitar Orçamento"}
                  </>
                )}
              </button>

              <p className="mt-2 text-[10px] text-center text-gray-400 font-bold uppercase">Preço de fábrica e entrega rápida</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;