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
    try {
      // Charger Google AdSense si ce n'est pas déjà fait
      if (typeof window !== 'undefined' && !(window as any).adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=4484520636329323';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Pousser l'annonce dans la file d'attente AdSense
      if ((window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.log('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="4484520636329323" // À remplacer par votre ID client AdSense
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};
