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
    // Le script AdSense est déjà chargé dans index.html
    // Déclencher l'affichage des annonces
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.log('AdSense push error:', e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const baseClasses = "relative bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 rounded-lg p-4 animate-fade-in";
  const positionClasses = {
    top: "max-w-4xl mx-auto mb-6",
    sidebar: "max-w-sm",
    bottom: "max-w-4xl mx-auto mt-6"
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
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-4484520636329323" // Remplace ici par ton client AdSense
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <div className="absolute top-1 left-2 text-[10px] text-muted-foreground/60 font-mono">
        pub
      </div>
    </div>
  );
};
