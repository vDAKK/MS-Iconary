export interface IconData {
  name: string;
  svg: string;
  category?: string;
  keywords?: string[];
  filePath?: string; // Ajout du chemin de fichier pour identification unique
}

export interface HiddenIconsConfig {
  hiddenIcons: string[]; // Maintenant basé sur les chemins de fichiers
  lastUpdated: string;
}

// Import hidden icons configuration
import hiddenIconsConfig from './hidden-icons.json';

// Dynamically import all SVG files from src/icons, excluding hidden folder
const iconModules = import.meta.glob('/src/icons/**/*.svg', { 
  query: '?raw', 
  import: 'default',
  eager: true 
});

// Filter out icons in hidden folders AND icons in hidden-icons.json
const filteredIconModules = Object.fromEntries(
  Object.entries(iconModules).filter(([path]) => {
    // Exclude hidden folders
    if (path.includes('/hidden/')) return false;
    
    // Exclude icons listed in hidden-icons.json (based on file path)
    return !hiddenIconsConfig.hiddenIcons.includes(path);
  })
);

function cleanIconName(rawName: string): string {
  let cleaned = rawName;
  
  // Extract size info before cleaning (e.g., "_16", "_32", "_24")
  const sizeMatch = rawName.match(/_(\d+)_/);
  const size = sizeMatch ? sizeMatch[1] : null;
  
  // Remove numeric prefixes (e.g., "00028-", "00030-", "030777508")
  cleaned = cleaned.replace(/^\d+[-\s]?/, '');
  
  // Remove common prefixes (case insensitive)
  cleaned = cleaned.replace(/^icon[\s-]?service[\s-]?/i, '');
  cleaned = cleaned.replace(/^icon[\s-]?/i, '');
  
  // Remove size suffixes (e.g., "_32", "_40", "_24") 
  cleaned = cleaned.replace(/_\d+_/g, '_');
  
  // Remove style suffixes (regular, filled, non-item, etc.)
  cleaned = cleaned.replace(/_(regular|filled|non-item|outline|solid)$/i, '');
  
  // Replace hyphens and underscores with spaces
  cleaned = cleaned.replace(/[-_]/g, ' ');
  
  // Remove content in parentheses but keep the word before if relevant
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
  
  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Capitalize each word properly
  cleaned = cleaned
    .split(' ')
    .map(word => {
      // Keep common acronyms uppercase
      if (['AI', 'ML', 'API', 'UI', 'UX', 'SDK', 'URL', 'HTTP', 'CSS', 'HTML', 'JS'].includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  // Add size suffix if available to differentiate variants
  if (size) {
    cleaned += ` ${size}px`;
  }
  
  return cleaned || rawName;
}

function extractIconName(path: string): string {
  const rawName = path.split('/').pop()?.replace('.svg', '') || '';
  return cleanIconName(rawName);
}

function extractCategory(path: string): string {
  const parts = path.split('/');
  const iconIndex = parts.findIndex(part => part === 'icons');
  if (iconIndex !== -1 && iconIndex < parts.length - 2) {
    return parts[iconIndex + 1];
  }
  return 'general';
}

function generateKeywords(name: string, category: string): string[] {
  const nameKeywords = name.toLowerCase().split(/[_-]|\s+/);
  const categoryKeywords = category.toLowerCase().split(/[_-]|\s+/);
  return [...nameKeywords, ...categoryKeywords, name.toLowerCase(), category.toLowerCase()];
}

// Convert imported SVG modules to IconData format
let iconsDataArray: IconData[] = Object.entries(filteredIconModules).map(([path, content]) => {
  const name = extractIconName(path);
  const category = extractCategory(path);
  
  return {
    name,
    category,
    svg: content as string,
    keywords: generateKeywords(name, category),
    filePath: path // Stocker le chemin pour identification unique
  };
}).sort((a, b) => a.name.localeCompare(b.name));

// Fonction pour "masquer" une icône de manière persistante
export const hideIcon = async (filePath: string): Promise<void> => {
  // Ajouter le chemin de fichier à la liste des masquées
  const newHiddenConfig = {
    hiddenIcons: [...hiddenIconsConfig.hiddenIcons, filePath],
    lastUpdated: new Date().toISOString()
  };
  
  // Mettre à jour la configuration locale
  (hiddenIconsConfig as any).hiddenIcons.push(filePath);
  (hiddenIconsConfig as any).lastUpdated = newHiddenConfig.lastUpdated;
  
  // Supprimer de la liste affichée
  iconsDataArray = iconsDataArray.filter(icon => icon.filePath !== filePath);
  
  // Instructions pour l'utilisateur
  console.log(`Pour masquer définitivement l'icône "${filePath}", mettez à jour src/data/hidden-icons.json:`);
  console.log(JSON.stringify(newHiddenConfig, null, 2));
};

// Fonction pour rendre visible une icône masquée
export const unhideIcon = async (filePath: string): Promise<void> => {
  const newHiddenConfig = {
    hiddenIcons: hiddenIconsConfig.hiddenIcons.filter(path => path !== filePath),
    lastUpdated: new Date().toISOString()
  };
  
  // Mettre à jour la configuration locale
  (hiddenIconsConfig as any).hiddenIcons = newHiddenConfig.hiddenIcons;
  (hiddenIconsConfig as any).lastUpdated = newHiddenConfig.lastUpdated;
  
  console.log(`Pour rendre visible l'icône "${filePath}", mettez à jour src/data/hidden-icons.json:`);
  console.log(JSON.stringify(newHiddenConfig, null, 2));
};

// Fonction pour supprimer une icône (temporaire côté client)
export const deleteIcon = (filePath: string): void => {
  iconsDataArray = iconsDataArray.filter(icon => icon.filePath !== filePath);
};

// Export de la liste d'icônes
export const iconsData: IconData[] = iconsDataArray;