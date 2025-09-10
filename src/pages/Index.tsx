import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { IconCard } from '@/components/IconCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SEOHead } from '@/components/SEOHead';
import { AdminPasswordModal } from '@/components/AdminPasswordModal';
import { HiddenIconsManager } from '@/components/HiddenIconsManager';
import { AdvancedFilters, FilterOptions } from '@/components/AdvancedFilters';
import { AdBanner } from '@/components/AdBanner';
import { SupportButton } from '@/components/SupportButton';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CookieConsent } from '@/components/CookieConsent';
import { PrivacyPolicy } from '@/components/PrivacyPolicy';
import { iconsData, deleteIcon } from '@/data/icons';
import { useFavorites } from '@/hooks/useFavorites';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Sparkles, Copy, Download, Search, Loader2, Shield } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Système de favoris
  const { favorites, toggleFavorite, isFavorite, clearFavorites, favoritesCount } = useFavorites();
  
  // Filtres avancés
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    showFavoritesOnly: false,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  

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

  // Filtrage et tri des icônes avec logique avancée
  const processedIcons = useMemo(() => {
    let result = iconsData;
    
    // Filtre par recherche textuelle
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(icon => {
        const nameMatch = icon.name.toLowerCase().includes(query);
        const categoryMatch = icon.category?.toLowerCase().includes(query);
        const keywordsMatch = icon.keywords?.some(keyword => 
          keyword.toLowerCase().includes(query)
        );
        
        return nameMatch || categoryMatch || keywordsMatch;
      });
    }
    
    // Filtre par favoris
    if (filters.showFavoritesOnly) {
      result = result.filter(icon => isFavorite(icon.name));
    }
    
    // Filtre par catégories
    if (filters.categories.length > 0) {
      result = result.filter(icon => 
        icon.category && filters.categories.includes(icon.category)
      );
    }
    
    // Tri
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        case 'recent':
          // Simuler un tri par récent basé sur l'index
          comparison = iconsData.indexOf(b) - iconsData.indexOf(a);
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return result;
  }, [searchQuery, forceUpdate, filters, isFavorite]);
  
  // Catégories disponibles pour les filtres
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    iconsData.forEach(icon => {
      if (icon.category) {
        categories.add(icon.category);
      }
    });
    return Array.from(categories).sort();
  }, []);

  // Scroll infini
  const {
    visibleItems: visibleIcons,
    isLoading: isLoadingMore,
    hasMore,
    loadMore,
    visibleCount,
    reset: resetInfiniteScroll
  } = useInfiniteScroll(processedIcons, {
    initialItemsPerPage: 24,
    itemsPerPage: 24 // Charge 24 éléments au lieu de 12
  });

  // Reset du scroll infini quand les filtres changent
  useEffect(() => {
    resetInfiniteScroll();
  }, [processedIcons, resetInfiniteScroll]);

  // SEO dynamique basé sur la recherche
  const seoTitle = searchQuery 
    ? `${searchQuery} - Icônes SVG Microsoft | MS-Iconary`
    : "MS-Iconary - Collection d'Icônes SVG Microsoft | Copie en 1 Clic";
    
  const seoDescription = searchQuery
    ? `Découvrez ${processedIcons.length} icône${processedIcons.length > 1 ? 's' : ''} Microsoft pour "${searchQuery}". Copie d'image, code SVG et téléchargement en 1 clic.`
    : "Collection premium d'icônes SVG Microsoft avec copie d'image, code SVG, téléchargement et personnalisation en 1 clic. Plus de 2000 icônes Azure, Office, Teams et autres optimisées pour développeurs.";

  const handleDeleteIcon = (filePath: string) => {
    deleteIcon(filePath);
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
            <div className="absolute top-6 right-6 flex gap-2">
              {isAdminMode && <HiddenIconsManager />}
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
                Les SVG comme vous ne les aviez jamais vus.
                <br className="hidden md:block" />
                <span className="text-primary font-medium">Cliquez pour copier en tant qu'image SVG</span>, ou utilisez les actions pour son code, le télécharger ou le personnaliser.
              </p>
              
              {/* Zone de recherche */}
              <div className="flex justify-center">
                <SearchBar 
                  value={searchQuery} 
                  onChange={setSearchQuery}
                  placeholder="Rechercher une icône..."
                  className="w-96"
                />
              </div>

              {/* Statistiques */}
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  {visibleCount} icône{visibleCount > 1 ? 's' : ''} affichée{visibleCount > 1 ? 's' : ''} 
                  {processedIcons.length !== visibleCount && ` sur ${processedIcons.length} total${processedIcons.length > 1 ? 'es' : ''}`}
                  {favoritesCount > 0 && (
                    <span className="ml-2 text-red-500">
                      • {favoritesCount} favori{favoritesCount > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Bannière publicitaire discrète */}
        <AdBanner position="top" adSlot="1234567890" />

        {/* Grille d'icônes avec scroll infini */}
        <main className="container mx-auto px-6 py-12" role="main">
          {/* Bouton filtres et support au-dessus des icônes */}
          <div className="flex items-center gap-3 mb-6">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={availableCategories}
              favoritesCount={favoritesCount}
              onClearFavorites={clearFavorites}
            />
            <SupportButton />
          </div>

          {visibleIcons.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                {visibleIcons.map((icon, index) => (
                  <IconCard
                    key={`${icon.name}-${index}`}
                    name={icon.name}
                    svg={icon.svg}
                    filePath={icon.filePath}
                    isAdminMode={isAdminMode}
                    onDelete={handleDeleteIcon}
                    isFavorite={isFavorite(icon.name)}
                    onToggleFavorite={toggleFavorite}
                    style={{
                      animationDelay: `${(index % 12) * 50}ms`
                    }}
                  />
                ))}
              </div>
              
              {/* Indicateur de chargement */}
              {isLoadingMore && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Chargement...</span>
                </div>
              )}
              
              {/* Indicateur de fin */}
              {!hasMore && processedIcons.length > 24 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Toutes les icônes ont été affichées
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Aucune icône trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `Aucun résultat pour "${searchQuery}"`
                  : filters.showFavoritesOnly 
                    ? "Aucun favori pour le moment"
                    : "Aucune icône disponible avec ces filtres"
                }
              </p>
              {(searchQuery || filters.categories.length > 0 || filters.showFavoritesOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [],
                      showFavoritesOnly: false,
                      sortBy: 'name',
                      sortOrder: 'asc'
                    });
                  }}
                  className="text-primary hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          {/* Bouton Charger plus */}
          {hasMore && visibleIcons.length > 0 && (
            <div className="flex justify-center py-8">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Charger plus ({processedIcons.length - visibleCount} restantes)
                  </>
                )}
              </button>
            </div>
          )}
        </main>

        {/* Bannière publicitaire discrète en bas */}
        <AdBanner position="bottom" adSlot="0987654321" />

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
                    {iconsData.length} icônes totales
                  </span>
                </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground/60">
                  MS-Iconary • Copie d'image, code SVG, téléchargement et personnalisation
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/50">
                  <span>
                    Réalisé par{' '}
                    <a 
                      href="https://www.linkedin.com/in/david-ghesquiere/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-hover transition-colors underline"
                    >
                      David GHESQUIERE
                    </a>
                  </span>
                  <span>•</span>
                  <PrivacyPolicy />
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Bouton scroll to top */}
        <ScrollToTop />

        {/* Consentement aux cookies */}
        <CookieConsent />

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
