import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface CloseProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
export const CloseProjectDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: CloseProjectDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Close Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to close this project? You can re-open it later
          from the closed project tab
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Clear Project
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
