import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface AdCardProps {
  adSlot: string;
  style?: React.CSSProperties;
}

export const AdCard = ({ adSlot, style }: AdCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeAd = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          const adElement = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);
          if (adElement) {
            (window as any).adsbygoogle.push({});
            setIsLoaded(true);
            console.log(`AdSense card initialized for slot: ${adSlot}`);
          }
        }
      } catch (e) {
        console.error('AdSense card error:', e);
      }
    };

    // Délai aléatoire pour éviter la surcharge + temps pour Google de détecter
    const delay = Math.random() * 1500 + 1500;
    const timer = setTimeout(initializeAd, delay);

    return () => clearTimeout(timer);
  }, [adSlot]);

  return (
    <div 
      className="group relative bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-2 border-dashed border-purple-300/50 rounded-xl p-4 transition-all duration-300 hover:border-purple-400 hover:shadow-lg backdrop-blur-sm min-h-[180px] flex flex-col justify-center items-center animate-fade-in"
      style={style}
    >
      {/* Badge "Publicité" très visible */}
      <Badge 
        variant="secondary" 
        className="absolute top-2 right-2 text-[10px] px-2 py-1 bg-purple-500 text-white font-bold"
      >
        Pub
      </Badge>

      {/* Zone publicitaire avec fallback visible */}
      <div className="w-full h-full flex items-center justify-center relative">
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
          data-ad-format="fluid"
          data-ad-layout="in-article"
          data-full-width-responsive="true"
          data-ad-test="on"
        ></ins>
        
        {/* Contenu de fallback très visible */}  
        <div className="absolute inset-4 flex flex-col items-center justify-center text-purple-600 text-center bg-white/80 rounded-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-lg mb-2 flex items-center justify-center text-2xl">
            📢
          </div>
          <div className="text-xs font-semibold">
            Espace publicitaire
          </div>
          <div className="text-[10px] text-purple-500 mt-1">
            Slot: {adSlot}
          </div>
        </div>
      </div>
    </div>
  );
};