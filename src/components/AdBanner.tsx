import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'bottom';
  className?: string;
  adSlot: string; // slot Google AdSense à passer
}

let adsenseScriptInjected = false;

export const AdBanner = ({ position, className = "", adSlot }: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Attendre que le DOM soit complètement chargé et que AdSense soit prêt
    const initializeAd = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          const adElement = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);
          if (adElement && !(window as any).adsbygoogle.loaded) {
            (window as any).adsbygoogle.push({});
            console.log(`AdSense initialized for slot: ${adSlot}`);
          }
        }
      } catch (e) {
        console.error('AdSense initialization error:', e);
      }
    };

    // Délai plus long pour s'assurer que Google a le temps de détecter
    const timer = setTimeout(initializeAd, 2000);
    
    // Essayer aussi après le load de la page
    if (document.readyState === 'complete') {
      setTimeout(initializeAd, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(initializeAd, 1000));
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', initializeAd);
    };
  }, [adSlot]);

  if (!isVisible) return null;

  const baseClasses = "relative bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 rounded-lg p-3 animate-fade-in";
  const positionClasses = {
    top: "max-w-4xl mx-auto mb-4 h-16",
    sidebar: "max-w-sm h-20", 
    bottom: "max-w-4xl mx-auto mt-4 h-16"
  };

  return (
    <div className={`${baseClasses} ${positionClasses[position]} ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-50 hover:opacity-100"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>

      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%', minHeight: '60px' }}
        data-ad-client="ca-pub-4484520636329323"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-test="on"
        data-adbreak-test="on"
      ></ins>

      <div className="absolute top-1 left-2 text-[10px] text-muted-foreground/60 font-mono">
        pub
      </div>
    </div>
  );
};
