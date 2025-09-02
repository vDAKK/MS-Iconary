/**
 * Utilitaire pour charger des icônes SVG depuis un dossier
 * 
 * Exemple d'utilisation avec Vite :
 * 
 * 1. Placer vos fichiers SVG dans public/icons/
 * 2. Utiliser loadIconsFromFolder() pour les charger dynamiquement
 */

export interface IconFile {
  name: string;
  svg: string;
  path: string;
}

/**
 * Charge une icône SVG depuis un chemin
 */
export const loadSvgIcon = async (path: string): Promise<string> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement de ${path}: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Erreur lors du chargement de l\'icône:', error);
    return '';
  }
};

/**
 * Charge toutes les icônes depuis un dossier (nécessite une liste des fichiers)
 * 
 * Exemple d'utilisation :
 * const iconNames = ['home.svg', 'user.svg', 'settings.svg'];
 * const icons = await loadIconsFromFolder('/icons/', iconNames);
 */
export const loadIconsFromFolder = async (
  folderPath: string, 
  iconNames: string[]
): Promise<IconFile[]> => {
  const icons: IconFile[] = [];
  
  for (const iconName of iconNames) {
    const path = `${folderPath}${iconName}`;
    const svg = await loadSvgIcon(path);
    
    if (svg) {
      const name = iconName.replace('.svg', '');
      icons.push({
        name,
        svg,
        path
      });
    }
  }
  
  return icons;
};

/**
 * Alternative avec import.meta.glob (Vite uniquement)
 * 
 * Exemple d'utilisation dans un composant :
 * 
 * const iconModules = import.meta.glob('/public/icons/*.svg', { 
 *   as: 'raw', 
 *   eager: true 
 * });
 * 
 * const icons = Object.entries(iconModules).map(([path, svg]) => ({
 *   name: path.split('/').pop()?.replace('.svg', '') || '',
 *   svg: svg as string,
 *   path
 * }));
 */
export const processViteIconModules = (
  iconModules: Record<string, string>
): IconFile[] => {
  return Object.entries(iconModules).map(([path, svg]) => ({
    name: path.split('/').pop()?.replace('.svg', '') || '',
    svg: svg as string,
    path
  }));
};

/**
 * Script Node.js pour générer automatiquement la liste des icônes
 * 
 * Créer un fichier scripts/generate-icons.js :
 * 
 * const fs = require('fs');
 * const path = require('path');
 * 
 * const iconsDir = path.join(__dirname, '../public/icons');
 * const outputFile = path.join(__dirname, '../src/data/generated-icons.ts');
 * 
 * // Lire tous les fichiers SVG
 * const svgFiles = fs.readdirSync(iconsDir)
 *   .filter(file => file.endsWith('.svg'));
 * 
 * // Générer le code TypeScript
 * let tsContent = 'export const iconFiles = [\n';
 * svgFiles.forEach(file => {
 *   tsContent += `  '${file}',\n`;
 * });
 * tsContent += '];\n\n';
 * 
 * tsContent += 'export const iconsData = [\n';
 * svgFiles.forEach(file => {
 *   const name = file.replace('.svg', '');
 *   const svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf8');
 *   tsContent += `  {\n    name: '${name}',\n    svg: \`${svgContent}\`,\n  },\n`;
 * });
 * tsContent += '];\n';
 * 
 * fs.writeFileSync(outputFile, tsContent);
 * console.log(`Généré ${svgFiles.length} icônes dans ${outputFile}`);
 * 
 * Puis ajouter dans package.json :
 * "scripts": {
 *   "generate-icons": "node scripts/generate-icons.js"
 * }
 */