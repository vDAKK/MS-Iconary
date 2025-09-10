import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'bottom';
  className?: string;
}

export const AdBanner = ({ position, className = "" }: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [adContent, setAdContent] = useState<any>(null);

  useEffect(() => {
    // Simulation d'un contenu publicitaire
    // À remplacer par Google AdSense ou votre solution pub
    const loadAd = () => {
      const ads = [
        {
          id: 1,
          title: "Figma Icons Pack",
          description: "1000+ icônes professionnelles pour Figma",
          image: "https://images.unsplash.com/photo-1545987796-200677ee1011?w=200&h=120&fit=crop",
          link: "#",
          price: "29€"
        },
        {
          id: 2,
          title: "Design Tools Pro",
          description: "Suite d'outils pour designers",
          image: "https://images.unsplash.com/photo-1586281011333-5ac0c5d4b6c7?w=200&h=120&fit=crop",
          link: "#",
          price: "Free Trial"
        }
      ];
      
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      setAdContent(randomAd);
    };

    loadAd();
  }, []);

  if (!isVisible || !adContent) return null;

  const baseClasses = "relative bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 rounded-lg p-4 animate-fade-in";
  
  const positionClasses = {
    top: "max-w-4xl mx-auto mb-6",
    sidebar: "max-w-sm",
    bottom: "max-w-4xl mx-auto mt-6"
  };

  return (
    <div className={`${baseClasses} ${positionClasses[position]} ${className}`}>
      {/* Bouton fermer */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-50 hover:opacity-100"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>

      {/* Contenu publicitaire */}
      <div className="flex gap-3">
        <img 
          src={adContent.image} 
          alt={adContent.title}
          className="w-16 h-16 rounded object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-sm truncate">{adContent.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {adContent.description}
              </p>
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2 flex-shrink-0">
              {adContent.price}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 text-xs h-7"
            onClick={() => window.open(adContent.link, '_blank')}
          >
            En savoir plus
          </Button>
        </div>
      </div>

      {/* Label publicitaire discret */}
      <div className="absolute top-1 left-2 text-[10px] text-muted-foreground/60 font-mono">
        pub
      </div>
    </div>
  );
};