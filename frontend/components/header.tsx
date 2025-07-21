import Link from "next/link";

export default function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center justify-center py-6">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-vera-500 to-vera-600 text-white font-bold text-xl shadow-lg">
          V
        </div>
        <div className="text-2xl font-bold text-white">
          VERA <span className="text-vera-400">AI</span>
        </div>
      </Link>

      <div className="absolute right-3">
        <a
          href="https://github.com/your-org/vera"
          target="_blank"
          className="ml-auto hidden items-center gap-3 rounded-full bg-gray-800/95 px-5 py-2 text-sm font-medium text-gray-300 shadow-sm ring-1 ring-gray-600 transition-all hover:bg-gray-700 hover:shadow-md hover:ring-gray-500 sm:flex"
        >
          <svg
            className="h-[18px] w-[18px] fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
          </svg>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white">Open Source</span>
          </div>
        </a>
      </div>
    </header>
  );
}
