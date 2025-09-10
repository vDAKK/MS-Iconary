import { useClipboard } from '@/hooks/useClipboard';
import { Check, Copy, Download, Code, Trash2, Palette, Heart } from 'lucide-react';
import { useState, useRef } from 'react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { IconPreviewModal } from './IconPreviewModal';
import { useToast } from '@/hooks/use-toast';
import { hideIcon } from '@/data/icons';

interface IconCardProps {
  name: string;
  svg: string;
  filePath: string; // Ajout du chemin de fichier
  isAdminMode?: boolean;
  onDelete?: (filePath: string) => void;
  className?: string;
  style?: React.CSSProperties;
  isFavorite?: boolean;
  onToggleFavorite?: (name: string) => void;
}
export const IconCard = ({
  name,
  svg,
  filePath,
  isAdminMode = false,
  onDelete,
  className = '',
  style,
  isFavorite = false,
  onToggleFavorite
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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { toast } = useToast();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer et normaliser le SVG pour l'affichage dans la carte
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

  // Fonction pour normaliser la taille du SVG pour l'affichage dans la carte
  const normalizeSvgForCard = (svgContent: string): string => {
    let normalized = cleanSvg(svgContent);
    
    // Forcer une taille standard pour l'affichage dans la carte (24x24)
    normalized = normalized.replace(/(<svg[^>]*)\s+width="[^"]*"/g, '$1');
    normalized = normalized.replace(/(<svg[^>]*)\s+height="[^"]*"/g, '$1');
    normalized = normalized.replace(/<svg([^>]*)>/, '<svg$1 width="24" height="24">');
    
    // S'assurer qu'il y a un viewBox approprié pour que l'icône s'affiche correctement
    if (!normalized.includes('viewBox=')) {
      // Essayer de détecter la taille originale depuis le SVG original
      const originalWidthMatch = svgContent.match(/width="([^"]+)"/);
      const originalHeightMatch = svgContent.match(/height="([^"]+)"/);
      
      if (originalWidthMatch && originalHeightMatch) {
        const origW = parseFloat(originalWidthMatch[1]);
        const origH = parseFloat(originalHeightMatch[1]);
        if (!isNaN(origW) && !isNaN(origH)) {
          normalized = normalized.replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 ${origW} ${origH}">`);
        } else {
          normalized = normalized.replace(/<svg([^>]*)>/, '<svg$1 viewBox="0 0 18 18">');
        }
      } else {
        normalized = normalized.replace(/<svg([^>]*)>/, '<svg$1 viewBox="0 0 18 18">');
      }
    }
    
    return normalized;
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
      onDelete(filePath);
      toast({
        title: "Icône supprimée",
        description: `L'icône "${name}" a été supprimée temporairement.`,
      });
    }
    setShowDeleteModal(false);
  };

  const confirmHide = async () => {
    try {
      await hideIcon(filePath);
      toast({
        title: "Icône masquée", 
        description: `L'icône "${name}" a été masquée. Consultez la console pour la configuration à committer dans GitHub.`,
        duration: 8000,
      });
    } catch (error) {
      console.error('Erreur lors du masquage:', error);
    }
    setShowDeleteModal(false);
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    // Ne pas déclencher si on clique sur un bouton
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Gérer le double-clic pour ouvrir la modal
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      // Double-clic détecté - ouvrir la modal
      setShowPreviewModal(true);
      return;
    }
    
    // Premier clic - programmer la copie avec délai
    clickTimeoutRef.current = setTimeout(async () => {
      clickTimeoutRef.current = null;
      console.log('Card click for:', name);
      try {
        await copyImageToClipboard(cleanSvg(svg), name);
      } catch (error) {
        console.error('Error copying image:', error);
      }
    }, 250);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreviewModal(true);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const button = e.currentTarget as HTMLButtonElement;
    const buttonRect = button.getBoundingClientRect();
    
    if (!isFavorite) {
      // Effet confettis pour ajouter aux favoris
      createConfettiEffect(buttonRect);
    } else {
      // Effet de désintégration pour retirer des favoris
      createDisintegrationEffect(buttonRect);
    }
    
    onToggleFavorite?.(name);
  };

  const createConfettiEffect = (buttonRect: DOMRect) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
    
    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'fixed w-2 h-2 rounded-full pointer-events-none z-50';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = buttonRect.left + buttonRect.width / 2 + 'px';
      confetti.style.top = buttonRect.top + buttonRect.height / 2 + 'px';
      
      document.body.appendChild(confetti);
      
      const angle = (Math.PI * 2 * i) / 15;
      const velocity = 50 + Math.random() * 50;
      const gravity = 0.5;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity;
      let x = 0;
      let y = 0;
      
      const animate = () => {
        x += vx;
        y += vy;
        vy += gravity;
        
        confetti.style.transform = `translate(${x}px, ${y}px) rotate(${x * 2}deg)`;
        confetti.style.opacity = Math.max(0, 1 - Math.abs(y) / 200).toString();
        
        if (Math.abs(y) < 200) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(confetti);
        }
      };
      
      requestAnimationFrame(animate);
    }
  };

  const createDisintegrationEffect = (buttonRect: DOMRect) => {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed w-1 h-1 bg-red-500 pointer-events-none z-50 opacity-80';
      particle.style.left = buttonRect.left + buttonRect.width / 2 + 'px';
      particle.style.top = buttonRect.top + buttonRect.height / 2 + 'px';
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 8;
      const velocity = 30 + Math.random() * 20;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity;
      let x = 0;
      let y = 0;
      let opacity = 0.8;
      
      const animate = () => {
        x += vx;
        y += vy;
        vx *= 0.95;
        vy *= 0.95;
        opacity *= 0.92;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity.toString();
        
        if (opacity > 0.01) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(particle);
        }
      };
      
      requestAnimationFrame(animate);
    }
  };
   return (
    <div className={`
        relative group cursor-pointer rounded-xl p-6 
        glass border transition-all duration-smooth ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        animate-fade-in
        ${isFavorite 
          ? 'border-red-400/40 hover:border-red-400/60 shadow-red-500/10 shadow-lg before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-red-500/10 before:via-red-400/5 before:to-red-500/10 before:opacity-80 before:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-transparent after:via-red-400/5 after:to-transparent after:animate-pulse after:pointer-events-none' 
          : 'border-border/50 hover:border-primary/30 hover:shadow-glow'
        }
        ${className}
      `}
      style={style} 
      onMouseEnter={() => {
        setIsHovered(true);
        setShowActions(true);
      }} 
      onMouseLeave={() => {
        setIsHovered(false);
        setTimeout(() => setShowActions(false), 200);
      }}
    >
      
      {/* Zone cliquable pour la copie d'image (sans les boutons) */}
      <div className="absolute inset-0 z-0" onClick={handleCardClick} />
      
      {/* Effet de gradient au hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-smooth" />

      {/* Bouton favoris en haut à gauche (toujours visible si favori) */}
      <div className={`
          absolute top-2 left-2 z-10
          transition-all duration-smooth transform
          ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          ${isHovered ? 'translate-y-0' : 'translate-y-2'}
        `}>
        <button onClick={handleFavoriteToggle} className={`
              p-1.5 rounded-lg glass backdrop-blur-sm
              border transition-all duration-smooth origin-center
              ${isFavorite 
                ? 'bg-red-100/30 border-red-400/60 shadow-red-500/20 shadow-md' 
                : 'border-border/30 hover:border-red-400/50 hover:bg-red-50/10'
              }
            `} title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
          <Heart className={`w-3.5 h-3.5 transition-all duration-smooth ${
            isFavorite ? 'text-red-500 fill-red-500 scale-110 drop-shadow-sm' : 'text-muted-foreground group-hover:text-red-400'
          }`} />
        </button>
      </div>

      {/* Actions rapides en haut à droite */}
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

        {/* Bouton d'édition */}
        <button onClick={handleEditClick} className="
                  p-1.5 rounded-lg glass backdrop-blur-sm
                  border border-border/30 hover:border-accent/50
                  hover:bg-accent/10 transition-all duration-smooth
                  animate-scale-in
                " title="Personnaliser les couleurs">
          <Palette className="w-3.5 h-3.5 text-muted-foreground hover:text-accent-foreground" />
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

      {/* Icône SVG */}
      <div className="relative flex items-center justify-center h-12 w-12 mx-auto mb-4">
        <div className="
          relative w-10 h-10 rounded-lg 
          bg-gradient-to-br from-secondary to-muted
          border border-border/40
          flex items-center justify-center
          transition-all duration-smooth
          group-hover:from-primary/15 group-hover:to-primary/8
          group-hover:border-primary/30 group-hover:shadow-md group-hover:scale-105
          shadow-sm
        ">
          <div 
            className="
              icon-container
              text-foreground group-hover:text-primary
              transition-colors duration-smooth 
              w-6 h-6 flex items-center justify-center
            " 
            style={{ color: 'hsl(var(--foreground))' }}
            dangerouslySetInnerHTML={{ __html: normalizeSvgForCard(svg) }} 
          />
        </div>
      </div>

      {/* Nom de l'icône */}
      <p className="relative text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors duration-smooth font-medium">
        {name}
      </p>

      {/* Effet shimmer subtil */}
      <div className={`
          absolute inset-0 rounded-xl
          bg-gradient-to-r from-transparent via-primary/5 to-transparent
          opacity-0 group-hover:opacity-100
          animate-shimmer bg-[length:200%_100%]
          transition-opacity duration-slow
        `} />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        onHide={confirmHide}
        iconName={name}
      />

      <IconPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        name={name}
        originalSvg={cleanSvg(svg)}
      />
    </div>
  );
};