import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Exai",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Exai" className="h-7 w-7 object-contain" />
            <span className="font-semibold text-gray-900 dark:text-white tracking-tight">Exai</span>
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-2">Last updated: March 2026</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-3 text-gray-500 dark:text-zinc-400 leading-relaxed">
            This Privacy Policy explains how Exai collects, uses, and protects your information when you use our service.
          </p>
        </div>

        <div className="space-y-10 text-gray-700 dark:text-zinc-300">

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Introduction</h2>
            <p className="leading-relaxed">
              Exai is a study tool that helps university students prepare for exams using AI-generated practice questions.
              You upload past exams or course materials, and Exai generates similar exam-style questions to help you
              study effectively, track your weak topics, and improve your performance over time.
            </p>
            <p className="leading-relaxed">
              By using Exai, you agree to the collection and use of information described in this policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Information We Collect</h2>
            <p className="leading-relaxed">We collect only the information necessary to provide the service:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Your account email address, used to identify your account and send important notices.",
                "Course materials you upload (PDFs, images, documents), used to generate practice questions.",
                "Generated questions, your answers, and grading results, used to track your progress and weak topics.",
                "Basic usage data needed to operate and improve the service.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Uploaded Materials</h2>
            <p className="leading-relaxed">
              Files and text you upload to Exai are used to generate practice questions and topic insights specific
              to your courses. Your materials are stored securely and are never shared with other users.
              Each user&apos;s data is isolated and accessible only to them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. AI Processing</h2>
            <p className="leading-relaxed">
              To generate practice questions and grade your answers, content you upload or submit may be
              processed by AI models provided by third-party services (such as OpenAI). This processing is
              done on a per-request basis to operate the core features of Exai. We do not use your content
              to train AI models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Data Security</h2>
            <p className="leading-relaxed">
              We take reasonable technical and organizational measures to protect your account and uploaded
              materials from unauthorized access, loss, or misuse. Your data is stored using industry-standard
              cloud infrastructure with access controls in place.
            </p>
            <p className="leading-relaxed">
              No method of transmission over the internet is 100% secure. While we work to protect your data,
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Data Retention</h2>
            <p className="leading-relaxed">
              You can delete your courses and uploaded materials at any time from within the app.
              When you delete a course, all associated materials, generated questions, and answer history are
              removed. If you wish to delete your account entirely, contact us and we will remove your data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time as the service evolves. When we make
              significant changes, we will update the date at the top of this page. Continued use of Exai
              after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Contact</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy or how your data is handled, please reach out
              through the app or the contact information provided on our website.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-zinc-800 mt-16">
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
