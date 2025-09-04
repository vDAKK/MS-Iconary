import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  originalColor: string;
}

export const ColorPicker = ({ value, onChange, originalColor }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Couleurs prédéfinies populaires
  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#C0C0C0', '#800000',
    '#008000', '#000080', '#808000', '#008080', '#FF6347',
    '#4B0082', '#DC143C', '#00CED1', '#FFD700', '#32CD32'
  ];

  return (
    <div className="flex items-center gap-2 flex-1">
      {/* Couleur originale */}
      <div 
        className="w-8 h-8 rounded border border-border flex-shrink-0"
        style={{ backgroundColor: originalColor }}
        title={`Original: ${originalColor}`}
      />
      <span className="text-xs text-muted-foreground flex-shrink-0">→</span>
      
      {/* Color picker custom */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-12 h-8 p-0 border border-border flex-shrink-0"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Choisir couleur</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Sélectionner une couleur</span>
            </div>
            
            {/* Couleur courante */}
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded border border-border"
                style={{ backgroundColor: value }}
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-xs"
                placeholder="#000000"
              />
            </div>
            
            {/* Color picker natif */}
            <Input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 p-0 border border-border cursor-pointer"
            />
            
            {/* Couleurs prédéfinies */}
            <div>
              <span className="text-xs text-muted-foreground mb-2 block">Couleurs populaires</span>
              <div className="grid grid-cols-8 gap-1">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Bouton reset */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange(originalColor);
                setIsOpen(false);
              }}
            >
              Couleur originale
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Input texte */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 text-xs flex-shrink-0"
        placeholder="#000000"
      />
    </div>
  );
};