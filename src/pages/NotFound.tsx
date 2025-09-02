import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Background décoratif */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center space-y-8 animate-fade-in max-w-lg mx-auto px-6">
        {/* Code d'erreur */}
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-bold gradient-text">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-muted/20 blur-sm">
            404
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Page introuvable
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          {location.pathname && (
            <div className="glass px-4 py-2 rounded-lg border border-border/30 inline-block">
              <code className="text-sm font-mono text-muted-foreground">
                {location.pathname}
              </code>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/" 
            className="
              inline-flex items-center gap-3 px-6 py-3 
              bg-primary text-primary-foreground 
              rounded-lg font-medium
              hover:bg-primary-hover hover:shadow-colored
              transition-all duration-smooth
              transform hover:-translate-y-1
            "
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </a>
          
          <button
            onClick={() => window.history.back()}
            className="
              inline-flex items-center gap-3 px-6 py-3
              glass border border-border/50
              text-foreground rounded-lg font-medium
              hover:border-primary/30 hover:shadow-glow
              transition-all duration-smooth
              transform hover:-translate-y-1
            "
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>

        {/* Suggestions */}
        <div className="pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground mb-4">
            Vous cherchiez peut-être :
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="/" className="px-3 py-1 text-xs bg-muted/50 text-muted-foreground hover:text-foreground rounded-md transition-colors duration-smooth">
              Galerie d'icônes
            </a>
            <a href="/?q=home" className="px-3 py-1 text-xs bg-muted/50 text-muted-foreground hover:text-foreground rounded-md transition-colors duration-smooth">
              Icônes populaires
            </a>
            <a href="/?q=ui" className="px-3 py-1 text-xs bg-muted/50 text-muted-foreground hover:text-foreground rounded-md transition-colors duration-smooth">
              Icônes interface
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;