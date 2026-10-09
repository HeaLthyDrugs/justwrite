export const blogMarkdown: Record<string, string> = {
  "why-local-first-apps-matter": `# Why Local-First Apps Matter for Your Privacy

In the last decade, we've become accustomed to the cloud. We type our thoughts into apps, and they instantly beam to a data center halfway across the world. But this convenience comes at a cost: privacy, ownership, and sometimes, reliability.

## The Shift to Local-First
Local-first software flips the cloud-first model on its head. Instead of your app being a thin client that relies on a server to do the heavy lifting, a local-first app treats your device as the primary source of truth. The data lives with you, first and foremost.

### Privacy by Default
When data lives on your device, you control it. In a traditional cloud architecture, the provider can theoretically read your data. Even if they promise not to, a data breach could expose it. Local-first apps, especially when combined with End-to-End Encryption (E2EE), ensure that nobody but you (and those you explicitly share with) can read your information.

### Speed and Reliability
Have you ever opened an app on a train or in an elevator, only to stare at a loading spinner? Local-first apps load instantly because the data is already there. They don't need a network connection to open your notes or save your work. Syncing happens in the background when a connection is available.

## How Justwrite Implements Local-First
At Justwrite, we built our architecture around these principles:
- **In-Browser Storage:** We use localStorage and IndexedDB to save your notes instantly to your device.
- **Zero-Knowledge Sync:** When you connect devices, we use AES-256-GCM encryption. The encryption happens in your browser, so our servers only ever receive encrypted gibberish.
- **No Accounts Required:** You don't need to give us your email. Your device is your identity.

The local-first movement is about giving power back to the user. It's about building software that respects your privacy, values your time, and works when you need it to, regardless of your internet connection.`,

  "distraction-free-writing-guide": `# The Complete Guide to Distraction-Free Writing

Writing is hard enough without your tools actively working against you. In a world of notifications, infinite scrolls, and feature-bloated word processors, finding focus can feel like an impossible task.

## The Cost of Distraction
Every time you switch contexts—from writing to checking an email, from a paragraph to a Slack message—you pay a cognitive penalty. Research suggests it can take up to 23 minutes to fully regain focus after an interruption. For a writer, this means lost momentum and broken flow states.

## Techniques for Deep Work
### 1. The Minimalist Toolkit
Complex formatting options, toolbars, and spell-check squiggles pull your attention away from the words. Embrace plain text or Markdown. Use tools that hide the interface when you start typing. Justwrite was built exactly for this: a blank page, your words, and nothing else.

### 2. Time Blocking (The Pomodoro Technique)
Don't just say you'll write "today." Set a specific time block. The Pomodoro technique—25 minutes of focused work followed by a 5-minute break—is incredibly effective for writing. It lowers the barrier to entry. Anyone can focus for 25 minutes.

### 3. Environmental Design
Design your environment for success. Put your phone in another room. Use apps like Freedom or Cold Turkey to block distracting websites. Consider ambient noise—rain sounds or white noise can help drown out the unpredictable sounds of your environment, creating a predictable sonic space for focus.

## Building the Habit
Distraction-free writing isn't just about the software you use; it's a practice. Start small. Aim for just one 25-minute focused session a day. Protect that time fiercely. Over time, you'll find that stepping into the flow state becomes easier, and the words come faster.`,

  "understanding-end-to-end-encryption": `# Understanding End-to-End Encryption in Web Apps

End-to-End Encryption (E2EE) is often treated as a buzzword, but it's fundamentally changing how we build secure web applications. Unlike traditional encryption where the server can read your data, E2EE ensures that only you and your intended recipients can decipher the information.

## Symmetric vs. Asymmetric Encryption
To understand E2EE, we need to understand the two main types of encryption:
- **Symmetric Encryption:** The same key is used to lock (encrypt) and unlock (decrypt) the data. It's fast and efficient, perfect for encrypting large amounts of data like notes or files. AES (Advanced Encryption Standard) is the most common algorithm here.
- **Asymmetric Encryption:** Uses a pair of keys—a public key to encrypt, and a private key to decrypt. This is crucial for securely sharing data or establishing secure connections.

## Web Crypto API in Action
Modern browsers have powerful encryption capabilities built-in via the Web Crypto API. Here's a simplified example of how you might derive a key and encrypt some data, similar to how Justwrite secures your notes:

\`\`\`javascript
// 1. Derive an AES-GCM key from a password using PBKDF2
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
};
\`\`\`

## The Magic of URL Hash Fragments
When sharing an encrypted note in Justwrite, we use URL hash fragments (e.g., https://justwrite.sbs/s/note#key=secret). This is a crucial security feature. Browsers do not send the part of the URL after the # to the server. The server only sees /s/note. The browser downloads the encrypted data, extracts the key from the hash, and decrypts the note locally. The server remains completely blind to the contents.

E2EE in the browser empowers developers to build applications that genuinely respect user privacy, shifting the trust from the service provider to the cryptography itself.`,

  "markdown-writing-guide": `# Markdown for Writers: A Practical Guide

Markdown is a lightweight markup language that lets you format text using simple, readable symbols. It was created by John Gruber in 2004 with the goal of making it easy to write using an easy-to-read, plain text format, which can optionally be converted to structurally valid HTML.

## Why Writers Love Markdown
The primary advantage of Markdown is flow. In a traditional word processor, formatting means stopping your typing, reaching for the mouse, highlighting text, and clicking a button. With Markdown, formatting happens inline. Your hands never leave the keyboard.

## The Essential Syntax

### Headings
Use hash symbols (#) for headings. The number of hashes determines the level.
\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
\`\`\`

### Emphasis
Use asterisks or underscores for italics and bold text.
\`\`\`markdown
*This text is italicized*
**This text is bold**
***This text is both***
\`\`\`

### Lists
Use hyphens, plus signs, or asterisks for bulleted lists, and numbers for numbered lists.
\`\`\`markdown
- First item
- Second item
  - Nested item

1. Step one
2. Step two
\`\`\`

### Links and Images
Links and images use a similar syntax, with images prefixed by an exclamation mark.
\`\`\`markdown
[Justwrite website](https://justwrite.sbs)
![Alt text for an image](/path/to/image.jpg)
\`\`\`

## Making it a Habit
The best way to learn Markdown is to use it. Start by incorporating basic headings and bold text into your notes. As you become more comfortable, explore advanced features like tables, blockquotes, and code blocks. Once you get used to the speed and simplicity of Markdown, it's hard to go back to rich-text editors.`,

  "offline-first-web-apps": `# How Offline-First Web Apps Work

For a long time, the web assumed a reliable, fast internet connection. If you went offline, you got the dreaded dinosaur game. Offline-first development changes this paradigm, ensuring that web apps remain functional, even robust, when the network drops.

## The Core Technologies
Building offline-first web apps relies on two critical pieces of browser technology: Service Workers and Client-Side Storage.

### Service Workers: The Network Proxy
A Service Worker is a script that your browser runs in the background, separate from a web page. It acts as a proxy server that sits between web applications, the browser, and the network. It can intercept network requests and decide how to respond to them.

Common caching strategies include:
- **Cache-First:** The service worker checks the cache for a resource. If it's there, it returns it instantly. If not, it fetches it from the network. This is great for static assets like images and CSS.
- **Network-First:** The service worker tries to fetch the resource from the network. If it succeeds, it caches it. If the network fails, it falls back to the cache. This is better for data that changes frequently.

### Client-Side Storage
To use an app offline, the user's data must be stored locally. localStorage is simple but synchronous and limited in size. IndexedDB is the standard for robust offline storage. It's an asynchronous, transactional database system embedded in the browser, capable of storing large amounts of structured data.

## The Synchronization Challenge
The hardest part of offline-first isn't storing data locally; it's syncing it when the user comes back online. What happens if a user edits a note on their phone while offline, and also edits it on their laptop? Conflict resolution strategies (like Last-Write-Wins or Operational Transformation) are required to handle these scenarios gracefully.

At Justwrite, we rely heavily on client-side storage to ensure your writing experience is never interrupted by a spotty connection. The browser is no longer just a document viewer; it's a powerful operating environment capable of running sophisticated, resilient applications.`,
};
