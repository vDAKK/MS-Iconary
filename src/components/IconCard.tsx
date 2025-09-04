import { useClipboard } from '@/hooks/useClipboard';
import { Check, Copy, Download, Code, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useToast } from '@/hooks/use-toast';

interface IconCardProps {
  name: string;
  svg: string;
  isAdminMode?: boolean;
  onDelete?: (name: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
export const IconCard = ({
  name,
  svg,
  isAdminMode = false,
  onDelete,
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  // Nettoyer le SVG en supprimant les déclarations XML, DOCTYPE, entités et commentaires
  const cleanSvg = (svgContent: string): string => {
    // Créer un ID unique basé sur le nom de l'icône
    const uniqueId = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    let cleaned = svgContent
      // Supprimer la déclaration XML
      .replace(/<\?xml[^>]*\?>/g, '')
      // Supprimer les commentaires
      .replace(/<!--[\s\S]*?-->/g, '')
      // Supprimer DOCTYPE avec ses entités
      .replace(/<!DOCTYPE[^>]*\[[\s\S]*?\]>/g, '')
      // Supprimer les références aux entités dans les attributs
      .replace(/xmlns:\w+="&[^"]*;"/g, '')
      // Supprimer les métadonnées
      .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
      // Nettoyer les espaces multiples et les sauts de ligne
      .replace(/\s+/g, ' ')
      .trim();

    // Rendre les ID uniques pour éviter les conflits entre SVG
    cleaned = cleaned.replace(/id="([^"]+)"/g, `id="${uniqueId}_$1"`);
    cleaned = cleaned.replace(/url\(#([^)]+)\)/g, `url(#${uniqueId}_$1)`);
    cleaned = cleaned.replace(/href="#([^"]+)"/g, `href="#${uniqueId}_$1"`);
    
    return cleaned;
  };

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Copying image for:', name);
    try {
      await copyImageToClipboard(cleanSvg(svg), name);
    } catch (error) {
      console.error('Error copying image:', error);
    }
  };

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Copying code for:', name);
    try {
      await copyTextToClipboard(cleanSvg(svg), name);
    } catch (error) {
      console.error('Error copying code:', error);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Downloading:', name);
    try {
      downloadSvg(cleanSvg(svg), name);
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(name);
      toast({
        title: "Icône supprimée",
        description: `L'icône "${name}" a été supprimée temporairement.`,
      });
    }
    setShowDeleteModal(false);
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    // Ne pas déclencher si on clique sur un bouton
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    console.log('Card click for:', name);
    try {
      await copyImageToClipboard(cleanSvg(svg), name);
    } catch (error) {
      console.error('Error copying image:', error);
    }
  };
  return <div className={`
        relative group cursor-pointer rounded-xl p-6 
        glass border border-border/50
        hover:border-primary/30 hover:shadow-glow
        transition-all duration-smooth ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        animate-fade-in
        ${className}
      `} style={style} onMouseEnter={() => {
      setIsHovered(true);
      setShowActions(true);
    }} onMouseLeave={() => {
      setIsHovered(false);
      setTimeout(() => setShowActions(false), 200);
    }}>
    
    {/* Zone cliquable pour la copie d'image (sans les boutons) */}
    <div className="absolute inset-0 z-0" onClick={handleCardClick} />
    {/* Effet de gradient au hover */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-smooth" />

    {/* Icône SVG */}
    <div className="relative flex items-center justify-center h-12 w-12 mx-auto mb-4">
      <div 
        className="text-muted-foreground group-hover:text-primary transition-colors duration-smooth transform group-hover:scale-110 w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-8 [&>svg]:max-h-8" 
        dangerouslySetInnerHTML={{ __html: cleanSvg(svg) }} 
      />
    </div>

    {/* Nom de l'icône */}
    <p className="relative text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors duration-smooth font-medium">
      {name}
    </p>

    {/* Actions rapides */}
    <div className={`
        absolute top-2 right-2 flex flex-col gap-1 z-10
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

      {/* Bouton de suppression en mode admin */}
      {isAdminMode && (
        <button 
          onClick={handleDelete}
          className="
            p-1.5 rounded-lg glass backdrop-blur-sm
            border border-destructive/30 hover:border-destructive/70
            hover:bg-destructive/20 transition-all duration-smooth
            animate-scale-in
          " 
          title="Supprimer l'icône"
        >
          <Trash2 className="w-3.5 h-3.5 text-destructive hover:text-destructive-foreground" />
        </button>
      )}
    </div>


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

    <DeleteConfirmModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={confirmDelete}
      iconName={name}
    />
  </div>;
};