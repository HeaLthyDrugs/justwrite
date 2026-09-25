import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link></li>
            <li><Link href="/how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">How It Works</Link></li>
            <li><Link href="/shortcuts" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Shortcuts</Link></li>
            <li><Link href="/changelog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Blog</Link></li>
            <li><Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">About</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link href="/privacy-policy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms of Service</Link></li>
            <li><Link href="/cookie-policy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Cookie Policy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 text-center md:text-left">
        &copy; 2026 Justwrite. All rights reserved.
      </div>
    </footer>
  );
}
