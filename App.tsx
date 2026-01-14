
import React from 'react';
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

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <LocationsBar />
        <AboutUs />
        <Partners />
        <Products />
        <Supplies />
        <EfficiencyCTA />
        <ABCPBadge />
        <ServiceAreasCTA />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
