
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
  }, []);

  // Atalho Shift + A para acessar o admin de forma discreta
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toUpperCase() === 'A') {
        window.location.href = '/area-restrita';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update SEO and Favicon dynamically
  useEffect(() => {
    if (config.seo) {
      if (config.seo.title) document.title = config.seo.title;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && config.seo.description) {
        metaDesc.setAttribute('content', config.seo.description);
      }

      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon && config.seo.faviconUrl) {
        favicon.setAttribute('href', config.seo.faviconUrl);
      }
    }

    // Dynamic Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + window.location.pathname);

    // Dynamic NoIndex for sensitive paths
    const isSensitivePath = window.location.pathname.startsWith('/area-restrita');
    let robotsMeta = document.querySelector('meta[name="robots"]');
    
    if (isSensitivePath) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow');
    }
  }, [config.seo, window.location.pathname]);

  const handleSaveConfig = async (newConfig: any) => {
    setConfig(newConfig);
    localStorage.setItem('campgrupo_assets', JSON.stringify(newConfig));

    try {
      const response = await fetch(`${API_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newConfig)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar no servidor');
      }
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

        {/* Inject scripts based on config AND CONSENT */}
        {config.integrations && <IntegrationScripts config={config.integrations} consentGiven={consent} />}

        <Header config={config} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home config={config} />} />
            <Route path="/obrigado" element={<ThankYou />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos" element={<TermsOfUse />} />

            {/* Rota de Admin Protegida por URL "Secundária" */}
            <Route path="/area-restrita" element={
              isAuthenticated ? (
                <AdminPanel
                  currentConfig={config}
                  onClose={() => window.location.href = '/'}
                  onSave={handleSaveConfig}
                />
              ) : (
                <LoginModal
                  onClose={() => window.location.href = '/'}
                  onSuccess={() => {
                    // O AuthContext já atualiza o estado isAuthenticated
                  }}
                />
              )
            } />
          </Routes>
        </main>

        <Footer config={config} />
        <FloatingWhatsApp config={config} />

        {/* Cookie Consent Banner */}
        <CookieBanner
          onAccept={handleConsentAccept}
          onReject={handleConsentReject}
        />
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
