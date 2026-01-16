import React, { useEffect } from 'react';

interface IntegrationScriptsProps {
    config: {
        googleAdsId?: string;
        googleTagManagerId?: string;
        facebookPixelId?: string;
        headScripts?: string;
        bodyScripts?: string;
    };
    consentGiven: boolean;
}

const IntegrationScripts: React.FC<IntegrationScriptsProps> = ({ config, consentGiven }) => {
    useEffect(() => {
        if (!config || !consentGiven) return;

        // Basic "Blocking" Strategy: Only inject scripts if Consent is explicitly GRANTED.
        // This is the safest, simplest implementation for a custom React app without complex CMPs.
        
        console.log("Consent Granted: Injecting Tracking Scripts");

        // 1. Google Ads (gtag)
        if (config.googleAdsId) {
            if (!document.querySelector(`script[src*="${config.googleAdsId}"]`)) {
                const script1 = document.createElement('script');
                script1.async = true;
                script1.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAdsId}`;
                document.head.appendChild(script1);

                const script2 = document.createElement('script');
                script2.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${config.googleAdsId}');
                `;
                document.head.appendChild(script2);
            }
        }

        // 2. Google Tag Manager
        if (config.googleTagManagerId) {
             if (!document.querySelector(`script[src*="gtm.js?id=${config.googleTagManagerId}"]`)) {
                const script = document.createElement('script');
                script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${config.googleTagManagerId}');`;
                document.head.appendChild(script);
             }
        }

        // 3. Facebook Pixel
        if (config.facebookPixelId) {
             if (!document.querySelector(`script[src*="fbevents.js"]`)) {
                const script = document.createElement('script');
                script.innerHTML = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${config.facebookPixelId}');
                fbq('track', 'PageView');
                `;
                document.head.appendChild(script);
             }
        }

        // 4. Custom Head Scripts
        if (config.headScripts) {
           try {
               const range = document.createRange();
               const fragment = range.createContextualFragment(config.headScripts);
               document.head.appendChild(fragment);
           } catch(e) { console.error("Error injecting custom head scripts", e) }
        }

        // 5. Custom Body Scripts
        if (config.bodyScripts) {
            try {
                const range = document.createRange();
                const fragment = range.createContextualFragment(config.bodyScripts);
                document.body.appendChild(fragment);
            } catch(e) { console.error("Error injecting custom body scripts", e) }
        }

        // 6. Global Helper for Conversion Tracking
        (window as any).trackConversion = (eventName: string, params?: any) => {
            if (!consentGiven) return;
            
            // Google Ads / Analytics
            if (typeof (window as any).gtag === 'function') {
                (window as any).gtag('event', eventName, params);
            }

            // Facebook Pixel
            if (typeof (window as any).fbq === 'function') {
                (window as any).fbq('track', eventName, params);
            }
        };

    }, [config, consentGiven]); 

    return null;
};

export default IntegrationScripts;
