import Image from "next/image";

type Profile = "marcus" | "marisol" | "jordan";

const PROFILES: { id: Profile; label: string; image: string }[] = [
  { id: "marcus", label: "Marcus", image: "/images/profiles/Marcus.png" },
  { id: "marisol", label: "Marisol", image: "/images/profiles/Marisol.png" },
  { id: "jordan", label: "Jordan", image: "/images/profiles/Jordan.png" },
];

type Props = {
  active: Profile;
  onChange: (profile: Profile) => void;
};

export default function ProfileSwitcher({ active, onChange }: Props) {
  return (
    <div className="flex gap-3">
      {PROFILES.map(({ id, label, image }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex flex-col items-center gap-1.5 group transition-opacity ${
            active === id ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full overflow-hidden ring-2 transition-all ${
              active === id ? "ring-zinc-900" : "ring-transparent"
            }`}
          >
            <Image
              src={image}
              alt={label}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-zinc-700">{label}</span>
        </button>
      ))}
    </div>
  );
}

export type { Profile };
