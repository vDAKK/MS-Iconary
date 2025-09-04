import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { IconCard } from '@/components/IconCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SEOHead } from '@/components/SEOHead';
import { AdminPasswordModal } from '@/components/AdminPasswordModal';
import { iconsData, deleteIcon } from '@/data/icons';
import { Sparkles, Copy, Download, Search, Palette, Shield } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Raccourci de recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      
      // Raccourci caché pour le mode admin (Ctrl+Shift+Alt+A)
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'A') {
        e.preventDefault();
        setShowPasswordModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtrage des icônes basé sur la recherche avec limite de performance
  const filteredIcons = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let result = iconsData;
    
    if (query) {
      result = iconsData.filter(icon => {
        const nameMatch = icon.name.toLowerCase().includes(query);
        const categoryMatch = icon.category?.toLowerCase().includes(query);
        const keywordsMatch = icon.keywords?.some(keyword => 
          keyword.toLowerCase().includes(query)
        );
        
        return nameMatch || categoryMatch || keywordsMatch;
      });
    }
    
    // Limiter à 50 icônes pour éviter les lags
    return result.slice(0, 50);
  }, [searchQuery, forceUpdate]);

  // SEO dynamique basé sur la recherche
  const seoTitle = searchQuery 
    ? `${searchQuery} - Icônes SVG Microsoft | MS-Iconary`
    : "MS-Iconary - Collection d'Icônes SVG Microsoft | Copie en 1 Clic";
    
  const seoDescription = searchQuery
    ? `Découvrez ${filteredIcons.length} icône${filteredIcons.length > 1 ? 's' : ''} Microsoft pour "${searchQuery}". Copie d'image, code SVG et téléchargement en 1 clic.`
    : "Collection premium d'icônes SVG Microsoft avec copie d'image, code SVG et téléchargement en 1 clic. Plus de 100 icônes Azure, Office, Teams optimisées pour développeurs.";

  const handleDeleteIcon = (iconName: string) => {
    deleteIcon(iconName);
    setForceUpdate(prev => prev + 1); // Force le re-render
  };

  return (
    <>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={searchQuery ? `${searchQuery}, icônes SVG Microsoft, Azure icons, Office icons` : undefined}
      />
      
      <div className="min-h-screen">
        {/* Background décoratif */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-light/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <header className="relative border-b border-border/30 glass backdrop-blur-xl" role="banner">
          <div className="container mx-auto px-6 py-12">
            {/* Toggle de thème */}
            <div className="absolute top-6 right-6">
              <ThemeToggle />
            </div>
            
            <div className="text-center space-y-6 animate-fade-in">
              {/* Badge "Nouveau" */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full border border-accent/30">
                <Sparkles className="w-4 h-4" />
                Galerie SVG Microsoft
              </div>
              
              {/* Titre principal */}
              <h1 className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
                Microsoft Iconary
              </h1>
              
              {/* Sous-titre */}
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Une collection soigneusement sélectionnée d'icônes SVG des outils Microsoft.
                <br className="hidden md:block" />
                <span className="text-primary font-medium">Cliquez pour copier en tant qu'image</span>, ou utilisez les actions pour le code SVG et le téléchargement.
              </p>
              
              {/* Barre de recherche */}
              <div className="pt-6">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Rechercher parmi notre collection..."
                />
              </div>
            </div>
          </div>
        </header>

        {/* Stats et info */}
        <section className="container mx-auto px-6 py-8" aria-label="Statistiques de la collection">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-3 px-4 py-2 glass rounded-lg border border-border/30">
              <Copy className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="text-lg font-semibold text-foreground">
                  {filteredIcons.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Icône{filteredIcons.length > 1 ? 's' : ''} affichée{filteredIcons.length > 1 ? 's' : ''} 
                  {filteredIcons.length === 50 ? ' (max)' : ''}
                </div>
              </div>
            </div>

            {searchQuery && (
              <div className="flex items-center gap-3 px-4 py-2 glass rounded-lg border border-border/30 animate-scale-in">
                <Download className="w-5 h-5 text-accent-foreground" />
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">
                    Résultats pour
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    "{searchQuery}"
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground/80 flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted/30 rounded text-xs border border-border/30">Ctrl+K</kbd>
              pour rechercher
            </div>
          </div>
        </section>

        {/* Grille d'icônes */}
        <main className="container mx-auto px-6 pb-16" role="main" aria-label="Collection d'icônes SVG Microsoft">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
              {filteredIcons.map((icon, index) => (
                <IconCard
                  key={`${icon.name}-${index}`}
                  name={icon.name}
                  svg={icon.svg}
                  isAdminMode={isAdminMode}
                  onDelete={handleDeleteIcon}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full glass border border-border/30 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucune icône trouvée
              </h3>
              <p className="text-muted-foreground mb-6">
                Aucun résultat pour "{searchQuery}". Essayez un autre terme de recherche.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors duration-smooth hover:shadow-colored"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/30 glass backdrop-blur-xl mt-auto" role="contentinfo">
          <div className="container mx-auto px-6 py-12">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copie image & code
                  </span>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Téléchargement SVG
                  </span>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {iconsData.length} icônes (50 max affichées)
                  </span>
                </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground/60">
                  MS-Iconary • Copie d'image, code SVG et téléchargement
                </div>
                <div className="text-xs text-muted-foreground/50">
                  Réalisé par{' '}
                  <a 
                    href="https://www.linkedin.com/in/david-ghesquiere/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover transition-colors underline"
                  >
                    David GHESQUIERE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Indicateur mode admin */}
        {isAdminMode && (
          <div className="fixed bottom-4 right-4 z-40">
            <div className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium animate-pulse border border-destructive/50">
              <Shield className="w-4 h-4" />
              Mode Admin Actif
            </div>
          </div>
        )}

        {/* Modal de mot de passe admin */}
        <AdminPasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => setIsAdminMode(true)}
        />
      </div>
    </>
  );
};

export default Index;