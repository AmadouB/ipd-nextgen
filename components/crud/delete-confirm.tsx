"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  itemLabel?: string;
  onConfirm: () => void;
}

export function DeleteConfirm({ open, onOpenChange, title, description, itemLabel, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-full bg-feedback-danger/10 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-feedback-danger" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className={description ? "text-center pt-1" : "sr-only"}>
            {description ?? "Confirmation de suppression — action irréversible."}
          </DialogDescription>
          {itemLabel && (
            <div className="mt-2 rounded-md bg-muted/40 border p-2 text-center text-xs font-mono break-all">
              {itemLabel}
            </div>
          )}
        </DialogHeader>
        <div className="text-[11px] text-muted-foreground text-center">
          Cette action est <strong>irréversible</strong>. Elle sera tracée dans l'audit log §29.4.
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Confirmer la suppression
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
