export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800 py-8">

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center text-zinc-400 md:flex-row">

        <p>
          © 2026 Spin-Yuk. All rights reserved.
        </p>

        <div className="flex gap-6">

          <button className="transition hover:text-white">
            About
          </button>

          <button className="transition hover:text-white">
            Features
          </button>

          <button className="transition hover:text-white">
            Contact
          </button>

        </div>
      </div>

    </footer>
  );
}