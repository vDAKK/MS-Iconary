import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  iconName: string;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, iconName }: DeleteConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer l'icône</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'icône "<strong>{iconName}</strong>" ?
            <br />
            <span className="text-muted-foreground text-xs mt-2 block">
              Note: Cette suppression n'est que temporaire (côté client uniquement)
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};