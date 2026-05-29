"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type FieldType = "text" | "textarea" | "number" | "date" | "select";

export interface EditField {
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: string | number;
  options?: { value: string; label: string }[]; // pour select
  required?: boolean;
  placeholder?: string;
  hint?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  fields: EditField[];
  onSave: (values: Record<string, string>) => void;
}

/** Modal de modification générique pour les lignes de tableau */
export function EditModal({ open, onOpenChange, title, description, fields, onSave }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  // Reset quand ouvre / fields changent
  useEffect(() => {
    if (open) {
      const init: Record<string, string> = {};
      fields.forEach((f) => {
        init[f.key] = String(f.defaultValue ?? "");
      });
      setValues(init);
    }
  }, [open, fields]);

  function set(key: string, v: string) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-brand-pasteur" />
            {title}
          </DialogTitle>
          <DialogDescription className={description ? undefined : "sr-only"}>
            {description ?? "Formulaire de modification — auto-save CRDT."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label htmlFor={f.key} className="text-xs font-semibold">
                {f.label} {f.required && <span className="text-feedback-danger">*</span>}
              </label>
              {f.type === "textarea" && (
                <Textarea
                  id={f.key}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  required={f.required}
                />
              )}
              {(f.type === "text" || f.type === "number") && (
                <Input
                  id={f.key}
                  type={f.type}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              )}
              {f.type === "date" && (
                <Input
                  id={f.key}
                  type="date"
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  required={f.required}
                />
              )}
              {f.type === "select" && (
                <select
                  id={f.key}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  required={f.required}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur"
                >
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
              {f.hint && <div className="text-[10px] text-muted-foreground">{f.hint}</div>}
            </div>
          ))}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
