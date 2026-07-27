"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User, Project } from "@/lib/types";
import { mockUsers } from "@/lib/data";
import { authApi } from "@/lib/api";
import { toast } from "../ui/toast";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
];

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["ADMIN", "MEMBER", "MANAGER"]),
  department: z.string().min(1, "Department is required"),
});
type MemberFormValues = z.infer<typeof memberSchema>;

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-xs text-red-500 mt-1">{message}</p>
  ) : null;
}

function MemberForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  defaultValues: MemberFormValues;
  onSubmit: (v: MemberFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
          <Input
            {...register("name")}
            placeholder="e.g. Jordan Lee"
            className="rounded-xl"
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="col-span-2">
          <Label className="text-sm font-medium mb-1.5 block">
            Email Address
          </Label>
          <Input
            {...register("email")}
            type="email"
            placeholder="jordan@company.com"
            className="rounded-xl"
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1.5 block">Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1.5 block">Department</Label>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.department?.message} />
        </div>
      </div>

      <DialogFooter className="pt-2 gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-border/50 hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {submitLabel}
        </button>
      </DialogFooter>
    </form>
  );
}

// ─── Invite (create new) ──────────────────────────────────────────────────────

export function InviteMemberDialog({
  open,
  onOpenChange,
  change,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  change: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaults: MemberFormValues = {
    name: "",
    email: "",
    role: "MEMBER",
    department: "",
  };

  const handleSubmit = async (values: MemberFormValues) => {
    try {
      setIsSubmitting(true);
      await authApi.register(values);
      toast.add({
        type: "success",
        title: "New User Added",
        description: "User Added Successfully",
      });
      change(true);
      change(false);
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-bold">
              Invite Member
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add someone new to your team.
            </p>
          </DialogHeader>
          <MemberForm
            defaultValues={defaults}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            submitLabel="Send Invite"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function EditMemberDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  //   const { mutateAsync, isPending } = useUpdateUser();
  const defaults: MemberFormValues = {
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department!,
  };

  const handleSubmit = async (values: MemberFormValues) => {
    // await mutateAsync({ id: user.id, data: values });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-bold">Edit Member</DialogTitle>
          </DialogHeader>
          <MemberForm
            defaultValues={defaults}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={true}
            submitLabel="Save Changes"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add existing user to project ────────────────────────────────────────────

export function AddMemberToProjectDialog({
  project,
  open,
  onOpenChange,
  onAdd,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (userId: string) => void;
}) {
  const allUsers = mockUsers;
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const available = allUsers.filter(
    (u) => !project.members?.some((m) => m.id === u.id),
  );

  const handleAdd = async () => {
    setSaving(true);
    for (const id of selected) onAdd(id);
    setSaving(false);
    setSelected([]);
    onOpenChange(false);
  };

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setSelected([]);
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-sm rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">Add Members</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select people to add to this project.
            </p>
          </DialogHeader>

          {available.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              All team members are already in this project.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {available.map((user) => {
                const isSelected = selected.includes(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggle(user.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-primary/50 bg-primary/5"
                        : "border-border/50 hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-to-br from-primary/70 to-purple-500 text-white",
                      )}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : user.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.department} · {user.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <DialogFooter className="pt-4 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelected([]);
                onOpenChange(false);
              }}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-border/50 hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={selected.length === 0 || saving}
              className="px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Add {selected.length > 0 ? `(${selected.length})` : ""}
            </button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
