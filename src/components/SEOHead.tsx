import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEOHead = ({
  title = "MS-Iconary - Collection d'Icônes SVG Microsoft | Copie en 1 Clic",
  description = "Collection premium d'icônes SVG Microsoft avec copie d'image, code SVG et téléchargement en 1 clic. Plus de 100 icônes Azure, Office, Teams optimisées pour développeurs.",
  keywords = "icônes SVG Microsoft, Azure icons, Office icons, Teams icons, téléchargement SVG, copie icônes, développeur, design",
  canonical = "https://ms-iconary.com/",
  ogImage = "https://ms-iconary.com/favicon.ico"
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Update canonical link
    const updateCanonical = (url: string) => {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    };
    
    // Update meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', canonical, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);
    
    updateCanonical(canonical);
    
  }, [title, description, keywords, canonical, ogImage]);
  
  return null;
};
