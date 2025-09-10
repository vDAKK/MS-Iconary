import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Cookie, Eye, Server } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          Confidentialité
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Politique de confidentialité - MS-Iconary
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Collecte des données
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MS-Iconary collecte uniquement les données nécessaires au fonctionnement du service :
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Données de navigation (pages visitées, durée de session)</li>
              <li>Préférences utilisateur (thème, favoris) stockées localement</li>
              <li>Données anonymes d'utilisation pour améliorer le service</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              Cookies et publicités
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ce site utilise Google AdSense pour afficher des publicités pertinentes. 
              AdSense peut utiliser des cookies pour personnaliser les annonces selon vos centres d'intérêt.
            </p>
            <div className="bg-muted/30 p-3 rounded-lg mt-2">
              <p className="text-xs text-muted-foreground">
                <strong>Cookies utilisés :</strong> Préférences (thème, favoris), Analytics anonymes, 
                Publicités Google AdSense (optionnel avec votre consentement)
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Server className="w-4 h-4" />
              Partage des données
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vos données ne sont jamais vendues à des tiers. Nous partageons uniquement 
              des données anonymisées avec Google AdSense pour l'affichage publicitaire, 
              conformément à leur politique de confidentialité.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-3">Vos droits (RGPD)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/20 p-3 rounded">
                <strong>Accès :</strong> Consultez vos données stockées
              </div>
              <div className="bg-muted/20 p-3 rounded">
                <strong>Rectification :</strong> Corrigez vos informations
              </div>
              <div className="bg-muted/20 p-3 rounded">
                <strong>Suppression :</strong> Effacez vos données
              </div>
              <div className="bg-muted/20 p-3 rounded">
                <strong>Portabilité :</strong> Exportez vos données
              </div>
            </div>
          </section>

          <section className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Contact :</strong> Pour toute question sur cette politique, 
              contactez-nous via{' '}
              <a 
                href="https://www.linkedin.com/in/david-ghesquiere/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};