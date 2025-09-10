import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface AdCardProps {
  adSlot: string;
  style?: React.CSSProperties;
}

export const AdCard = ({ adSlot, style }: AdCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
          setIsLoaded(true);
        }
      } catch (e) {
        console.error('AdSense card error:', e);
      }
    }, Math.random() * 1000 + 500); // Délai aléatoire pour éviter la surcharge

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="group relative bg-card border border-border/50 rounded-xl p-4 hover:border-border transition-all duration-300 hover:shadow-lg backdrop-blur-sm min-h-[180px] flex flex-col justify-center items-center animate-fade-in"
      style={style}
    >
      {/* Badge "Publicité" */}
      <Badge 
        variant="secondary" 
        className="absolute top-2 right-2 text-[10px] px-2 py-1 bg-muted/80 text-muted-foreground"
      >
        Pub
      </Badge>

      {/* Zone publicitaire */}
      <div className="w-full h-full flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%', 
            height: '150px',
            minHeight: '150px'
          }}
          data-ad-client="ca-pub-4484520636329323"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        
        {/* Contenu de fallback pendant le chargement */}
        {!isLoaded && (
          <div className="absolute inset-4 flex flex-col items-center justify-center text-muted-foreground/60 text-center">
            <div className="w-12 h-12 bg-muted/30 rounded-lg mb-2 flex items-center justify-center">
              📢
            </div>
            <div className="text-xs">
              Espace publicitaire
            </div>
          </div>
        )}
      </div>
    </div>
  );
};