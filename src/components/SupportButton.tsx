import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Coffee, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const supportOptions = [
    {
      name: "Buy me a coffee",
      url: "https://buymeacoffee.com/dakk", // À remplacer par votre lien
      icon: Coffee,
      description: "Soutenez le projet avec un café ☕",
      amount: "Montant libre"
    },
    {
      name: "PayPal",
      url: "https://paypal.me/DavidCC0", // À remplacer par votre lien
      icon: Heart,
      description: "Don via PayPal",
      amount: "Montant libre"
    }
  ];

  const handleSupportClick = (option: typeof supportOptions[0]) => {
    window.open(option.url, '_blank');
    setIsOpen(false);
    toast({
      title: "Merci beaucoup ! 🙏",
      description: `Vous avez choisi ${option.name}. Votre soutien est très apprécié !`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-12 px-4 rounded-xl gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-smooth"
        >
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          Soutenir le projet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            Soutenir MS-Iconary
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Si vous trouvez MS-Iconary utile, vous pouvez nous soutenir pour maintenir le service gratuit et ajouter de nouvelles fonctionnalités !
          </p>
          
          <div className="space-y-3">
            {supportOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                className="w-full justify-between p-4 h-auto hover:bg-primary/5 hover:border-primary/50"
                onClick={() => handleSupportClick(option)}
              >
                <div className="flex items-center gap-3">
                  <option.icon className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">{option.amount}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </Button>
            ))}
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Votre soutien nous aide à maintenir le site en ligne et à ajouter de nouvelles icônes régulièrement. Merci ! ❤️
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
