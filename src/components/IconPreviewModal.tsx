import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Palette, Copy, RotateCcw, Maximize2 } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';
import { useToast } from '@/hooks/use-toast';
import { ColorPicker } from '@/components/ColorPicker';

interface IconPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  originalSvg: string;
}

export const IconPreviewModal = ({ isOpen, onClose, name, originalSvg }: IconPreviewModalProps) => {
  const [modifiedSvg, setModifiedSvg] = useState(originalSvg);
  const [colors, setColors] = useState<{ [key: string]: string }>({});
  const [svgKey, setSvgKey] = useState(0); // Clé pour forcer le re-rendu
  const [iconSize, setIconSize] = useState(96); // Taille en pixels
  const { copyImageToClipboard, copyTextToClipboard, downloadSvg } = useClipboard();
  const { toast } = useToast();

  // Fonction pour valider si une couleur est modifiable
  const isValidColor = (color: string): boolean => {
    if (!color || color === 'none' || color === 'inherit') {
      return false;
    }
    
    // currentColor est maintenant considéré comme modifiable
    if (color === 'currentColor') {
      return true;
    }
    
    // Couleurs hexadécimales
    if (color.match(/^#[0-9a-fA-F]{3,8}$/)) {
      return true;
    }
    
    // Couleurs RGB/RGBA
    if (color.match(/^rgba?\([^)]+\)$/)) {
      return true;
    }
    
    // Couleurs HSL/HSLA
    if (color.match(/^hsla?\([^)]+\)$/)) {
      return true;
    }
    
    // Couleurs nommées courantes
    const namedColors = [
      'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown',
      'black', 'white', 'gray', 'grey', 'darkgray', 'darkgrey', 'lightgray', 'lightgrey',
      'darkblue', 'lightblue', 'darkgreen', 'lightgreen', 'darkred', 'lightred'
    ];
    
    if (namedColors.includes(color.toLowerCase())) {
      return true;
    }
    
    return false;
  };

  // Extraire les couleurs du SVG original
  const extractedColors = useMemo(() => {
    const foundColors = new Set<string>();
    
    // 1. Chercher dans les attributs fill et stroke
    const attributeRegex = /(fill|stroke)="([^"]+)"/g;
    let match;
    while ((match = attributeRegex.exec(originalSvg)) !== null) {
      const color = match[2];
      if (isValidColor(color)) {
        foundColors.add(color);
      }
    }
    
    // 2. Chercher dans les attributs style
    const styleRegex = /style="[^"]*(?:fill|stroke):\s*([^;"\s]+)/g;
    while ((match = styleRegex.exec(originalSvg)) !== null) {
      const color = match[1];
      if (isValidColor(color)) {
        foundColors.add(color);
      }
    }
    
    // 3. Chercher dans les définitions de gradients et autres éléments
    const stopRegex = /stop-color="([^"]+)"/g;
    while ((match = stopRegex.exec(originalSvg)) !== null) {
      const color = match[1];
      if (isValidColor(color)) {
        foundColors.add(color);
      }
    }

    return Array.from(foundColors);
  }, [originalSvg, isValidColor]);

  // Initialiser les couleurs lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      const initialColors: { [key: string]: string } = {};
      extractedColors.forEach(color => {
        // Pour currentColor, utiliser la couleur du thème par défaut
        if (color === 'currentColor') {
          initialColors[color] = 'hsl(var(--foreground))';
        } else {
          initialColors[color] = color;
        }
      });
      setColors(initialColors);
      setModifiedSvg(originalSvg);
    }
  }, [isOpen, originalSvg]); // Retirer extractedColors des dépendances

  // Mettre à jour le SVG quand les couleurs changent
  useEffect(() => {
    let updated = originalSvg;
    const timestamp = Date.now();
    
    Object.entries(colors).forEach(([original, newColor]) => {
      if (original !== newColor) {
        console.log(`Replacing color: ${original} → ${newColor}`);
        
        // Échapper les caractères spéciaux pour les regex, mais pas les parenthèses et virgules pour les couleurs RGB/HSL
        const escapedOriginal = original.replace(/[.*+?^${}|[\]\\]/g, '\\$&');
        
        // 1. Remplacer dans les attributs fill et stroke
        const attributeRegex = new RegExp(`(fill|stroke)="${escapedOriginal}"`, 'gi');
        const beforeAttribute = updated;
        updated = updated.replace(attributeRegex, `$1="${newColor}"`);
        if (beforeAttribute !== updated) console.log('Replaced in attributes');
        
        // 2. Remplacer dans les attributs style
        const styleRegex = new RegExp(`((?:fill|stroke):\\s*)${escapedOriginal}([;"])`, 'gi');
        const beforeStyle = updated;
        updated = updated.replace(styleRegex, `$1${newColor}$2`);
        if (beforeStyle !== updated) console.log('Replaced in style attributes');
        
        // 3. Remplacer dans stop-color pour les gradients
        const stopRegex = new RegExp(`(stop-color)="${escapedOriginal}"`, 'gi');
        const beforeStop = updated;
        updated = updated.replace(stopRegex, `$1="${newColor}"`);
        if (beforeStop !== updated) console.log('Replaced in stop-color');
        
        // 4. Gérer les couleurs sans guillemets dans les styles
        const styleNoQuoteRegex = new RegExp(`((?:fill|stroke):\\s*)${escapedOriginal}(\\s|;|$)`, 'gi');
        const beforeNoQuote = updated;
        updated = updated.replace(styleNoQuoteRegex, `$1${newColor}$2`);
        if (beforeNoQuote !== updated) console.log('Replaced in unquoted styles');
        
        // 5. Remplacer dans les définitions CSS (si présentes)
        const cssRegex = new RegExp(`(\\.|#[\\w-]+\\s*{[^}]*(?:fill|stroke):\\s*)${escapedOriginal}([^}]*})`, 'gi');
        const beforeCSS = updated;
        updated = updated.replace(cssRegex, `$1${newColor}$2`);
        if (beforeCSS !== updated) console.log('Replaced in CSS definitions');
        
        console.log('Final updated SVG contains new color:', updated.includes(newColor));
      }
    });
    
    // Forcer l'invalidation du cache en changeant tous les IDs des gradients et références
    updated = updated.replace(/id="([^"]+)"/g, `id="$1-${timestamp}"`);
    updated = updated.replace(/url\(#([^)]+)\)/g, `url(#$1-${timestamp})`);
    updated = updated.replace(/href="#([^"]+)"/g, `href="#$1-${timestamp}"`);
    updated = updated.replace(/xlink:href="#([^"]+)"/g, `xlink:href="#$1-${timestamp}"`);
    
    setModifiedSvg(updated);
    setSvgKey(prev => prev + 1); // Forcer le re-rendu
  }, [colors, originalSvg]);

  const handleColorChange = (originalColor: string, newColor: string) => {
    setColors(prev => ({
      ...prev,
      [originalColor]: newColor
    }));
  };

  const handleReset = () => {
    const resetColors: { [key: string]: string } = {};
    extractedColors.forEach(color => {
      resetColors[color] = color;
    });
    setColors(resetColors);
  };

  // Fonction pour ajuster la taille du SVG - Approche simplifiée avec CSS
  const getSizedSvg = (svgString: string, size: number) => {
    // Pour la copie/téléchargement, on force les dimensions dans le SVG
    let sizedSvg = svgString;
    
    // Supprimer les attributs width/height existants
    sizedSvg = sizedSvg.replace(/\s*width="[^"]*"/g, '');
    sizedSvg = sizedSvg.replace(/\s*height="[^"]*"/g, '');
    
    // Ajouter les nouvelles dimensions
    sizedSvg = sizedSvg.replace(/<svg([^>]*)>/, `<svg$1 width="${size}" height="${size}">`);
    
    // S'assurer qu'il y a un viewBox pour le redimensionnement correct
    if (!sizedSvg.includes('viewBox=')) {
      // Ajouter un viewBox par défaut si il n'y en a pas
      sizedSvg = sizedSvg.replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 24 24">`);
    }
    
    return sizedSvg;
  };

  const handleCopyImage = async () => {
    try {
      const sizedSvg = getSizedSvg(modifiedSvg, iconSize);
      await copyImageToClipboard(sizedSvg, `${name}_modified_${iconSize}px`);
      toast({
        title: "Image copiée",
        description: `L'icône modifiée (${iconSize}px) a été copiée dans le presse-papiers`
      });
    } catch (error) {
      console.error('Error copying image:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      const sizedSvg = getSizedSvg(modifiedSvg, iconSize);
      await copyTextToClipboard(sizedSvg, `${name}_modified_${iconSize}px`);
      toast({
        title: "Code SVG copié",
        description: `Le code SVG modifié (${iconSize}px) a été copié dans le presse-papiers`
      });
    } catch (error) {
      console.error('Error copying code:', error);
    }
  };

  const handleDownload = () => {
    try {
      const sizedSvg = getSizedSvg(modifiedSvg, iconSize);
      downloadSvg(sizedSvg, `${name}_modified_${iconSize}px`);
      toast({
        title: "Téléchargement lancé",
        description: `L'icône modifiée (${iconSize}px) a été téléchargée`
      });
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Personnaliser {name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
          {/* Prévisualisation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Prévisualisation</h3>
            </div>
            
            {/* Contrôle de taille */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                Taille: {iconSize}px
              </Label>
              <Slider
                value={[iconSize]}
                onValueChange={(value) => setIconSize(value[0])}
                min={24}
                max={256}
                step={8}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>24px</span>
                <span>256px</span>
              </div>
            </div>
            
            {/* Vue normale */}
            <div className="p-8 border border-border rounded-lg bg-background flex items-center justify-center">
              <div 
                key={`main-${svgKey}`}
                className="flex items-center justify-center text-foreground"
                style={{ 
                  width: `${iconSize}px`, 
                  height: `${iconSize}px`,
                  color: 'hsl(var(--foreground))'
                }}
              >
                <div 
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
              </div>
            </div>
            
            {/* Vue sur différents fonds */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-4 bg-white border rounded-lg flex items-center justify-center">
                <div 
                  key={`white-${svgKey}`}
                  className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full text-gray-800"
                  style={{ color: '#1f2937' }}
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
              </div>
              <div className="p-4 bg-gray-100 border rounded-lg flex items-center justify-center">
                <div 
                  key={`gray-${svgKey}`}
                  className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full text-gray-700"
                  style={{ color: '#374151' }}
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
              </div>
              <div className="p-4 bg-gray-900 border rounded-lg flex items-center justify-center">
                <div 
                  key={`dark-${svgKey}`}
                  className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full text-white"
                  style={{ color: '#ffffff' }}
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button onClick={handleCopyImage} className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copier Image
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleCopyCode} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier SVG
                </Button>
                <Button onClick={handleDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>

          {/* Contrôles des couleurs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Couleurs</h3>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
            
            {extractedColors.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                 {extractedColors.map((color, index) => (
                   <div key={color} className="flex items-center gap-3">
                     <Label className="text-sm font-medium w-16 flex-shrink-0">
                       {color === 'currentColor' ? 'Couleur' : `Couleur ${index + 1}`}
                     </Label>
                     <ColorPicker
                       value={colors[color] || (color === 'currentColor' ? 'hsl(var(--foreground))' : color)}
                       onChange={(newColor) => handleColorChange(color, newColor)}
                       originalColor={color === 'currentColor' ? 'Couleur actuelle' : color}
                     />
                   </div>
                 ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucune couleur modifiable détectée dans cette icône</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};