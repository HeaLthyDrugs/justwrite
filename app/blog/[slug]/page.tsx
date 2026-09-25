import Link from "next/link";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/ad-banner";
import { blogPosts } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | Justwrite Blog`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

  const Content = blogContent[params.slug];
  if (!Content) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <article className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-7 text-zinc-600 dark:text-zinc-300 space-y-6">
          <Content />
        </article>

        <AdBanner className="my-10" />

        <div className="pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Back to Blog
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Back to Editor
          </Link>
        </div>
      </div>
    </main>
  );
}

const blogContent: Record<string, React.FC> = {
  "why-local-first-apps-matter": () => (
    <>
      <p>In the last decade, we've become accustomed to the cloud. We type our thoughts into apps, and they instantly beam to a data center halfway across the world. But this convenience comes at a cost: privacy, ownership, and sometimes, reliability.</p>
      
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">The Shift to Local-First</h2>
      <p>Local-first software flips the cloud-first model on its head. Instead of your app being a thin client that relies on a server to do the heavy lifting, a local-first app treats your device as the primary source of truth. The data lives with you, first and foremost.</p>
      
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Privacy by Default</h3>
      <p>When data lives on your device, you control it. In a traditional cloud architecture, the provider can theoretically read your data. Even if they promise not to, a data breach could expose it. Local-first apps, especially when combined with End-to-End Encryption (E2EE), ensure that nobody but you (and those you explicitly share with) can read your information.</p>
      
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Speed and Reliability</h3>
      <p>Have you ever opened an app on a train or in an elevator, only to stare at a loading spinner? Local-first apps load instantly because the data is already there. They don't need a network connection to open your notes or save your work. Syncing happens in the background when a connection is available.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">How Justwrite Implements Local-First</h2>
      <p>At Justwrite, we built our architecture around these principles:</p>
      <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
        <li><strong>In-Browser Storage:</strong> We use <code>localStorage</code> and IndexedDB to save your notes instantly to your device.</li>
        <li><strong>Zero-Knowledge Sync:</strong> When you connect devices, we use AES-256-GCM encryption. The encryption happens in your browser, so our servers only ever receive encrypted gibberish.</li>
        <li><strong>No Accounts Required:</strong> You don't need to give us your email. Your device is your identity.</li>
      </ul>

      <p>The local-first movement is about giving power back to the user. It's about building software that respects your privacy, values your time, and works when you need it to, regardless of your internet connection.</p>
    </>
  ),

  "distraction-free-writing-guide": () => (
    <>
      <p>Writing is hard enough without your tools actively working against you. In a world of notifications, infinite scrolls, and feature-bloated word processors, finding focus can feel like an impossible task.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">The Cost of Distraction</h2>
      <p>Every time you switch contexts—from writing to checking an email, from a paragraph to a Slack message—you pay a cognitive penalty. Research suggests it can take up to 23 minutes to fully regain focus after an interruption. For a writer, this means lost momentum and broken flow states.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Techniques for Deep Work</h2>
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">1. The Minimalist Toolkit</h3>
      <p>Complex formatting options, toolbars, and spell-check squiggles pull your attention away from the words. Embrace plain text or Markdown. Use tools that hide the interface when you start typing. Justwrite was built exactly for this: a blank page, your words, and nothing else.</p>

      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">2. Time Blocking (The Pomodoro Technique)</h3>
      <p>Don't just say you'll write "today." Set a specific time block. The Pomodoro technique—25 minutes of focused work followed by a 5-minute break—is incredibly effective for writing. It lowers the barrier to entry. Anyone can focus for 25 minutes.</p>

      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">3. Environmental Design</h3>
      <p>Design your environment for success. Put your phone in another room. Use apps like Freedom or Cold Turkey to block distracting websites. Consider ambient noise—rain sounds or white noise can help drown out the unpredictable sounds of your environment, creating a predictable sonic space for focus.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Building the Habit</h2>
      <p>Distraction-free writing isn't just about the software you use; it's a practice. Start small. Aim for just one 25-minute focused session a day. Protect that time fiercely. Over time, you'll find that stepping into the flow state becomes easier, and the words come faster.</p>
    </>
  ),

  "understanding-end-to-end-encryption": () => (
    <>
      <p>End-to-End Encryption (E2EE) is often treated as a buzzword, but it's fundamentally changing how we build secure web applications. Unlike traditional encryption where the server can read your data, E2EE ensures that only you and your intended recipients can decipher the information.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Symmetric vs. Asymmetric Encryption</h2>
      <p>To understand E2EE, we need to understand the two main types of encryption:</p>
      <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
        <li><strong>Symmetric Encryption:</strong> The same key is used to lock (encrypt) and unlock (decrypt) the data. It's fast and efficient, perfect for encrypting large amounts of data like notes or files. AES (Advanced Encryption Standard) is the most common algorithm here.</li>
        <li><strong>Asymmetric Encryption:</strong> Uses a pair of keys—a public key to encrypt, and a private key to decrypt. This is crucial for securely sharing data or establishing secure connections.</li>
      </ul>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Web Crypto API in Action</h2>
      <p>Modern browsers have powerful encryption capabilities built-in via the Web Crypto API. Here's a simplified example of how you might derive a key and encrypt some data, similar to how Justwrite secures your notes:</p>

      <div className="rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto border border-zinc-800 shadow-sm mt-4 mb-6">
        <pre>{`// 1. Derive an AES-GCM key from a password using PBKDF2
