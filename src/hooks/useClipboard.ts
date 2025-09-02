import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string, iconName?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      toast({
        title: "Copié !",
        description: `L'icône ${iconName || ''} a été copiée dans le presse-papier`,
        duration: 2000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      
      toast({
        title: "Erreur",
        description: "Impossible de copier l'icône",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return { copyToClipboard, copied };
};