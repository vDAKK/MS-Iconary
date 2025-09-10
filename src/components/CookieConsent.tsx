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
    
    // AdSense avec publicités personnalisées
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
          google_ad_client: "ca-pub-4484520636329323",
          enable_page_level_ads: false,
          non_personalized_ads: false // Pubs personnalisées autorisées
        });
      } catch (e) {
        console.log('AdSense activation after consent:', e);
      }
    }
  };

  const handleNonPersonalized = () => {
    localStorage.setItem('cookie-consent', 'non-personalized');
    setHasConsented(true);
    setIsVisible(false);
    
    // AdSense SANS traçage - publicités basées sur le contenu uniquement
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
          google_ad_client: "ca-pub-4484520636329323",
          enable_page_level_ads: false,
          non_personalized_ads: true // Pubs NON personnalisées
        });
      } catch (e) {
        console.log('AdSense non-personalized activation:', e);
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setHasConsented(true); // On garde les pubs non personnalisées
    setIsVisible(false);
    
    // Activer AdSense SANS traçage même en cas de refus
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
          google_ad_client: "ca-pub-4484520636329323", 
          enable_page_level_ads: false,
          non_personalized_ads: true // Pubs NON personnalisées
        });
      } catch (e) {
        console.log('AdSense non-personalized after decline:', e);
      }
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
                Ce site utilise Google AdSense pour maintenir le service gratuit. Des publicités seront affichées 
                dans tous les cas, mais vous pouvez choisir si elles sont personnalisées ou non.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAccept} size="sm" className="font-medium">
                  ✨ Accepter la personnalisation
                </Button>
                <Button onClick={handleNonPersonalized} variant="outline" size="sm" className="font-medium">
                  🛡️ Publicités standard
                </Button>
                <Button onClick={handleDecline} variant="secondary" size="sm">
                  📢 Continuer sans personnalisation
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="text-xs text-muted-foreground/80 max-w-lg">
                  <strong>Toutes les options affichent des publicités.</strong> Seule la personnalisation change : 
                  basées sur vos centres d'intérêt ou sur le contenu de la page uniquement.
                </div>
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
                Service gratuit financé par la publicité • Conformité RGPD
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};