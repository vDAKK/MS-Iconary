import { useEffect } from 'react';

interface GoogleAdsenseProps {
  adSlot: string;
  adFormat?: string;
  adStyle?: React.CSSProperties;
  className?: string;
}

export const GoogleAdsense = ({ 
  adSlot, 
  adFormat = "auto", 
  adStyle = { display: 'block' },
  className = ""
}: GoogleAdsenseProps) => {
  
  useEffect(() => {
    // Le script AdSense est déjà chargé dans index.html
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (error) {
        console.log('AdSense error:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-4484520636329323" // À remplacer par votre ID client AdSense
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};
