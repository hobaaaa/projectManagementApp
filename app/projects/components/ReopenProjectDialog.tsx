import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReopenProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
export const ReopenProjectDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: ReopenProjectDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reopen Project</DialogTitle>
        <DialogDescription>
          Are you sure want to reopen this project? It will be moved back to
          active projects.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Reopen Project</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
