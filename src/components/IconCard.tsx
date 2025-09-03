import { useClipboard } from '@/hooks/useClipboard';
import { Check, Copy, Download, Code } from 'lucide-react';
import { useState } from 'react';
interface IconCardProps {
  name: string;
  svg: string;
  className?: string;
  style?: React.CSSProperties;
}
export const IconCard = ({
  name,
  svg,
  className = '',
  style
}: IconCardProps) => {
  const {
    copyImageToClipboard,
    copyTextToClipboard,
    downloadSvg,
    copied
  } = useClipboard();
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const handleCopyImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyImageToClipboard(svg, name);
  };
  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyTextToClipboard(svg, name);
  };
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSvg(svg, name);
  };
  const handleCardClick = () => {
    // Action par défaut : copier l'image
    copyImageToClipboard(svg, name);
  };
  return <div className={`
        relative group cursor-pointer rounded-xl p-6 
        glass border border-border/50
        hover:border-primary/30 hover:shadow-glow
        transition-all duration-smooth ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        animate-fade-in
        ${className}
      `} style={style} onClick={handleCardClick} onMouseEnter={() => {
      setIsHovered(true);
      setShowActions(true);
    }} onMouseLeave={() => {
      setIsHovered(false);
      setTimeout(() => setShowActions(false), 200);
    }}>
    {/* Effet de gradient au hover */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-smooth" />

    {/* Icône SVG */}
    <div className="relative flex items-center justify-center h-12 w-12 mx-auto mb-4">
      <div 
        className="text-muted-foreground group-hover:text-primary transition-colors duration-smooth transform group-hover:scale-110 w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-8 [&>svg]:max-h-8" 
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
    </div>

    {/* Nom de l'icône */}
    <p className="relative text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors duration-smooth font-medium">
      {name}
    </p>

    {/* Actions rapides */}
    <div className={`
        absolute top-2 right-2 flex flex-col gap-1
        opacity-0 group-hover:opacity-100 
        transition-all duration-smooth transform
        ${isHovered ? 'translate-y-0' : 'translate-y-2'}
      `}>
      {/* Copier image (action principale) */}
      <button onClick={handleCopyImage} className={`
            p-1.5 rounded-lg glass backdrop-blur-sm
            border border-border/30 hover:border-primary/50
            transition-all duration-smooth
            ${copied ? 'bg-accent/20 border-accent scale-110' : 'hover:bg-primary/10'}
          `} title="Copier comme image">
        {copied ? <Check className="w-3.5 h-3.5 text-accent-foreground animate-scale-in" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />}
      </button>

      {/* Actions secondaires */}
      <button onClick={handleCopyCode} className="
                p-1.5 rounded-lg glass backdrop-blur-sm
                border border-border/30 hover:border-primary/50
                hover:bg-primary/10 transition-all duration-smooth
                animate-scale-in
              " title="Copier le code SVG">
        <Code className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
      </button>

      <button onClick={handleDownload} className="
                p-1.5 rounded-lg glass backdrop-blur-sm
                border border-border/30 hover:border-primary/50
                hover:bg-primary/10 transition-all duration-smooth
                animate-scale-in
              " title="Télécharger SVG">
        <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
      </button>
    </div>

    {/* Badge "Copié" */}
    {copied && <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-md animate-scale-in shadow-lg border border-accent/30">
      Copié !
    </div>}

    {/* Effet shimmer subtil */}
    <div className={`
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-transparent via-primary/5 to-transparent
        opacity-0 group-hover:opacity-100
        animate-shimmer bg-[length:200%_100%]
        transition-opacity duration-slow
      `} />

    {/* Indicateur d'action principale */}
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-smooth">

    </div>
  </div>;
};