import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Montrer le bouton après avoir scrollé un peu
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      size="sm"
      aria-label="Remonter en haut de la page"
    >
      <ChevronUp className="w-5 h-5" />
    </Button>
  );
};