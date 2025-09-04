import { Search, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSemanticSearch?: (query: string) => void;
  isSemanticMode?: boolean;
  onToggleSemanticMode?: () => void;
  isSemanticReady?: boolean;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Rechercher des icônes...",
  className = "",
  onSemanticSearch,
  isSemanticMode = false,
  onToggleSemanticMode,
  isSemanticReady = false
}: SearchBarProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  const handleSemanticSearch = async () => {
    if (!onSemanticSearch || !value.trim()) return;
    
    setIsLoading(true);
    try {
      await onSemanticSearch(value.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isSemanticMode && onSemanticSearch) {
      handleSemanticSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        {/* Icône de recherche */}
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-smooth w-5 h-5 ${
          isSemanticMode ? 'text-primary' : 'text-muted-foreground group-focus-within:text-primary'
        }`} />
        
        {/* Champ de recherche */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isSemanticMode ? "Décrivez l'icône que vous cherchez (ex: validation, erreur, maison)..." : placeholder}
          className={`
            pl-12 pr-32 h-12 text-base
            glass border-2 
            focus:shadow-glow
            transition-all duration-smooth
            rounded-xl
            placeholder:text-muted-foreground/70
            font-medium
            ${isSemanticMode 
              ? 'border-primary/50 focus:border-primary bg-primary/5' 
              : 'border-border/50 focus:border-primary'
            }
          `}
          aria-label={isSemanticMode ? "Recherche sémantique" : "Recherche normale"}
        />
        
        {/* Boutons à droite */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Badge mode sémantique */}
          {isSemanticMode && (
            <Badge variant="secondary" className="text-xs animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" />
              IA
            </Badge>
          )}
          
          {/* Bouton recherche sémantique */}
          {isSemanticMode && onSemanticSearch && (
            <Button
              type="button"
              size="sm"
              onClick={handleSemanticSearch}
              disabled={!value.trim() || isLoading}
              className="h-8 px-3 text-xs"
            >
              {isLoading ? 'Recherche...' : 'Chercher'}
            </Button>
          )}
          
          {/* Toggle mode sémantique */}
          {onToggleSemanticMode && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleSemanticMode}
              className={`h-8 w-8 p-0 transition-all ${
                isSemanticMode 
                  ? 'text-primary bg-primary/10 hover:bg-primary/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
              title={isSemanticMode 
                ? 'Passer à la recherche normale' 
                : isSemanticReady 
                  ? 'Activer la recherche sémantique (IA)'
                  : 'Recherche sémantique (en cours de chargement...)'
              }
              disabled={!isSemanticReady}
            >
              <Sparkles className={`w-4 h-4 ${isSemanticMode ? 'animate-pulse' : ''}`} />
            </Button>
          )}
          
          {/* Bouton effacer */}
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
              title="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Effet de focus */}
        <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-smooth pointer-events-none ${
          isSemanticMode 
            ? 'bg-gradient-to-r from-primary/10 to-accent/10' 
            : 'bg-gradient-to-r from-primary/5 to-primary-light/5'
        }`} />
      </div>

      {/* Indication du mode */}
      {isSemanticMode && (
        <div className="flex items-center justify-center mt-2 text-xs text-primary/80">
          <Sparkles className="w-3 h-3 mr-1" />
          Recherche sémantique activée - Décrivez ce que vous cherchez en langage naturel
        </div>
      )}

      {/* Suggestions ou raccourcis clavier */}
      {!value && !isSemanticMode && (
        <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground/60 font-mono">
          <kbd className="px-2 py-1 bg-muted/30 rounded border border-border/30">Ctrl</kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1 bg-muted/30 rounded border border-border/30">K</kbd>
        </div>
      )}
    </div>
  );
};