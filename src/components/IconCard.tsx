import { useClipboard } from '@/hooks/useClipboard';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface IconCardProps {
  name: string;
  svg: string;
  className?: string;
  style?: React.CSSProperties;
}

export const IconCard = ({ name, svg, className = '', style }: IconCardProps) => {
  const { copyToClipboard, copied } = useClipboard();
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    copyToClipboard(svg, name);
  };

  return (
    <div 
      className={`
        relative group cursor-pointer rounded-xl p-6 
        glass border border-border/50
        hover:border-primary/30 hover:shadow-glow
        transition-all duration-smooth ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        animate-fade-in
        ${className}
      `}
      style={style}
      onClick={handleCopy}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de gradient au hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-smooth" />
      
      {/* Icône SVG */}
      <div className="relative flex items-center justify-center h-12 w-12 mx-auto mb-4">
        <div 
          className="text-muted-foreground group-hover:text-primary transition-colors duration-smooth transform group-hover:scale-110"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Nom de l'icône */}
      <p className="relative text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors duration-smooth font-medium">
        {name}
      </p>

      {/* Indicateur de copie */}
      <div className={`
        absolute top-3 right-3 p-1.5 rounded-lg
        bg-surface-glass backdrop-blur-sm
        border border-border/30
        opacity-0 group-hover:opacity-100 
        transition-all duration-smooth transform
        ${copied ? 'opacity-100 scale-110' : 'scale-95'}
        ${isHovered ? 'translate-y-0' : 'translate-y-2'}
      `}>
        {copied ? (
          <div className="w-4 h-4 text-accent-foreground animate-scale-in">
            <Check size={16} />
          </div>
        ) : (
          <div className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-smooth">
            <Copy size={16} />
          </div>
        )}
      </div>

      {/* Badge "Copié" */}
      {copied && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-md animate-scale-in shadow-md">
          Copié !
        </div>
      )}

      {/* Effet shimmer subtil */}
      <div className={`
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-transparent via-primary/5 to-transparent
        opacity-0 group-hover:opacity-100
        animate-shimmer bg-[length:200%_100%]
        transition-opacity duration-slow
      `} />
    </div>
  );
};