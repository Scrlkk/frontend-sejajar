interface AvatarUserProps {
  initials: string;
  avatarBg: string;
  className?: string;
  size?: "sm" | "md" | "lg" | string;
}

export function AvatarUser({
  initials,
  avatarBg,
  className = "",
  size = "md",
}: AvatarUserProps) {
  let sizeClass = "h-8 w-8 text-xs";
  if (size === "sm") {
    sizeClass = "h-6 w-6 text-[10px]";
  } else if (size === "lg") {
    sizeClass = "h-9 w-9 text-xs";
  } else if (size !== "md") {
    sizeClass = size;
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm shrink-0 ${avatarBg} ${className}`}
    >
      {initials}
    </div>
  );
}
