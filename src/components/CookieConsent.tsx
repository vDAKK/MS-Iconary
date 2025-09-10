import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, Shield, ExternalLink } from 'lucide-react';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookie-consent');
    if (consent === null) {
      setIsVisible(true);
      setHasConsented(null);
    } else {
      setHasConsented(consent === 'accepted');
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setHasConsented(true);
    setIsVisible(false);
    
    // Recharger AdSense après consentement
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.log('AdSense activation after consent:', e);
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setHasConsented(false);
    setIsVisible(false);
    
    // Désactiver AdSense si refusé
    if (typeof window !== 'undefined') {
      const ads = document.querySelectorAll('.adsbygoogle');
      ads.forEach(ad => ad.remove());
    }
  };

  const handleSettings = () => {
    window.open('https://policies.google.com/privacy', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <Card className="max-w-4xl mx-auto p-6 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Respect de votre vie privée
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ce site utilise des cookies et des technologies similaires pour améliorer votre expérience de navigation 
                et afficher des publicités personnalisées via Google AdSense. Ces données nous aident à maintenir le service gratuit.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAccept} size="sm" className="font-medium">
                  Accepter les cookies
                </Button>
                <Button onClick={handleDecline} variant="outline" size="sm">
                  Refuser
                </Button>
                <Button 
                  onClick={handleSettings} 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Politique Google
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground/70">
                Conformité RGPD • Données sécurisées
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};