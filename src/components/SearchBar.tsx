import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-smooth w-5 h-5" />
        
        {/* Champ de recherche */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            pl-12 pr-12 h-12 text-base
            glass border-2 border-border/50
            focus:border-primary focus:shadow-glow
            transition-all duration-smooth
            rounded-l-none border-l-0
            placeholder:text-muted-foreground/70
            font-medium
          "
        />
        
        {/* Bouton effacer */}
        {value && (
          <button
            onClick={handleClear}
            className="
              absolute right-4 top-1/2 transform -translate-y-1/2 
              p-1.5 rounded-lg
              text-muted-foreground hover:text-foreground 
              hover:bg-muted/50 
              transition-all duration-smooth
              hover:scale-110
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Effet de focus */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-primary-light/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-smooth pointer-events-none" />
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