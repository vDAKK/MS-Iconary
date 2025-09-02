import { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { IconCard } from '@/components/IconCard';
import { iconsData } from '@/data/icons';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrage des icônes basé sur la recherche
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return iconsData;
    
    const query = searchQuery.toLowerCase().trim();
    return iconsData.filter(icon => {
      const nameMatch = icon.name.toLowerCase().includes(query);
      const categoryMatch = icon.category?.toLowerCase().includes(query);
      const keywordsMatch = icon.keywords?.some(keyword => 
        keyword.toLowerCase().includes(query)
      );
      
      return nameMatch || categoryMatch || keywordsMatch;
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-to-r from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Galerie d'Icônes SVG
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cliquez sur une icône pour copier son code SVG dans votre presse-papier
            </p>
            
            {/* Barre de recherche */}
            <div className="pt-4">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher des icônes..."
              />
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            {filteredIcons.length} icône{filteredIcons.length > 1 ? 's' : ''} 
            {searchQuery && ` trouvée${filteredIcons.length > 1 ? 's' : ''} pour "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* Grille d'icônes */}
      <main className="container mx-auto px-4 pb-12">
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {filteredIcons.map((icon, index) => (
              <IconCard
                key={`${icon.name}-${index}`}
                name={icon.name}
                svg={icon.svg}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">
              Aucune icône trouvée pour "{searchQuery}"
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Essayez avec un autre terme de recherche
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 mt-auto">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Galerie d'icônes SVG • Cliquez pour copier • {iconsData.length} icônes disponibles
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;