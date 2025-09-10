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
      className="
        relative group cursor-default rounded-xl p-6 
        glass border border-border/50
        hover:border-primary/30 hover:shadow-glow
        transition-all duration-smooth ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        animate-fade-in
        before:absolute before:inset-0 before:rounded-xl 
        before:bg-gradient-to-br before:from-accent/5 before:via-transparent before:to-accent/5
        before:opacity-50 before:animate-pulse before:pointer-events-none
      "
      style={style}
    >
      
      {/* Effet de gradient au hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-smooth" />

      {/* Badge "Publicité" discret mais visible */}
      <Badge 
        variant="secondary" 
        className="absolute top-2 right-2 text-[10px] px-2 py-1 bg-accent/20 text-accent-foreground border border-accent/30 font-medium z-10"
      >
        Pub
      </Badge>

      {/* Zone publicitaire avec fallback */}
      <div className="relative flex items-center justify-center h-12 w-12 mx-auto mb-4">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%', 
            height: '48px'
          }}
          data-ad-client="ca-pub-4484520636329323"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        
        {/* Contenu de fallback stylisé comme les icônes */}
        <div className="
          relative w-10 h-10 rounded-lg 
          bg-gradient-to-br from-secondary to-muted
          border border-border/40
          flex items-center justify-center
          transition-all duration-smooth
          group-hover:from-accent/15 group-hover:to-accent/8
          group-hover:border-accent/30 group-hover:shadow-md group-hover:scale-105
          shadow-sm
        ">
          <div className="text-2xl">📢</div>
        </div>
      </div>
      
      {/* Nom stylisé comme dans IconCard */}
      <p className="relative text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors duration-smooth font-medium">
        Publicité
      </p>

      {/* Effet shimmer subtil */}
      <div className="
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-transparent via-accent/5 to-transparent
        opacity-0 group-hover:opacity-100
        animate-shimmer bg-[length:200%_100%]
        transition-opacity duration-slow
      " />
    </div>
  );
};