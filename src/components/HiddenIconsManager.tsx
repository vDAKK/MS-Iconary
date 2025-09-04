import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Download } from "lucide-react";
import { unhideIcon } from "@/data/icons";
import { useToast } from "@/hooks/use-toast";
import hiddenIconsConfig from '../data/hidden-icons.json';

export const HiddenIconsManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleUnhide = async (iconName: string) => {
    await unhideIcon(iconName);
    toast({
      title: "Icône rendue visible",
      description: `Consultez la console pour mettre à jour le fichier hidden-icons.json dans GitHub.`,
      duration: 6000,
    });
  };

  const downloadConfig = () => {
    const dataStr = JSON.stringify(hiddenIconsConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hidden-icons.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <EyeOff className="w-4 h-4 mr-2" />
          Icônes masquées ({hiddenIconsConfig.hiddenIcons.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Icônes masquées</DialogTitle>
          <DialogDescription>
            Gérez les icônes actuellement masquées. Les modifications nécessitent une mise à jour du fichier dans GitHub.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {hiddenIconsConfig.hiddenIcons.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune icône masquée</p>
          ) : (
            <div className="space-y-2">
              {hiddenIconsConfig.hiddenIcons.map((iconName) => (
                <div key={iconName} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{iconName}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUnhide(iconName)}
                    title="Rendre visible"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadConfig}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger config
            </Button>
          </div>
          
          {hiddenIconsConfig.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour : {new Date(hiddenIconsConfig.lastUpdated).toLocaleString('fr-FR')}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};