import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Upload any exam",
    description: "PDF, photo, or paste text. We handle the extraction.",
  },
  {
    title: "AI-generated questions",
    description: "Similar exam-style questions generated instantly from your materials.",
  },
  {
    title: "Target weak topics",
    description: "See exactly where you're struggling and drill those first.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <img src="/logo.png" alt="Exai" className="h-7 w-7 object-contain" />
            <span className="font-semibold text-gray-900 dark:text-white tracking-tight">Exai</span>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth?mode=signup">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
          Practice smarter
          <br />
          for your exams
        </h1>
        <p className="mt-5 text-lg text-gray-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Upload your past exams and get AI-generated practice questions.
          Study one question at a time and crush your weak topics fast.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/auth?mode=signup">Start for free</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between gap-4 text-sm text-gray-400 dark:text-zinc-500">
          <span>© {new Date().getFullYear()} Exai</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
