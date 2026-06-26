import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { LoginLogo } from "@/components/shared/LoginLogo";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserByIdApi, updateUserApi } from "@/features/users/api/usersApi";

interface UserProfileData {
  id: number;
  full_name: string;
  email: string;
  role: string;
  roles?: string[];
}

export const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("id") || "owner";
  const { user: currentUser } = useAuth();
  const isSpecificUser = userIdParam !== "owner" && userIdParam !== "";

  const { data: fetchedUser, isLoading } = useQuery({
    queryKey: ["user", userIdParam],
    queryFn: () => getUserByIdApi(Number(userIdParam)),
    enabled: isSpecificUser,
  });

  if (isSpecificUser && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800" />
      </div>
    );
  }

  const targetUser = isSpecificUser
    ? fetchedUser
      ? {
          id: fetchedUser.id,
          full_name: fetchedUser.full_name,
          email: fetchedUser.email,
          role: fetchedUser.roles
            .map((r) => r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
            .join(", "),
        }
      : null
    : currentUser
      ? {
          id: currentUser.id,
          full_name: currentUser.full_name,
          email: currentUser.email,
          role:
            currentUser.roles && currentUser.roles.length > 0
              ? currentUser.roles
                  .map((r) => r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
                  .join(", ")
              : currentUser.role
                ? currentUser.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                : "User",
        }
      : null;

  if (!targetUser) {
    return null;
  }

  // Use targetUser.id as key to completely reset ProfileForm state when user changes
  return <ProfileForm key={targetUser.id} initialUser={targetUser} />;
};

const ProfileForm = ({ initialUser }: { initialUser: UserProfileData }) => {
  const { setUser, user: currentUser } = useAuth();
  const [name, setName] = useState(initialUser.full_name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  const role = initialUser.role || "Owner";

  // Password criteria checks
  const newHasMinLength = newPassword.length >= 8;
  const newHasUppercase = /[A-Z]/.test(newPassword);
  const newHasLowercase = /[a-z]/.test(newPassword);
  const newHasNumber = /[0-9]/.test(newPassword);
  const newHasSymbol = /[@$!%*?&]/.test(newPassword);

  const isPasswordValid =
    newHasMinLength &&
    newHasUppercase &&
    newHasLowercase &&
    newHasNumber &&
    newHasSymbol;

  const isSubmitDisabled =
    isSaving ||
    ((currentPassword.length > 0 ||
      newPassword.length > 0 ||
      confirmPassword.length > 0) &&
      (!currentPassword ||
        !isPasswordValid ||
        newPassword !== confirmPassword));

  const getInitials = (fullName: string) => {
    return (
      fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentPassword) {
      if (!newPassword) {
        toast.error("Silakan masukkan password baru Anda!");
        return;
      }

      if (newPassword && newPassword !== confirmPassword) {
        toast.error("Konfirmasi password baru tidak cocok!");
        return;
      }

      if (!isPasswordValid) {
        toast.error("Password baru tidak memenuhi semua kriteria keamanan!");
        return;
      }
    }

    try {
      setIsSaving(true);
      const updateData: {
        full_name?: string;
        email?: string;
        password?: string;
      } = {
        full_name: name,
        email: email,
      };

      if (currentPassword && newPassword) {
        updateData.password = newPassword;
      }

      const updatedUser = await updateUserApi(initialUser.id, updateData);

      // If the updated user is the currently logged in user, update the auth state
      if (currentUser && currentUser.id === initialUser.id) {
        setUser({
          ...currentUser,
          full_name: updatedUser.full_name,
          email: updatedUser.email,
        });
      }

      toast.success("Profil berhasil diperbarui!");

      // Clear password fields after save
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      let errMsg = "Gagal memperbarui profil!";
      if (error && typeof error === "object" && "response" in error) {
        const errObj = error as { response?: { data?: { message?: string } } };
        if (errObj.response?.data?.message) {
          errMsg = errObj.response.data.message;
        }
      }
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pt-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Overview */}
        <div className="md:col-span-1 h-full">
          <Card className="bg-white h-full rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6 flex flex-col items-center text-center justify-between">
            <div className="flex flex-col items-center w-full pb-5">
              <div className="w-24 h-24 bg-red-100 text-red-700 rounded-full flex items-center justify-center shrink-0 shadow-inner select-none mb-4">
                <span className="font-semibold text-3xl tracking-wide">
                  {getInitials(name)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 truncate w-full px-2">
                {name || "Nama Pengguna"}
              </h2>
              <div className="flex items-center gap-1.5 justify-center text-xs font-semibold text-gray-500 mt-1">
                <Shield className="h-3.5 w-3.5 text-red-600" />
                <span className="capitalize">{role}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 truncate w-full px-2">
                {email || "Belum ada email"}
              </p>
            </div>

            <hr className="w-full border-gray-300" />

            <div className="w-full flex-1 flex items-center justify-center pt-5">
              <div className="bg-red-logo p-5 rounded-2xl">
                <LoginLogo className="w-28 h-28 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="md:col-span-2 h-full">
          <Card className="bg-white h-full rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6">
            <CardHeader className="p-0 border-b border-gray-100 pb-4 mb-6">
              <CardTitle className="text-lg font-bold text-gray-900">
                Pengaturan Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Informasi Pribadi */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Informasi Pribadi
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Ubah Password */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Ubah Password
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-gray-400" />
                        Password Saat Ini
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Masukkan password saat ini untuk mengubah password"
                          className="w-full pl-3.5 pr-10 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer flex items-center justify-center"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {currentPassword && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-gray-400" />
                            Password Baru
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              onFocus={() => setIsNewPasswordFocused(true)}
                              onBlur={() => setIsNewPasswordFocused(false)}
                              placeholder="Masukkan password baru"
                              className="w-full pl-3.5 pr-10 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer flex items-center justify-center"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Password checklist criteria */}
                          {((isNewPasswordFocused && newPassword.length > 0) ||
                            (!isNewPasswordFocused &&
                              newPassword.length > 0)) &&
                            !isPasswordValid && (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                                {!newHasMinLength && (
                                  <div className="flex items-center gap-1.5 text-red-500 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Min. 8 Karakter</span>
                                  </div>
                                )}
                                {!newHasUppercase && (
                                  <div className="flex items-center gap-1.5 text-red-500 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Huruf Besar (A-Z)</span>
                                  </div>
                                )}
                                {!newHasLowercase && (
                                  <div className="flex items-center gap-1.5 text-red-500 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Huruf Kecil (a-z)</span>
                                  </div>
                                )}
                                {!newHasNumber && (
                                  <div className="flex items-center gap-1.5 text-red-500 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Angka (0-9)</span>
                                  </div>
                                )}
                                {!newHasSymbol && (
                                  <div className="flex items-center gap-1.5 text-red-500 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Simbol (@$!%*?&)</span>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-gray-400" />
                            Konfirmasi Password Baru
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Konfirmasi password baru"
                              className="w-full pl-3.5 pr-10 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer flex items-center justify-center"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="bg-red-800 hover:bg-red-900 text-white font-semibold rounded-lg px-6 py-2.5 transition-all text-xs cursor-pointer shadow-md h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
