import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "About Justwrite | A Local-First Notes App",
  description: "Learn more about Justwrite, a local-first, privacy-focused notes app built for distraction-free writing with end-to-end encryption.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">About Justwrite</h1>
        
        <div className="space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <p>
            Welcome to Justwrite. At its core, Justwrite is a local-first, privacy-focused notes application designed to bring the joy back into everyday writing. It offers a clean, minimalistic environment where your thoughts can flow without the clutter and noise typically associated with modern word processors.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">Why It Was Built</h2>
          <p>
            The modern web is filled with exceptional productivity tools, but they often come with heavy compromises. Most note-taking applications require you to create an account, sign in, and stay connected to the internet. They store your deeply personal thoughts, drafts, and ideas on external servers. We believe there is a better way. Justwrite was built to solve this problem: to offer a fast, reliable, and entirely private space to write without ever requiring a login or relying on a constant cloud connection.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">Key Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Distraction-Free Writing:</strong> A minimalist UI that stays out of your way.</li>
            <li><strong>Offline Support:</strong> Works perfectly without an internet connection.</li>
            <li><strong>No Login Required:</strong> Start typing immediately. No accounts, no onboarding.</li>
            <li><strong>Autosave:</strong> Your progress is saved locally as you type.</li>
            <li><strong>E2E Encryption & Sync:</strong> Secure multi-device synchronization through end-to-end encryption.</li>
            <li><strong>Markdown Support:</strong> Format your text quickly using familiar Markdown syntax.</li>
            <li><strong>Ambient Modes:</strong> Customizable themes and soundscapes for deeper focus.</li>
            <li><strong>Installable PWA:</strong> Install Justwrite to your home screen or desktop for a native app experience.</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">Our Privacy Philosophy</h2>
          <p>
            Your notes belong to you. We have structured Justwrite around a zero-knowledge architecture. All your content is saved directly to your device's local storage. When you choose to sync across devices, your data is secured using military-grade End-to-End (E2E) encryption before it ever leaves your browser. This means that nobody—not even the creators of Justwrite—can read your notes. Privacy isn't just a feature; it's the foundation of the app.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">Under the Hood</h2>
          <p>
            Built by Manish, an indie developer passionate about building tools that respect user autonomy. Justwrite is launched with care and precision, leveraging the power of Next.js and the modern web platform. The app runs entirely in your browser, utilizing the native Web Crypto API to handle secure encryption algorithms flawlessly and efficiently.
          </p>
          
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">Useful Links</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><Link href="/how-it-works" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100">How It Works</Link></li>
            <li><Link href="/changelog" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100">Changelog</Link></li>
            <li><Link href="/shortcuts" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100">Keyboard Shortcuts</Link></li>
          </ul>
        </div>

        <AdBanner className="mt-8" />

        <Footer />
      </div>
    </main>
  );
}