const deriveKey = async (password, salt) => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// 2. Encrypt the note content
const encryptNote = async (key, text) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, key, encoded
  );
  return { iv, ciphertext };
};`}</pre>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">The Magic of URL Hash Fragments</h2>
      <p>When sharing an encrypted note in Justwrite, we use URL hash fragments (e.g., <code>https://justwrite.sbs/s/note#key=secret</code>). This is a crucial security feature. Browsers <strong>do not send</strong> the part of the URL after the <code>#</code> to the server. The server only sees <code>/s/note</code>. The browser downloads the encrypted data, extracts the key from the hash, and decrypts the note locally. The server remains completely blind to the contents.</p>

      <p>E2EE in the browser empowers developers to build applications that genuinely respect user privacy, shifting the trust from the service provider to the cryptography itself.</p>
    </>
  ),

  "markdown-writing-guide": () => (
    <>
      <p>Markdown is a lightweight markup language that lets you format text using simple, readable symbols. It was created by John Gruber in 2004 with the goal of making it easy to write using an easy-to-read, plain text format, which can optionally be converted to structurally valid HTML.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Why Writers Love Markdown</h2>
      <p>The primary advantage of Markdown is flow. In a traditional word processor, formatting means stopping your typing, reaching for the mouse, highlighting text, and clicking a button. With Markdown, formatting happens inline. Your hands never leave the keyboard.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">The Essential Syntax</h2>
      
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Headings</h3>
      <p>Use hash symbols (<code>#</code>) for headings. The number of hashes determines the level.</p>
      <div className="rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto border border-zinc-800 shadow-sm mt-2 mb-4">
        <pre>{`# Heading 1
## Heading 2
### Heading 3`}</pre>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Emphasis</h3>
      <p>Use asterisks or underscores for italics and bold text.</p>
      <div className="rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto border border-zinc-800 shadow-sm mt-2 mb-4">
        <pre>{`*This text is italicized*
**This text is bold**
***This text is both***`}</pre>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Lists</h3>
      <p>Use hyphens, plus signs, or asterisks for bulleted lists, and numbers for numbered lists.</p>
      <div className="rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto border border-zinc-800 shadow-sm mt-2 mb-4">
        <pre>{`- First item
- Second item
  - Nested item

1. Step one
2. Step two`}</pre>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Links and Images</h3>
      <p>Links and images use a similar syntax, with images prefixed by an exclamation mark.</p>
      <div className="rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto border border-zinc-800 shadow-sm mt-2 mb-4">
        <pre>{`[Justwrite website](https://justwrite.sbs)
![Alt text for an image](/path/to/image.jpg)`}</pre>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Making it a Habit</h2>
      <p>The best way to learn Markdown is to use it. Start by incorporating basic headings and bold text into your notes. As you become more comfortable, explore advanced features like tables, blockquotes, and code blocks. Once you get used to the speed and simplicity of Markdown, it's hard to go back to rich-text editors.</p>
    </>
  ),

  "offline-first-web-apps": () => (
    <>
      <p>For a long time, the web assumed a reliable, fast internet connection. If you went offline, you got the dreaded dinosaur game. Offline-first development changes this paradigm, ensuring that web apps remain functional, even robust, when the network drops.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">The Core Technologies</h2>
      <p>Building offline-first web apps relies on two critical pieces of browser technology: Service Workers and Client-Side Storage.</p>

      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Service Workers: The Network Proxy</h3>
      <p>A Service Worker is a script that your browser runs in the background, separate from a web page. It acts as a proxy server that sits between web applications, the browser, and the network. It can intercept network requests and decide how to respond to them.</p>
      <p>Common caching strategies include:</p>
      <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
        <li><strong>Cache-First:</strong> The service worker checks the cache for a resource. If it's there, it returns it instantly. If not, it fetches it from the network. This is great for static assets like images and CSS.</li>
        <li><strong>Network-First:</strong> The service worker tries to fetch the resource from the network. If it succeeds, it caches it. If the network fails, it falls back to the cache. This is better for data that changes frequently.</li>
      </ul>

      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-3">Client-Side Storage</h3>
      <p>To use an app offline, the user's data must be stored locally. <code>localStorage</code> is simple but synchronous and limited in size. <strong>IndexedDB</strong> is the standard for robust offline storage. It's an asynchronous, transactional database system embedded in the browser, capable of storing large amounts of structured data.</p>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4">The Synchronization Challenge</h2>
      <p>The hardest part of offline-first isn't storing data locally; it's syncing it when the user comes back online. What happens if a user edits a note on their phone while offline, and also edits it on their laptop? Conflict resolution strategies (like Last-Write-Wins or Operational Transformation) are required to handle these scenarios gracefully.</p>

      <p>At Justwrite, we rely heavily on client-side storage to ensure your writing experience is never interrupted by a spotty connection. The browser is no longer just a document viewer; it's a powerful operating environment capable of running sophisticated, resilient applications.</p>
    </>
  ),
};
