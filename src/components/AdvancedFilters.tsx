import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Heart, RotateCcw } from 'lucide-react';

export interface FilterOptions {
  categories: string[];
  showFavoritesOnly: boolean;
  sortBy: 'name' | 'category' | 'recent';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  favoritesCount: number;
  onClearFavorites: () => void;
}

export const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  availableCategories,
  favoritesCount,
  onClearFavorites 
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleReset = () => {
    onFiltersChange({
      categories: [],
      showFavoritesOnly: false,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.showFavoritesOnly || 
                          filters.sortBy !== 'name' || 
                          filters.sortOrder !== 'asc';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative h-12 px-4 rounded-r-none border-r-0">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {filters.categories.length + (filters.showFavoritesOnly ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtres avancés</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Favoris */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Favoris</Label>
              {favoritesCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onClearFavorites}>
                  <X className="w-3 h-3 mr-1" />
                  Vider
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorites-only"
                checked={filters.showFavoritesOnly}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, showFavoritesOnly: !!checked })
                }
              />
              <Label htmlFor="favorites-only" className="text-sm flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Mes favoris seulement ({favoritesCount})
              </Label>
            </div>
          </div>

          {/* Catégories */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Catégories</Label>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryToggle(category, !!checked)}
                  />
                  <Label 
                    htmlFor={`category-${category}`} 
                    className="text-sm font-normal capitalize"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Trier par</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value: any) => 
                  onFiltersChange({ ...filters, sortBy: value })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="category">Catégorie</SelectItem>
                  <SelectItem value="recent">Récent</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortOrder}
                onValueChange={(value: any) => 
                  onFiltersChange({ ...filters, sortOrder: value })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">A → Z</SelectItem>
                  <SelectItem value="desc">Z → A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtres actifs */}
          {filters.categories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Catégories sélectionnées</Label>
              <div className="flex flex-wrap gap-1">
                {filters.categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="secondary" 
                    className="text-xs cursor-pointer"
                    onClick={() => handleCategoryToggle(category, false)}
                  >
                    {category}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};