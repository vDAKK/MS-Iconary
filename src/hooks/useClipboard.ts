import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  // Fonction pour copier du texte
  const copyTextToClipboard = async (text: string, iconName?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      toast({
        title: "Code copié !",
        description: `Le code SVG de l'icône ${iconName || ''} a été copié`,
        duration: 2000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      
      toast({
        title: "Erreur",
        description: "Impossible de copier le code SVG",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Fonction pour copier une image SVG
  const copyImageToClipboard = async (svgString: string, iconName?: string) => {
    try {
      // Vérifier si le navigateur supporte ClipboardItem
      if (!window.ClipboardItem) {
        throw new Error('ClipboardItem not supported');
      }

      // Créer un blob SVG
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });

      // Essayer de copier en tant qu'image SVG
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/svg+xml': svgBlob
        })
      ]);

      setCopied(true);
      
      toast({
        title: "Image copiée !",
        description: `L'icône ${iconName || ''} a été copiée en tant qu'image SVG`,
        duration: 2000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie d\'image:', err);
      
      // Fallback: copier le code SVG
      await copyTextToClipboard(svgString, iconName);
    }
  };

  // Fonction pour télécharger un fichier SVG
  const downloadSvg = (svgString: string, iconName: string) => {
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${iconName}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Téléchargement démarré !",
        description: `L'icône ${iconName}.svg est en cours de téléchargement`,
        duration: 2000,
      });
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier SVG",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return { 
    copyTextToClipboard,
    copyImageToClipboard, 
    downloadSvg,
    copied 
  };
};