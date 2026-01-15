import React from 'react';
import Hero from './Hero';
import LocationsBar from './LocationsBar';
import AboutUs from './AboutUs';
import Partners from './Partners';
import Products from './Products';
import Supplies from './Supplies';
import EfficiencyCTA from './EfficiencyCTA';
import ABCPBadge from './ABCPBadge';
import ServiceAreasCTA from './ServiceAreasCTA';
import Testimonials from './Testimonials';
import ContactSection from './ContactSection';

interface HomeProps {
  config: any;
}

const Home: React.FC<HomeProps> = ({ config }) => {
  return (
    <>
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
    </>
  );
};

export default Home;
