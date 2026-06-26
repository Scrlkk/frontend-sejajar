import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export interface TeamMemberItem {
  name: string;
  role: string;
  initials: string;
  avatarBg: string; // Tailwind bg- and text- color class, e.g. "bg-indigo-100 text-indigo-600"
  statusDotColor?: string; // Tailwind color class, e.g. "bg-emerald-500"
}

export interface TeamsMemberProps {
  title?: string;
  members?: TeamMemberItem[];
  maxHeight?: string; // Tailwind class, e.g. "max-h-[280px]" or "h-[250px]"
}

export function TeamsMember({
  title = "Team Members",
  members = [],
  maxHeight = "max-h-[264px]",
}: TeamsMemberProps) {
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      {/* Header Title with Member Count */}
      <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </CardTitle>
        <span className="text-xs font-semibold text-slate-400/90  px-2.5 py-0.5">
          {members.length} Members
        </span>
      </CardHeader>

      {members.length === 0 ? (
        <CardContent
          className={`p-0 flex flex-col items-center justify-center text-center py-6 ${maxHeight}`}
        >
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 mb-1.5 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-gray-700">
            Belum Ada Anggota
          </span>
          <span className="text-[11px] text-gray-500 font-medium max-w-44 leading-relaxed mt-0.5">
            Tugaskan anggota tim ke dalam kontrak ini untuk mengelola produksi
            konten.
          </span>
        </CardContent>
      ) : (
        <CardContent
          className={`p-0 flex flex-col gap-3 overflow-y-auto ${maxHeight} scrollbar-none`}
        >
          {members.map((member) => (
            <div
              key={member.name}
              className="flex items-center justify-between py-0.5"
            >
              {/* Left: Avatar, Name, and Role */}
              <div className="flex items-center gap-3">
                {/* Initials Avatar */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${member.avatarBg}`}
                >
                  {member.initials}
                </div>

                {/* Name & Role Stack */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 leading-tight">
                    {member.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium mt-0.5">
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Right: Status Dot */}
              <div
                className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  member.statusDotColor || "bg-gray-300"
                }`}
              />
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
