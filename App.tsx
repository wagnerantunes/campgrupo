
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LocationsBar from './components/LocationsBar';
import AboutUs from './components/AboutUs';
import Partners from './components/Partners';
import Products from './components/Products';
import Supplies from './components/Supplies';
import EfficiencyCTA from './components/EfficiencyCTA';
import ABCPBadge from './components/ABCPBadge';
import ServiceAreasCTA from './components/ServiceAreasCTA';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { assetConfig as initialConfig } from './assetConfig';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import API_URL from './config/api';

const AppContent: React.FC = () => {
  const [config, setConfig] = useState(initialConfig);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/config`);
        if (response.ok) {
          const data = await response.json();
           setConfig({
            ...initialConfig,
            ...data,
            products: data.products ? initialConfig.products.map((p: any, i: number) => ({ ...p, ...data.products[i] })) : initialConfig.products,
            supplies: data.supplies ? initialConfig.supplies.map((s: any, i: number) => ({ ...s, ...data.supplies[i] })) : initialConfig.supplies
          });
          return;
        }
      } catch (e) {
        console.warn("Backend não alcançado, tentando localStorage", e);
      }

      const saved = localStorage.getItem('campgrupo_assets');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConfig({
            ...initialConfig,
            ...parsed,
            products: parsed.products ? initialConfig.products.map((p: any, i: number) => ({ ...p, ...parsed.products[i] })) : initialConfig.products,
            supplies: parsed.supplies ? initialConfig.supplies.map((s: any, i: number) => ({ ...s, ...parsed.supplies[i] })) : initialConfig.supplies
          });
        } catch (e) {
          console.error("Erro ao carregar assets salvos", e);
        }
      }
    };

    fetchConfig();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'A') {
        handleAdminAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]); // Re-bind listener if auth state changes (though not strictly necessary for this logic)

  const handleAdminAccess = () => {
      if (isAuthenticated) {
          setShowAdmin(true);
      } else {
          setShowLogin(true);
      }
  };

  const handleSaveConfig = async (newConfig: any) => {
    setConfig(newConfig);
    localStorage.setItem('campgrupo_assets', JSON.stringify(newConfig));

    try {
      await fetch(`${API_URL}/config`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newConfig)
      });
    } catch (e) {
      console.error("Erro ao salvar no backend", e);
      throw e; // Propagate error for AdminPanel to handle
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-white">
      {showLogin && (
        <LoginModal 
            onClose={() => setShowLogin(false)}
            onSuccess={() => {
                setShowLogin(false);
                setShowAdmin(true);
            }}
        />
      )}

      {showAdmin && (
        <AdminPanel
          currentConfig={config}
          onClose={() => setShowAdmin(false)}
          onSave={handleSaveConfig}
        />
      )}

      <Header config={config.logo} />
      <main className="flex-grow">
        <Hero config={config.hero} />
        <LocationsBar />
        <AboutUs config={config.about} />
        <Partners />
        <Products config={config.products} />
        <Supplies config={config.supplies} />
        <EfficiencyCTA config={config.cta} />
        <ABCPBadge />
        <ServiceAreasCTA />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />

      {/* Botão flutuante discreto para Admin */}
      <button
        onClick={handleAdminAccess}
        className="fixed bottom-4 left-4 z-40 bg-navy-blue/10 hover:bg-navy-blue/20 p-2 rounded-full text-[10px] text-navy-blue/40 uppercase font-black"
        title="Área Administrativa"
      >
        Admin
      </button>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <AppContent />
        </AuthProvider>
    );
};

export default App;
