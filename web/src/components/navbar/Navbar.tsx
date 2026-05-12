import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <h1 className="text-2xl font-bold text-purple-500">
          Spin-Yuk
        </h1>

        <div className="flex items-center gap-4">

          <Link href="/login">
            <button className="text-zinc-300 transition hover:text-white">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="rounded-xl bg-purple-600 px-5 py-2 font-medium transition hover:bg-purple-700">
              Register
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
}