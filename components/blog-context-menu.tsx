"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/lib/blog";

interface BlogContextMenuProps {
  post: BlogPost;
  postUrl: string;
  markdownContent: string;
}

export function BlogContextMenu({
  post,
  postUrl,
  markdownContent,
}: BlogContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedModal, setCopiedModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown or modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowMarkdownModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const getAiPrompt = () => {
    return `Please read and analyze this article from Justwrite (https://justwrite.sbs):

Title: "${post.title}"
URL: ${postUrl}

Content:
${markdownContent}

---
Please provide a concise summary, key takeaways, and answer any follow-up questions based on this article.`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleViewAsMarkdown = async () => {
    setIsOpen(false);
    await copyToClipboard(markdownContent);
    setShowMarkdownModal(true);
    triggerToast("Markdown copied to clipboard");
  };

  const handleOpenAi = async (platform: string, getUrl: (prompt: string) => string) => {
    setIsOpen(false);
    const prompt = getAiPrompt();
    await copyToClipboard(prompt);
    triggerToast(`Context copied! Opening in ${platform}...`);
    const targetUrl = getUrl(prompt);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button: Premium rounded pill with tactile inner shadow texture */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open article in AI or view as Markdown"
        className="group inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/90 bg-white/90 px-3 py-1.5 text-xs font-mono font-medium text-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all duration-150 hover:bg-zinc-50 hover:text-zinc-900 hover:shadow-[0_2px_6px_rgba(0,0,0,0.07),inset_0_1px_1px_rgba(255,255,255,0.9)] active:translate-y-px active:shadow-inner dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300 dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100"
      >
        <svg
          className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <span>MDX</span>
        <svg
          className={`h-3 w-3 text-zinc-400 transition-transform duration-200 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu: Clean white frosted glass, rounded-2xl, premium inner + outer shadow */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-2xl border border-zinc-200/90 bg-white/95 p-1.5 text-xs text-zinc-800 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.02)] backdrop-blur-xl focus:outline-none animate-in fade-in zoom-in-95 duration-100 dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-200 dark:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.06)]"
        >
          {/* View as Markdown */}
          <button
            type="button"
            role="menuitem"
            onClick={handleViewAsMarkdown}
            className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-zinc-700 transition-all duration-150 hover:bg-zinc-100/90 hover:text-zinc-950 hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
                <path fillRule="evenodd" d="M3 10V6h1.2l1.3 1.8L6.8 6H8v4H6.8V7.8L5.5 9.5h-.1L4.2 7.8V10H3zm7.5-2.2V6h1v1.8h1.2l-1.7 2.2-1.7-2.2h1.2z" />
              </svg>
            </span>
            <span>View as Markdown</span>
          </button>

          {/* Open in ChatGPT */}
          <button
            type="button"
            role="menuitem"
            onClick={() =>
              handleOpenAi(
                "ChatGPT",
                (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
              )
            }
            className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-zinc-700 transition-all duration-150 hover:bg-zinc-100/90 hover:text-zinc-950 hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.686zm2.02-3.4764l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.009 8.7766V6.4442a.0663.0663 0 0 1 .0331-.0615l4.8824-2.8197a4.4992 4.4992 0 0 1 6.5356 4.9084zm-9.288 5.4387l-2.37-1.372 2.37-1.372 2.37 1.372-2.37 1.372z" />
              </svg>
            </span>
            <span>Open in ChatGPT</span>
          </button>

          {/* Open in Claude */}
          <button
            type="button"
            role="menuitem"
            onClick={() =>
              handleOpenAi(
                "Claude",
                (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
              )
            }
            className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-zinc-700 transition-all duration-150 hover:bg-zinc-100/90 hover:text-zinc-950 hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
              </svg>
            </span>
            <span>Open in Claude</span>
          </button>

          {/* Open in Grok */}
          <button
            type="button"
            role="menuitem"
            onClick={() =>
              handleOpenAi(
                "Grok",
                (prompt) => `https://grok.com/?q=${encodeURIComponent(prompt)}`
              )
            }
            className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-zinc-700 transition-all duration-150 hover:bg-zinc-100/90 hover:text-zinc-950 hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <circle cx="12" cy="12" r="7" />
                <line x1="5" y1="19" x2="19" y2="5" />
              </svg>
            </span>
            <span>Open in Grok</span>
          </button>

          {/* Open in DeepSeek */}
          <button
            type="button"
            role="menuitem"
            onClick={() =>
              handleOpenAi(
                "DeepSeek",
                (prompt) => `https://chat.deepseek.com/?q=${encodeURIComponent(prompt)}`
              )
            }
            className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-zinc-700 transition-all duration-150 hover:bg-zinc-100/90 hover:text-zinc-950 hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 0 1-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 0 0-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 0 1-.465.137 9.597 9.597 0 0 0-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 0 0 1.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 0 1 1.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 0 1 .415-.287.302.302 0 0 1 .2.288.306.306 0 0 1-.31.307.303.303 0 0 1-.304-.308z" />
              </svg>
            </span>
            <span>Open in DeepSeek</span>
          </button>

          {/* Open in Perplexity */}
          <button
            type="button"
            role="menuitem"
            onClick={() =>
              handleOpenAi(
                "Perplexity",
                (prompt) =>
                  `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`
              )
            }
            className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-zinc-700 transition-all duration-150 hover:bg-zinc-100/90 hover:text-zinc-950 hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
              </svg>
            </span>
            <span>Open in Perplexity</span>
          </button>
        </div>
      )}

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-zinc-200/90 bg-white/95 px-4 py-2.5 text-xs font-mono font-medium text-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150 dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-100 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.06)]">
          ✓ {toastMessage}
        </div>
      )}

      {/* Raw Markdown Modal */}
      {showMarkdownModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowMarkdownModal(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-zinc-200/90 bg-white/95 text-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl dark:border-zinc-800 dark:bg-[#141416]/95 dark:text-zinc-100 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.06)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Raw Markdown
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">· {post.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await copyToClipboard(markdownContent);
                    setCopiedModal(true);
                    triggerToast("Markdown copied to clipboard");
                    setTimeout(() => setCopiedModal(false), 2000);
                  }}
                  className="rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-1 text-xs font-mono text-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] dark:hover:bg-zinc-700 dark:hover:text-white"
                >
                  {copiedModal ? "✓ Copied" : "Copy Markdown"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMarkdownModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <pre className="whitespace-pre-wrap rounded-xl border border-zinc-200/70 bg-zinc-50 p-4 font-mono text-xs leading-relaxed text-zinc-800 shadow-inner selection:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:selection:bg-zinc-700">
                {markdownContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
