import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff } from "lucide-react";
import type { UserData } from "@/features/users/api/usersApi";

export type UserRoleType = "Owner" | "Content Lead" | "Admin Social Media" | "Content Editor" | "Script Writer";

export type UserFormValues = {
  fullName: string;
  email: string;
  password?: string;
  role: UserRoleType[];
  isActive: boolean;
};

const AVAILABLE_ROLES = [
  { value: "Owner", label: "Owner", description: "View reports & analytics", color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100/40", activeCheck: "bg-amber-600 border-amber-600 text-white" },
  { value: "Content Lead", label: "Content Lead", description: "Manage workflows & plans", color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100/40", activeCheck: "bg-blue-600 border-blue-600 text-white" },
  { value: "Admin Social Media", label: "Admin Social Media", description: "Schedule posts & channels", color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/40", activeCheck: "bg-emerald-600 border-emerald-600 text-white" },
  { value: "Content Editor", label: "Content Editor", description: "Edit assets & uploads", color: "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100/40", activeCheck: "bg-pink-600 border-pink-600 text-white" },
  { value: "Script Writer", label: "Script Writer", description: "Write & refine scripts", color: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100/40", activeCheck: "bg-purple-600 border-purple-600 text-white" }
] as const;


interface ModalUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormValues & { id?: number }) => void;
  user?: UserData | null;
}

export const ModalUsers = ({ isOpen, onClose, onSave, user }: ModalUsersProps) => {
  const isEdit = !!user;

  const [fullName, setFullName] = React.useState(user ? (user.name || "") : "");
  const [email, setEmail] = React.useState(user ? (user.email || "") : "");
  const [password, setPassword] = React.useState("");
  const getInitialRoles = (): UserRoleType[] => {
    if (!user || !user.role) return [];
    return user.role.split(",").map((r) => {
      const clean = r.trim();
      return (clean === "Editor" ? "Content Editor" : clean) as UserRoleType;
    });
  };
  const [role, setRole] = React.useState<UserFormValues["role"]>(getInitialRoles());
  const [isActive, setIsActive] = React.useState(user ? user.status === "active" : true);
  const [errors, setErrors] = React.useState<{ fullName?: string; email?: string; password?: string; role?: string }>({});
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Password criteria helper checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[@$!%*?&]/.test(password);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    
    // Validate password if new user, or if editing and password is not empty
    const shouldValidatePassword = !isEdit || password.length > 0;
    if (shouldValidatePassword) {
      if (!hasMinLength) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!hasUppercase) {
        newErrors.password = "Password must contain at least one uppercase letter (A-Z)";
      } else if (!hasLowercase) {
        newErrors.password = "Password must contain at least one lowercase letter (a-z)";
      } else if (!hasNumber) {
        newErrors.password = "Password must contain at least one number (0-9)";
      } else if (!hasSymbol) {
        newErrors.password = "Password must contain at least one symbol (@$!%*?&)";
      }
    }

    if (role.length === 0) {
      newErrors.role = "Please select at least one user role";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      fullName,
      email,
      role,
      isActive,
      ...(password ? { password } : {}),
      id: user?.id,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-120 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit User Account" : "Create New User"}
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            {isEdit
              ? "Update the details and permissions for this user account."
              : "Fill in the details below to add a new team member."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 py-3 px-1.5 pr-2.5 scrollbar-none">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`rounded-xl border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                errors.fullName ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`rounded-xl border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Password
              </Label>
              {isEdit && (
                <span className="text-[10px] text-gray-400 font-medium italic">
                  Leave blank to keep current password
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className={`rounded-xl border-gray-200 bg-gray-50/50 pr-10 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer flex items-center justify-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password}</p>
            )}

            {/* Password checklist criteria */}
            {((isPasswordFocused && (password.length > 0 || !isEdit)) || (!isPasswordFocused && password.length > 0)) && 
             (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                {!hasMinLength && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    <span className="text-gray-500">Min. 8 Karakter</span>
                  </div>
                )}
                {!hasUppercase && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    <span className="text-gray-500">Huruf Besar (A-Z)</span>
                  </div>
                )}
                {!hasLowercase && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    <span className="text-gray-500">Huruf Kecil (a-z)</span>
                  </div>
                )}
                {!hasNumber && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    <span className="text-gray-500">Angka (0-9)</span>
                  </div>
                )}
                {!hasSymbol && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    <span className="text-gray-500">Simbol (@$!%*?&)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Role selection using dynamic grid checklist */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Assigned Roles (Pilih satu atau lebih)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_ROLES.map((item) => {
                const isSelected = role.includes(item.value);
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setRole(role.filter((r) => r !== item.value));
                      } else {
                        setRole([...role, item.value]);
                      }
                    }}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${item.color} ring-1 ring-offset-0`
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className={`flex items-center justify-center h-4.5 w-4.5 rounded border mt-0.5 shrink-0 transition-colors ${
                      isSelected ? item.activeCheck : "border-gray-300 bg-white"
                    }`}>
                      {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900">
                        {item.label}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="text-xs text-red-500 font-medium">{errors.role}</p>
            )}
          </div>

          {/* Status (is_active) styled as an Action Card/Toggle */}
          {isEdit && (
            <div className="space-y-2.5 py-3 border-t border-gray-100">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Account Status
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Active Option */}
                <button
                  type="button"
                  onClick={() => setIsActive(true)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50/30 text-emerald-950 ring-1 ring-emerald-500/30"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    Active
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    User has full access and can log in normally.
                  </p>
                </button>

                {/* Inactive Option (Soft Deleted) */}
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    !isActive
                      ? "border-red-500 bg-red-50/20 text-red-950 ring-1 ring-red-500/20"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <span className={`h-2.5 w-2.5 rounded-full ${!isActive ? 'bg-red-500' : 'bg-gray-400'}`} />
                    Delete
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    Access is revoked. Account can be reactivated anytime.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

          {/* Footer buttons */}
          <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sm:space-x-0 shrink-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={fullName.trim().length < 2 || !email || !/\S+@\S+\.\S+/.test(email) || role.length === 0 || (!(!isEdit || password.length > 0) ? false : !(hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSymbol))}
              className="rounded-xl bg-red-800 hover:bg-red-900 text-white font-medium px-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? "Save Changes" : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};