import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Palette, Copy, RotateCcw } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';
import { useToast } from '@/hooks/use-toast';

interface IconPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  originalSvg: string;
}

export const IconPreviewModal = ({ isOpen, onClose, name, originalSvg }: IconPreviewModalProps) => {
  const [modifiedSvg, setModifiedSvg] = useState(originalSvg);
  const [colors, setColors] = useState<{ [key: string]: string }>({});
  const { copyImageToClipboard, copyTextToClipboard, downloadSvg } = useClipboard();
  const { toast } = useToast();

  // Fonction pour valider si une couleur est modifiable
  const isValidColor = (color: string): boolean => {
    if (!color || color === 'none' || color === 'currentColor' || color === 'inherit') {
      return false;
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
        initialColors[color] = color;
      });
      setColors(initialColors);
      setModifiedSvg(originalSvg);
    }
  }, [isOpen, originalSvg, extractedColors]);

  // Mettre à jour le SVG quand les couleurs changent
  useEffect(() => {
    let updated = originalSvg;
    Object.entries(colors).forEach(([original, newColor]) => {
      if (original !== newColor) {
        const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Remplacer dans les attributs fill et stroke
        const attributeRegex = new RegExp(`(fill|stroke)="${escapedOriginal}"`, 'g');
        updated = updated.replace(attributeRegex, `$1="${newColor}"`);
        
        // Remplacer dans les attributs style
        const styleRegex = new RegExp(`((?:fill|stroke):\\s*)${escapedOriginal}([;"])`, 'g');
        updated = updated.replace(styleRegex, `$1${newColor}$2`);
        
        // Remplacer dans stop-color
        const stopRegex = new RegExp(`(stop-color)="${escapedOriginal}"`, 'g');
        updated = updated.replace(stopRegex, `$1="${newColor}"`);
      }
    });
    setModifiedSvg(updated);
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

  const handleCopyImage = async () => {
    try {
      await copyImageToClipboard(modifiedSvg, `${name}_modified`);
      toast({
        title: "Image copiée",
        description: "L'icône modifiée a été copiée dans le presse-papiers"
      });
    } catch (error) {
      console.error('Error copying image:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await copyTextToClipboard(modifiedSvg, `${name}_modified`);
      toast({
        title: "Code SVG copié",
        description: "Le code SVG modifié a été copié dans le presse-papiers"
      });
    } catch (error) {
      console.error('Error copying code:', error);
    }
  };

  const handleDownload = () => {
    try {
      downloadSvg(modifiedSvg, `${name}_modified`);
      toast({
        title: "Téléchargement lancé",
        description: "L'icône modifiée a été téléchargée"
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
            <h3 className="text-lg font-semibold">Prévisualisation</h3>
            
            {/* Vue normale */}
            <div className="p-8 border border-border rounded-lg bg-background flex items-center justify-center">
              <div 
                className="w-24 h-24 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: modifiedSvg }}
              />
            </div>
            
            {/* Vue sur différents fonds */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-4 bg-white border rounded-lg flex items-center justify-center">
                <div 
                  className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
              </div>
              <div className="p-4 bg-gray-100 border rounded-lg flex items-center justify-center">
                <div 
                  className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
              </div>
              <div className="p-4 bg-gray-900 border rounded-lg flex items-center justify-center">
                <div 
                  className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleCopyImage} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copier Image
              </Button>
              <Button onClick={handleCopyCode} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copier SVG
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
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
              <div className="space-y-3">
                {extractedColors.map((color, index) => (
                  <div key={color} className="flex items-center gap-3">
                    <Label className="text-sm font-medium min-w-0 flex-1">
                      Couleur {index + 1}
                    </Label>
                    <div className="flex items-center gap-2">
                      {/* Couleur originale */}
                      <div 
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                        title={`Original: ${color}`}
                      />
                      <span className="text-xs text-muted-foreground">→</span>
                      {/* Nouvelle couleur */}
                      <Input
                        type="color"
                        value={colors[color] || color}
                        onChange={(e) => handleColorChange(color, e.target.value)}
                        className="w-12 h-8 p-0 border-border cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={colors[color] || color}
                        onChange={(e) => handleColorChange(color, e.target.value)}
                        className="w-20 text-xs"
                        placeholder="#000000"
                      />
                    </div>
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