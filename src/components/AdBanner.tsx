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
    // Afficher les pubs dans tous les cas, personnalisées ou non selon le consentement
    const consent = localStorage.getItem('cookie-consent');
    
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        try {
          const adConfig: any = {};
          
          // Si refus ou pas de choix spécifique pour les non-personnalisées, utiliser des pubs non personnalisées
          if (consent === 'declined' || consent === 'non-personalized' || !consent) {
            adConfig.google_ad_client = "ca-pub-4484520636329323";
            adConfig.non_personalized_ads = true;
          }
          
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(adConfig);
          // Pousser l'élément pour l'initialiser
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.log('AdSense push error:', e);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
        className="adsbygoogle w-full block"
        style={{ display: 'block', width: '100%', height: '90px', minHeight: '90px' }}
        data-ad-client="ca-pub-4484520636329323"
        data-ad-slot={adSlot}
        data-ad-format="horizontal"
        data-full-width-responsive="false"
        data-ad-layout="in-article"
      ></ins>

      <div className="absolute top-1 left-2 text-[10px] text-muted-foreground/60 font-mono">
        pub
      </div>
    </div>
  );
};
