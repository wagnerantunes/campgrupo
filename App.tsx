
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Home from './components/Home';
import ThankYou from './components/ThankYou';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import { assetConfig as initialConfig } from './assetConfig';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import API_URL from './config/api';
import IntegrationScripts from './components/IntegrationScripts';

const AppContent: React.FC = () => {
  const [config, setConfig] = useState(initialConfig);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, token } = useAuth();
  
  // Consent State: Check localStorage on mount
  const [consent, setConsent] = useState<boolean>(() => {
    return localStorage.getItem('camp_consent') === 'granted';
  });

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
  }, [isAuthenticated]);

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
      throw e;
    }
  };

  // Callback to handle consent acceptance/rejection
  const handleConsentAccept = () => setConsent(true);
  const handleConsentReject = () => setConsent(false);

  return (
    <BrowserRouter>
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

        {/* Inject scripts based on config AND CONSENT */}
        {config.integrations && <IntegrationScripts config={config.integrations} consentGiven={consent} />}

        <Header config={config.logo} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home config={config} />} />
            <Route path="/obrigado" element={<ThankYou />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos" element={<TermsOfUse />} />
          </Routes>
        </main>

        <Footer />
        <FloatingWhatsApp />

        {/* Cookie Consent Banner */}
        <CookieBanner 
            onAccept={handleConsentAccept}
            onReject={handleConsentReject}
        />

        {/* Botão flutuante discreto para Admin */}
        <button
          onClick={handleAdminAccess}
          className="fixed bottom-4 left-4 z-40 bg-navy-blue/10 hover:bg-navy-blue/20 p-2 rounded-full text-[10px] text-navy-blue/40 uppercase font-black"
          title="Área Administrativa"
        >
          Admin
        </button>
      </div>
    </BrowserRouter>
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
