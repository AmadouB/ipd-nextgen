"use client";

import { MoreVertical, Pencil, RefreshCw, Trash2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RowActionsProps {
  label?: string;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onRefresh?: () => void;
  onDelete?: () => void;
  align?: "start" | "center" | "end";
  className?: string;
}

/** Menu d'actions standard pour les lignes de tableaux : ⋮ → Modifier / Actualiser / Dupliquer / Supprimer */
export function RowActions({
  label,
  onEdit,
  onDuplicate,
  onRefresh,
  onDelete,
  align = "end",
  className,
}: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Actions sur la ligne"
          className={cn(
            "inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur",
            className
          )}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-44">
        {label && (
          <>
            <DropdownMenuLabel className="text-[10px] truncate">{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 mr-2" /> Modifier
          </DropdownMenuItem>
        )}
        {onRefresh && (
          <DropdownMenuItem onClick={onRefresh}>
            <RefreshCw className="h-3.5 w-3.5 mr-2" /> Actualiser
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="h-3.5 w-3.5 mr-2" /> Dupliquer
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-feedback-danger focus:text-feedback-danger focus:bg-feedback-danger/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
