type StatCardProps = {
  title: string;
  value: string | number;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/10">

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-purple-500">
        {value}
      </h2>

    </div>
  );
}