import { useClipboard } from '@/hooks/useClipboard';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface IconCardProps {
  name: string;
  svg: string;
  className?: string;
}

export const IconCard = ({ name, svg, className = '' }: IconCardProps) => {
  const { copyToClipboard, copied } = useClipboard();
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    copyToClipboard(svg, name);
  };

  return (
    <div 
      className={`
        relative group cursor-pointer rounded-lg p-6 
        bg-icon-background border border-icon-border 
        hover:border-icon-border-hover hover:bg-icon-background-hover
        transition-all duration-200 ease-in-out
        hover:shadow-md hover:-translate-y-1
        ${className}
      `}
      onClick={handleCopy}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icône SVG */}
      <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3">
        <div 
          className="text-foreground group-hover:text-primary transition-colors duration-200"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Nom de l'icône */}
      <p className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors duration-200 font-medium">
        {name}
      </p>

      {/* Indicateur de copie */}
      <div className={`
        absolute top-2 right-2 opacity-0 group-hover:opacity-100 
        transition-opacity duration-200
        ${copied ? 'opacity-100' : ''}
      `}>
        {copied ? (
          <div className="w-5 h-5 text-primary">
            <Check size={16} />
          </div>
        ) : (
          <div className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200">
            <Copy size={16} />
          </div>
        )}
      </div>

      {/* Effet de hover subtil */}
      <div className={`
        absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
      `} />
    </div>
  );
};