import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User as UserIcon, Shield } from "lucide-react";
import { usersData } from "@/data/mockData";
import toast from "react-hot-toast";
import { LoginLogo } from "@/components/shared/LoginLogo";

export const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("id") || "owner";

  // Use key to completely reset ProfileForm state when userIdParam changes
  return <ProfileForm key={userIdParam} userIdParam={userIdParam} />;
};

const ProfileForm = ({ userIdParam }: { userIdParam: string }) => {
  // Load user details dynamically if id is provided in the query params
  const targetUser =
    userIdParam !== "owner"
      ? usersData.find((u) => String(u.id) === String(userIdParam))
      : null;

  const [name, setName] = useState(
    targetUser ? targetUser.name : "Asep Racing",
  );
  const [email, setEmail] = useState(
    targetUser ? targetUser.email : "asep@exapmle.com",
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const role = targetUser ? targetUser.role : "Owner";

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentPassword) {
      if (newPassword && newPassword !== confirmPassword) {
        toast.error("Konfirmasi password baru tidak cocok!");
        return;
      }

      if (!newPassword) {
        toast.error("Silakan masukkan password baru Anda!");
        return;
      }
    }

    // In a real application, we would call an API here.
    toast.success("Profil berhasil diperbarui!");

    // Clear password fields after save
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
                <span>{role}</span>
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
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Masukkan password saat ini untuk mengubah password"
                        className="w-full px-3.5 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                      />
                    </div>

                    {currentPassword && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-gray-400" />
                            Password Baru
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Masukkan password baru"
                            className="w-full px-3.5 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-gray-400" />
                            Konfirmasi Password Baru
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Konfirmasi password baru"
                            className="w-full px-3.5 py-2 bg-gray-55/50 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-10"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    className="bg-red-800 hover:bg-red-900 text-white font-semibold rounded-lg px-6 py-2.5 transition-all text-xs cursor-pointer shadow-md h-10"
                  >
                    Simpan Perubahan
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
