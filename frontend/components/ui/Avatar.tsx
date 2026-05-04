interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold`}
    >
      {initials}
    </div>
  );
}