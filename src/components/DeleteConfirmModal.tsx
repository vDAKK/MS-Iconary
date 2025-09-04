import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onHide: () => void;
  iconName: string;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, onHide, iconName }: DeleteConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Que voulez-vous faire avec cette icône ?</DialogTitle>
          <DialogDescription>
            Icône sélectionnée : "<strong>{iconName}</strong>"
            <br />
            <br />
            <strong>Masquer</strong> : L'icône sera masquée de manière persistante<br />
            <small className="text-muted-foreground">
              → La configuration sera automatiquement générée pour GitHub
            </small>
            <br />
            <br />
            <strong>Supprimer</strong> : Suppression temporaire (session actuelle uniquement)
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Masquer
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer (temp)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};