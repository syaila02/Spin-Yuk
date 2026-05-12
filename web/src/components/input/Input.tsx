type InputProps = {
  type: string;
  placeholder: string;
};

export default function Input({
  type,
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none transition focus:border-purple-500"
    />
  );
}