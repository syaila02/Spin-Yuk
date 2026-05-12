import { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-2 hover:border-purple-500">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600">
        <Icon size={28} />
      </div>

      <h2 className="mb-3 text-xl font-bold text-white">
        {title}
      </h2>

      <p className="text-zinc-400">
        {description}
      </p>
    </div>
  );
}