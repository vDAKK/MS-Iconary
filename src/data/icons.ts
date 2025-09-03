export interface IconData {
  name: string;
  svg: string;
  category?: string;
  keywords?: string[];
}

// Dynamically import all SVG files from src/icons
const iconModules = import.meta.glob('/src/icons/**/*.svg', { 
  query: '?raw', 
  import: 'default',
  eager: true 
});

function extractIconName(path: string): string {
  return path.split('/').pop()?.replace('.svg', '') || '';
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
export const iconsData: IconData[] = Object.entries(iconModules).map(([path, content]) => {
  const name = extractIconName(path);
  const category = extractCategory(path);
  
  return {
    name,
    category,
    svg: content as string,
    keywords: generateKeywords(name, category)
  };
}).sort((a, b) => a.name.localeCompare(b.name));