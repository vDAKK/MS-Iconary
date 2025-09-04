import { pipeline, cos_sim } from '@huggingface/transformers';

export interface IconEmbedding {
  name: string;
  embedding: number[];
  text: string; // Le texte combiné utilisé pour générer l'embedding
}

export class SemanticSearchService {
  private static extractor: any = null;
  private static iconEmbeddings: IconEmbedding[] = [];
  private static isInitialized = false;

  // Initialiser le modèle d'embeddings
  static async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing semantic search...');
      this.extractor = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1',
        { 
          device: 'webgpu',
          // Fallback to CPU if WebGPU is not available
          dtype: 'fp32'
        }
      );
      this.isInitialized = true;
      console.log('Semantic search initialized successfully');
    } catch (error) {
      console.error('Failed to initialize semantic search:', error);
      // Fallback to CPU
      try {
        this.extractor = await pipeline(
          'feature-extraction',
          'mixedbread-ai/mxbai-embed-xsmall-v1',
          { device: 'cpu' }
        );
        this.isInitialized = true;
        console.log('Semantic search initialized on CPU');
      } catch (cpuError) {
        console.error('Failed to initialize semantic search on CPU:', cpuError);
        throw cpuError;
      }
    }
  }

  // Générer des embeddings pour toutes les icônes
  static async generateIconEmbeddings(icons: any[], maxIcons: number = 200) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Limiter le nombre d'icônes pour éviter la surcharge
    const iconsToProcess = icons.slice(0, maxIcons);
    console.log(`Generating embeddings for ${iconsToProcess.length} icons (limited from ${icons.length})...`);
    
    this.iconEmbeddings = [];

    // Traiter par batch plus petits
    const batchSize = 5;
    for (let i = 0; i < iconsToProcess.length; i += batchSize) {
      const batch = iconsToProcess.slice(i, i + batchSize);
      
      for (const icon of batch) {
        try {
          // Créer un texte descriptif pour l'icône
          const descriptiveText = this.createDescriptiveText(icon);
          
          // Générer l'embedding
          const embedding = await this.extractor(descriptiveText, {
            pooling: 'mean',
            normalize: true
          });
          
          this.iconEmbeddings.push({
            name: icon.name,
            embedding: embedding.tolist()[0], // Convertir en array
            text: descriptiveText
          });
        } catch (error) {
          console.warn(`Failed to generate embedding for ${icon.name}:`, error);
        }
      }
      
      // Délai plus long pour ne pas surcharger
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Progress indicator
      if (i % 20 === 0) {
        console.log(`Progress: ${i + batchSize}/${iconsToProcess.length} embeddings generated`);
      }
    }
    
    console.log(`✅ Generated embeddings for ${this.iconEmbeddings.length} icons (${((this.iconEmbeddings.length / icons.length) * 100).toFixed(1)}% of total)`);
  }

  // Générer des embeddings supplémentaires à la demande
  static async generateEmbeddingOnDemand(icon: any): Promise<boolean> {
    if (!this.isInitialized) return false;
    
    // Vérifier si l'embedding existe déjà
    if (this.iconEmbeddings.find(e => e.name === icon.name)) {
      return true;
    }

    try {
      const descriptiveText = this.createDescriptiveText(icon);
      const embedding = await this.extractor(descriptiveText, {
        pooling: 'mean',
        normalize: true
      });
      
      this.iconEmbeddings.push({
        name: icon.name,
        embedding: embedding.tolist()[0],
        text: descriptiveText
      });
      
      return true;
    } catch (error) {
      console.warn(`Failed to generate on-demand embedding for ${icon.name}:`, error);
      return false;
    }
  }

  // Créer un texte descriptif pour une icône
  private static createDescriptiveText(icon: any): string {
    const parts = [
      icon.name,
      icon.category || '',
      ...(icon.keywords || [])
    ];

    // Ajouter des synonymes et des concepts liés basés sur le nom
    const synonyms = this.getSynonyms(icon.name);
    parts.push(...synonyms);

    return parts.filter(Boolean).join(' ').toLowerCase();
  }

  // Obtenir des synonymes et concepts liés
  private static getSynonyms(iconName: string): string[] {
    const synonymMap: { [key: string]: string[] } = {
      // Validation/Success
      'check': ['validation', 'success', 'correct', 'done', 'complete', 'ok', 'approve'],
      'tick': ['validation', 'success', 'correct', 'done', 'complete', 'ok'],
      
      // Erreurs/Alertes
      'warning': ['alert', 'caution', 'danger', 'error', 'problem'],
      'error': ['warning', 'alert', 'danger', 'problem', 'issue', 'bug'],
      'alert': ['warning', 'error', 'danger', 'notification'],
      
      // Actions
      'add': ['plus', 'create', 'new', 'insert'],
      'delete': ['remove', 'trash', 'bin', 'erase'],
      'edit': ['modify', 'change', 'update', 'pencil'],
      'save': ['store', 'keep', 'preserve', 'disk'],
      
      // Navigation
      'home': ['house', 'main', 'start', 'dashboard'],
      'back': ['return', 'previous', 'arrow left'],
      'forward': ['next', 'continue', 'arrow right'],
      
      // Communication
      'mail': ['email', 'message', 'envelope', 'letter'],
      'phone': ['call', 'telephone', 'contact'],
      'chat': ['message', 'conversation', 'talk'],
      
      // Fichiers
      'document': ['file', 'paper', 'text', 'doc'],
      'folder': ['directory', 'collection', 'group'],
      'download': ['save', 'get', 'fetch', 'retrieve'],
      'upload': ['send', 'put', 'transfer'],
      
      // Interface
      'menu': ['hamburger', 'navigation', 'list', 'options'],
      'settings': ['config', 'preferences', 'gear', 'options'],
      'search': ['find', 'look', 'magnify', 'explore'],
      'filter': ['sort', 'organize', 'refine']
    };

    const name = iconName.toLowerCase();
    const matches: string[] = [];

    // Recherche exacte
    if (synonymMap[name]) {
      matches.push(...synonymMap[name]);
    }

    // Recherche partielle
    Object.keys(synonymMap).forEach(key => {
      if (name.includes(key) || key.includes(name)) {
        matches.push(...synonymMap[key]);
      }
    });

    return [...new Set(matches)]; // Supprimer les doublons
  }

  // Recherche sémantique avec génération d'embeddings à la demande
  static async semanticSearch(query: string, icons: any[], limit: number = 20): Promise<{ name: string; score: number }[]> {
    if (!this.isInitialized) {
      console.warn('Semantic search not initialized');
      return [];
    }

    try {
      // Générer l'embedding pour la requête
      const queryEmbedding = await this.extractor(query, {
        pooling: 'mean',
        normalize: true
      });
      
      const queryVector = queryEmbedding.tolist()[0];

      // Générer des embeddings pour les icônes qui n'en ont pas encore
      const missingIcons = icons.filter(icon => 
        !this.iconEmbeddings.find(e => e.name === icon.name)
      );

      if (missingIcons.length > 0) {
        console.log(`Generating embeddings for ${missingIcons.length} missing icons...`);
        for (const icon of missingIcons.slice(0, 50)) { // Limiter à 50 icônes supplémentaires
          await this.generateEmbeddingOnDemand(icon);
        }
      }

      // Calculer les similarités uniquement pour les icônes avec embeddings
      const availableEmbeddings = this.iconEmbeddings.filter(embedding =>
        icons.find(icon => icon.name === embedding.name)
      );

      const similarities = availableEmbeddings.map(icon => ({
        name: icon.name,
        score: this.cosineSimilarity(queryVector, icon.embedding)
      }));

      // Trier par score décroissant et retourner les meilleurs résultats
      return similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .filter(result => result.score > 0.2); // Seuil de pertinence plus bas
    } catch (error) {
      console.error('Semantic search failed:', error);
      return [];
    }
  }

  // Calculer la similarité cosinus entre deux vecteurs
  private static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Vérifier si le service est prêt
  static isReady(): boolean {
    return this.isInitialized && this.iconEmbeddings.length > 0;
  }

  // Obtenir des statistiques
  static getStats() {
    return {
      initialized: this.isInitialized,
      embeddingsCount: this.iconEmbeddings.length,
      ready: this.isReady()
    };
  }
}