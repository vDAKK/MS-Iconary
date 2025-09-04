import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Rechercher des icônes...",
  className = ""
}: SearchBarProps) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        {/* Icône de recherche */}
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-smooth w-5 h-5 group-focus-within:text-primary" style={{ color: '#9ca3af' }} />
        
        {/* Champ de recherche */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-12 text-base glass border-2 border-border/50 focus:border-primary focus:shadow-glow transition-all duration-smooth rounded-xl placeholder:text-muted-foreground/70 font-medium"
          aria-label="Recherche d'icônes"
        />
        
        {/* Bouton effacer */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
            title="Effacer la recherche"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Effet de focus */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-smooth pointer-events-none bg-gradient-to-r from-primary/5 to-primary-light/5" />
      </div>

      {/* Suggestions ou raccourcis clavier */}
      {!value && (
        <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground/60 font-mono">
          <kbd className="px-2 py-1 bg-muted/30 rounded border border-border/30">Ctrl</kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1 bg-muted/30 rounded border border-border/30">K</kbd>
        </div>
      )}
    </div>
  );
};